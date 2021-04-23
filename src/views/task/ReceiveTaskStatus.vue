<template>
  <!--任务代跑状态页面-->
  <div id="receive_status" class="receive_status">
    <nav-bar title="任务代跑进程" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.push('/usertask')" />
      </template>
    </nav-bar>
    <div class="task_number">代跑编号：{{process.id}}</div>
    <!--任务完成或超时通知-->
    <div class="task_message" v-if="process.releaser_confirm === 1">
      <div class="task_message_title">
        <img src="~assets/img/finished.svg" width="30vw" height="30vw" />任务已经完成
      </div>
      <div class="message_body" v-if="taskInfo.type === '代取快递'">任务金￥{{taskInfo.commission}}已发放至您的账户</div>
      <div
        class="message_body"
        v-else
      >预估金￥{{taskInfo.estimated_amount}}，任务金￥{{taskInfo.commission}}已发放至您的账户</div>
    </div>
    <!--发布用户信息和聊天按钮-->
    <div class="releaser">
      <div class="releaser_avatar">
        <van-image
          width="15vw"
          height="15vw"
          radius="50%"
          lazy-load:true
          show-loading
          :src="releaseUser.avatar_url"
        />
      </div>
      <div class="releaser_chat" @click="$router.push({path:'/chat/' + releaseUser.uid})">
        <icon name="chat-o" size="10vw" color="#ffd300" />发起聊天
      </div>
    </div>
    <!--取件码-->
    <div class="taskFile" v-if="taskInfo.type === '代取快递'">
      <div class="FileBox_title">取件码</div>
      <ul class="file_list_image">
        <li v-for="item in taskInfo.upload_file_url" :key="item.tid">
          <van-image width="50%" height="50%" lazy-load:true show-loading :src="item" />
        </li>
      </ul>
    </div>
    <!--代打印文件码-->
    <div class="taskFile" v-if="taskInfo.type === '代打印'">
      <div class="FileBox_title">代打印文件</div>
      <ul class="file_list_download">
        <li v-for="(val,index) in taskInfo.upload_file_url" :key="index">
          <span>{{'文件'}}{{parseInt(index+1)}}</span>
          <a :href="val" download>
            <icon name="down" color="#ffd300" size="5vw" />
          </a>
        </li>
      </ul>
    </div>
    <!--商品图片-->
    <div class="taskFile" v-if="taskInfo.type === '代购物'">
      <div class="FileBox_title">商品图片</div>
      <ul class="file_list_image">
        <li v-for="item in taskInfo.upload_file_url" :key="item.tid">
          <van-image width="50%" height="50%" lazy-load:true show-loading :src="item" />
        </li>
      </ul>
    </div>

    <div class="process">
      <div class="process_title">任务进度</div>
      <steps :active="active" direction="vertical" active-color="#ffd300" class="steps">
        <step>
          <p>接取任务</p>
          <p>{{process.createAt}}</p>
        </step>

        <step v-if="taskInfo.type === '代取快递'">
          <van-button
            v-if="process.obtain_delivery === 0"
            color="#ffd300"
            @click="changeProcess('obtain_delivery')"
          >已取快递</van-button>
          <div v-else>
            <p>已取快递</p>
            <p v-if="process.obtain_delivery_at">{{process.obtain_delivery_at}}</p>
          </div>
        </step>

        <step v-if="taskInfo.type === '代打印'">
          <van-button
            v-if="process.printed === 0"
            color="#ffd300"
            @click="changeProcess('printed')"
          >已打印</van-button>
          <div v-else>
            <p>已打印</p>
            <p v-if="process.printed_at">{{process.printed_at}}</p>
          </div>
        </step>

        <step v-if="taskInfo.type === '代购物'">
          <van-button
            v-if="process.bought === 0"
            color="#ffd300"
            @click="changeProcess('bought')"
          >已打印</van-button>
          <div v-else>
            <p>已购商品</p>
            <p v-if="process.bought_at">{{process.bought_at}}</p>
          </div>
        </step>

        <step>
          <van-button
            v-if="process.is_sending === 0 && (process.obtain_delivery === 1 || process.printed === 1 || process.bought === 1)"
            color="#ffd300"
            @click="changeProcess('is_sending')"
          >正在配送</van-button>
          <div v-else>
            <p>正在配送</p>
            <p v-if="process.is_sending_at">{{process.is_sending_at}}</p>
          </div>
        </step>

        <step>
          <van-button
            v-if="process.arrived === 0 && process.is_sending === 1"
            color="#ffd300"
            @click="changeProcess('arrived')"
          >已经送达</van-button>
          <div v-else>
            <p>已经送达</p>
            <p v-if="process.arrived_at">{{process.arrived_at}}</p>
          </div>
        </step>

        <step>
          <van-button
            v-if="process.receiver_confirm === 0 && process.arrived === 1"
            color="#ffd300"
            @click="changeProcess('receiver_confirm')"
          >确认完成</van-button>
          <div v-else>
            <p>代跑者确认完成</p>
            <p v-if="process.receiver_confirm_at">{{process.receiver_confirm_at}}</p>
          </div>
        </step>

        <step v-if="process.receiver_confirm === 1">
          <p>发布用户确认完成</p>
          <p v-if="process.releaser_confirm_at">{{process.releaser_confirm_at}}</p>
        </step>
      </steps>
    </div>
    <!--发布用户详情-->
    <cell-group style="margin-top:2vw;margin-bottom:15vw">
      <cell title="收件人" :value="taskInfo.addressee" size="large" />
      <cell title="联系电话" :value="taskInfo.telephone" size="large" />
      <cell title="收件地址" :value="taskInfo.address" size="large" />
    </cell-group>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Cell,
  CellGroup,
  Image as VanImage,
  Step,
  Steps,
  Button as VanButton,
  Toast
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'ReceiveTaskStatus',
  data() {
    return {
      taskInfo: {},
      process: {},
      releaseUser: {},
      active: 0
    }
  },
  inject: ['reload'],
  components: {
    NavBar,
    Icon,
    Cell,
    CellGroup,
    VanImage,
    Step,
    Steps,
    VanButton
  },
  methods: {
    //获取任务信息
    getReceiveTaskInfo() {
      userRequest
        .get('/task/getTaskDetails', {
          params: { tid: this.$route.params.tid }
        })
        .then(res => {
          console.log(res.data)
          this.taskInfo = res.data
          this.getReleaseUser(res.data.owner_id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取任务代跑进程
    getReceiveTaskProcess() {
      userRequest
        .get('/task/getReceiveTaskProcess', {
          params: { tid: this.$route.params.tid }
        })
        .then(res => {
          console.log(res.data)
          this.process = res.data
          //更新步骤条
          if (res.data.releaser_confirm === 1) {
            this.active = 5
          } else if (res.data.receiver_confirm === 1) {
            this.active = 4
          } else if (res.data.arrived === 1) {
            this.active = 3
          } else if (res.data.is_sending === 1) {
            this.active = 2
          } else if (res.data.bought === 1) {
            this.active = 1
          } else if (res.data.printed === 1) {
            this.active = 1
          } else if (res.data.obtain_delivery === 1) {
            this.active = 1
          }
        })
        .catch(err => {
          console.log(err)
        })
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
              message: '代跑进度已改变',
              onClose: () => {
                this.reload()
              }
            })
          } else {
            Toast({
              type: 'fail',
              message: '代跑进度改变失败',
              onClose: () => {
                this.reload()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getReceiveTaskInfo()
    this.getReceiveTaskProcess()
  }
}
</script>

<style>
.receive_status {
  height: 100%;
  overflow: scroll;
}
.navbar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.task_message {
  width: 100%;
  height: 20vw;
  padding: 2vw;
  align-items: center;
  margin-bottom: 2vw;
}
.task_message_title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4vw;
  color: #ffd300;
}
.message_body {
  text-align: center;
  font-size: 4vw;
  color: #ffd300;
}
.task_number {
  width: 100%;
  text-align: center;
  font-size: 4vw;
  margin-top: 12vw;
}
.releaser {
  width: 100%;
  height: 20vw;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vw;
}
.releaser_avatar,
.releaser_chat {
  width: 50%;
  height: 100%;
  color: #ffd300;
  font-size: 4vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.releaser_avatar {
  border-right: dashed 0.1vw;
}
.taskFile {
  padding: 2vw;
  margin-bottom: 2vw;
  background-color: #fff;
}
.FileBox_title {
  font-size: 4vw;
  margin-bottom: 2vw;
  color: black;
}
.file_list_image img {
  border-radius: 1vw;
}
.file_list_download {
  width: 100%;
}
.file_list_download li {
  padding: 2vw;
  border-bottom: solid 0.1vw;
}
.file_list_download li span {
  font-size: 4vw;
}
.file_list_download li :nth-child(2) {
  float: right;
}
.process_title {
  padding-left: 4vw;
  font-size: 4vw;
  background-color: #fff;
  color: black;
}
</style>