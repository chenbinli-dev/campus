<template>
  <div id="taskdetails" class="taskdetails">
    <nav-bar title="任务详情" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <div class="scroll">
      <!--任务详情头-->
      <cell-group>
        <cell title="任务编号" :value="taskInfo.task_number" size="large" />
        <cell title="任务类型" size="large">
          <template #right-icon>
            <tag color="#ffd300">{{taskInfo.type}}</tag>
          </template>
        </cell>
        <cell title="任务状态" size="large">
          <template #right-icon>
            <tag v-if="taskInfo.status === 1" color="#7232dd">闲置</tag>
            <tag v-else-if="taskInfo.status === 2" type="primary">接取</tag>
            <tag v-else-if="taskInfo.status === 3" type="success">完成</tag>
            <tag v-else type="danger">过期</tag>
          </template>
        </cell>
        <cell
          v-if="taskInfo.status === 2 || taskInfo.status === 3"
          title="代跑用户"
          size="large"
          class="receiver"
        >
          <van-image
            width="8vw"
            height="8vw"
            radius="50%"
            lazy-load:true
            show-loading
            :src="receiveUser.avatar_url"
          />
        </cell>
      </cell-group>

      <!--任务详情主体-->
      <cell-group style="margin-top:2vw">
        <cell v-if="taskInfo.owner_id != uid" title="发布用户" size="large">
          <van-image
            width="8vw"
            height="8vw"
            radius="50%"
            lazy-load:true
            show-loading
            :src="releaseUser.avatar_url"
          />
        </cell>
        <cell title="任务标题" :value="taskInfo.title" size="large" />
        <cell title="任务描述" :value="taskInfo.description" size="large" />
        <!--取件码-->
        <collapse v-if="taskInfo.type === '代取快递'" v-model="activeName">
          <collapse-item
            title="取件码"
            name="1"
            size="large"
            :disabled="uid != this.taskInfo.owner_id"
            @click="getFiles"
          >
            <van-image
              width="10rem"
              height="10rem"
              fit="contain"
              v-for="(val,index) in taskInfo.upload_file_url"
              :key="index"
              :src="val"
            />
          </collapse-item>
        </collapse>
        <!--打印文件-->
        <collapse v-if="taskInfo.type === '代打印'" v-model="activeName">
          <collapse-item
            title="待打印文件"
            name="1"
            size="large"
            :disabled="uid != this.taskInfo.owner_id"
            @click="getFiles"
          >
            <ul class="file_list">
              <li v-for="(val,index) in taskInfo.upload_file_url" :key="index">
                <a :href="val" download>
                  <span>{{'文件'}}{{parseInt(index+1)}}</span>
                  <icon name="down" color="#ffd300" size="5vw" />
                </a>
              </li>
            </ul>
          </collapse-item>
        </collapse>
      </cell-group>

      <!--任务进度条，只有被接取任务才有-->
      <div class="task_step" v-if="taskInfo.status === 2 ||taskInfo.status === 3">
        <steps :active="active" direction="vertical" active-color="#ffd300" class="steps">
          <step>
            <p>任务发布</p>
            <p>{{taskInfo.createAt}}</p>
          </step>
          <step v-if="taskInfo.type === '代取快递'">
            <p>快递已取</p>
            <p v-if="process.obtain_delivery_at">{{process.obtain_delivery_at}}</p>
          </step>
          <step v-if="taskInfo.type === '代打印'">
            <p>快递已取</p>
            <p v-if="process.printed_at">{{process.printed_at}}</p>
          </step>
          <step v-if="taskInfo.type === '代购物'">
            <p>快递已取</p>
            <p v-if="process.bought_at">{{process.bought_at}}</p>
          </step>
          <step>
            <p>正在配送</p>
            <p v-if="process.is_sending_at">{{process.is_sending_at}}</p>
          </step>
          <step>
            <p>已送达</p>
            <p v-if="process.arrived_at">{{process.arrived_at}}</p>
          </step>
          <step>
            <p>代跑用户确认完成</p>
            <p v-if="process.receiver_confirm_at">{{process.receiver_confirm_at}}</p>
          </step>
          <step v-if="process.releaser_confirm === 0 && process.arrived === 0">
            <p>发布用户确认完成</p>
          </step>
          <step v-if="process.releaser_confirm === 0 && process.receiver_confirm === 1">
            <van-button color="#ffd300" @click="changeProcess('releaser_confirm')">确认完成</van-button>
          </step>
          <step v-if="process.releaser_confirm === 1">
            <p>已确认，任务完成</p>
            <p v-if="process.releaser_confirm_at">{{process.arrived_at}}</p>
          </step>
        </steps>
      </div>
      <!--任务详情脚-->
      <cell-group style="margin-top:2vw;">
        <cell title="收件人" :value="taskInfo.addressee" size="large" />
        <cell title="联系电话" :value="taskInfo.telephone" size="large" />
        <cell title="收件地址" :value="taskInfo.address" size="large" />
      </cell-group>

      <!--任务栏-->
      <div class="task_bar">
        <div class="show_time">
          <count-down
            :time="new Date(taskInfo.expiration_time) - new Date()"
            v-if="taskInfo.status !== 3"
          >
            <template #default="timeData">
              <span class="time_title">距过期还有</span>
              <span class="blocks">{{ '0' + timeData.days.toString()}}</span>
              <span class="colons">天</span>
              <span class="blocks">{{ timeData.hours }}</span>
              <span class="colons">小时</span>
              <span class="blocks">{{ timeData.minutes }}</span>
              <span class="colons">分</span>
            </template>
          </count-down>
          <div class="time_record" v-else>{{getTimeRecord}}</div>
        </div>
        <div class="show_button">
          <span v-if="uid != this.taskInfo.owner_id" @click="receiveTask">接取</span>
          <span v-if="uid == this.taskInfo.owner_id && taskInfo.status === 1">闲置中</span>
          <span
            v-if="taskInfo.status === 2"
            @click="$router.push({path:'/chat/'+ receiveUser.uid})"
          >
            <icon name="chat-o" size="8vw" />
          </span>
          <span v-if="uid == this.taskInfo.owner_id && taskInfo.status === 3">已完成,去评价</span>
          <span v-if="uid == this.taskInfo.owner_id && taskInfo.status === 4">已过期</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Cell,
  CellGroup,
  Tag,
  Collapse,
  CollapseItem,
  Image as VanImage,
  Button as VanButton,
  Toast,
  CountDown,
  Step,
  Steps
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'TaskDetails',
  inject: ['reload'],
  data() {
    return {
      uid: localStorage.getItem('ID'),
      releaseUser: {},
      receiveUser: {},
      taskInfo: {},
      process: {},
      activeName: [],
      active: null
    }
  },
  computed: {
    //计算任务完成所用的时间
    getTimeRecord() {
      if (this.process.releaser_confirm_at && this.process.createAt) {
        const finished_at = this.process.releaser_confirm_at
        const begin_at = this.process.createAt
        const record = new Date(finished_at) - new Date(begin_at)
        //计算出相差天数
        let days = Math.floor(record / (24 * 3600 * 1000))
        //计算出小时数
        const leave1 = record % (24 * 3600 * 1000)
        const hours = Math.floor(leave1 / (3600 * 1000))
        //计算天数后剩余的毫秒数
        const leave2 = leave1 % (3600 * 1000)
        //计算相差分钟数
        const minutes = Math.floor(leave2 / (60 * 1000))
        return '任务共花了：' + days + '天' + hours + '小时' + minutes + '分'
      } else {
        return null
      }
    }
  },
  components: {
    NavBar,
    Icon,
    Cell,
    CellGroup,
    Tag,
    Collapse,
    CollapseItem,
    VanButton,
    VanImage,
    CountDown,
    Step,
    Steps
  },
  methods: {
    //处理时间
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      let T_pos = utc_datetime.indexOf('T')
      let Z_pos = utc_datetime.indexOf('.')
      let year_month_day = utc_datetime.substr(0, T_pos)
      let hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1)
      let new_datetime = year_month_day + ' ' + hour_minute_second // 2017-03-31 08:02:06
      return new_datetime
    },
    //获取任务详情
    getTaskDetails() {
      userRequest
        .get('/task/getTaskDetails', {
          params: { tid: this.$route.params.tid }
        })
        .then(res => {
          this.taskInfo = res.data
          //非发布用户，则获取发布用户的信息
          if (localStorage.getItem('ID') != this.taskInfo.owner_id) {
            this.getReleaseUser(this.taskInfo.owner_id)
          } else {
            //发布用户，如果是接取，完成，超时状态，则获取接取用户的信息
            if (
              this.taskInfo.status === 2 ||
              this.taskInfo.status === 3 ||
              this.taskInfo.status === 5
            ) {
              this.getReceiveUser(this.taskInfo.tid)
              this.getTaskProcess(this.taskInfo.tid)
            }
          }
          // //改变任务进度显示
          // if (this.taskInfo.status === 1) {
          //   this.active = 0
          // } else if (this.taskInfo.status === 2) {
          //   this.active = 1
          // } else if (this.taskInfo.status === 3) {
          //   this.active = 2
          // }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取任务文件
    getFiles() {
      if (localStorage.getItem('ID') === this.taskInfo.owner_id) {
        this.activeName.push('1')
      } else {
        Toast({
          type: 'fail',
          message: '接取任务后才能查看'
        })
      }
    },
    //获取发布用户信息
    getReleaseUser(uid) {
      userRequest
        .get('/user/getUserByUid', {
          params: { uid: uid }
        })
        .then(res => {
          this.releaseUser = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取接取用户信息
    getReceiveUser(tid) {
      userRequest
        .get('/user/getReceiver', {
          params: { tid: tid }
        })
        .then(res => {
          console.log(res.data)
          this.receiveUser = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取任务进程信息
    getTaskProcess(tid) {
      userRequest
        .get('/task/getReceiveTaskProcess', {
          params: { tid: tid }
        })
        .then(res => {
          if (res.data) {
            this.process = res.data
            //更新步骤条
            if (this.process.releaser_confirm === 1) {
              this.active = 5
            } else if (this.process.receiver_confirm === 1) {
              this.active = 4
            } else if (this.process.arrived === 1) {
              this.active = 3
            } else if (this.process.is_sending === 1) {
              this.active = 2
            } else if (this.process.bought === 1) {
              this.active = 1
            } else if (this.process.printed === 1) {
              this.active = 1
            } else if (this.process.obtain_delivery === 1) {
              this.active = 1
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //改变进程
    changeProcess(procedure) {
      const changes = {
        status: procedure,
        process_id: this.process.id
      }
      userRequest
        .post('/task/changeProcess', changes)
        .then(res => {
          if (res.data.message === 'UPDATE_SUCCESS' && res.data.statusCode === 200) {
            //更新成功
            Toast({
              type: 'success',
              message: '您已确认接收，任务结束',
              onClose: () => {
                this.reload()
              }
            })
          } else {
            Toast({
              type: 'fail',
              message: '确认失败',
              onClose: () => {
                this.reload()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //用户接取任务
    receiveTask() {
      const request = {
        tid: this.taskInfo.tid,
        owner_id: this.taskInfo.owner_id,
        receiver_id: parseInt(this.uid)
      }
      userRequest
        .post('/task/receiveTask', request)
        .then(res => {
          if (res.data.statusCode === 200 && res.data.message === 'RECEIVE_SUCCESS') {
            //接取成功
            Toast({
              type: 'success',
              message: '接取任务成功',
              onClose: () => {
                this.$router.push('/task/receiveTask/' + this.taskInfo.tid)
              }
            })
          } else {
            //接取失败
            Toast({
              type: 'fail',
              message: '接取任务失败'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getTaskDetails()
  }
}
</script>

<style>
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.taskdetails {
  height: 100%;
  padding: 12vw 0 15vw 0;
}
.scroll {
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
}
.task_step {
  width: 100%;
  margin-top: 2vw;
}
.task_bar {
  height: 15vw;
  background-color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.show_time {
  margin-left: 2vw;
  flex: 1;
}
.time_record {
  flex: 1;
  text-align: center;
  font-size: 4vw;
}
.time_title {
  display: inline-block;
  margin: 0 0.5vw;
  color: #ffd300;
  font-size: 4vw;
}
.file_list {
  width: 100%;
  font-size: 4vw;
}
.file_list li {
  padding: 2vw;
  border-bottom: solid 0.1vw;
}
.file_list li :nth-child(2) {
  float: right;
}
.colons {
  display: inline-block;
  margin: 0 0.5vw;
  color: #ffd300;
  font-size: 4vw;
}
.blocks {
  display: inline-block;
  width: 9vw;
  color: #fff;
  font-size: 6vw;
  text-align: center;
  border-radius: 0.5vw;
  background-color: #ffd300;
}
.show_button {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vw;
  font-size: 4vw;
  color: #fff;
  background-color: #ffd300;
}
</style>