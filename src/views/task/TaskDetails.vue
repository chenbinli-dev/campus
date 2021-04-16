<template>
  <div id="taskdetails" class="taskdetails">
    <nav-bar title="任务详情" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <!--任务详情头-->
    <cell-group style="margin-top:14vw">
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
    </cell-group>

    <!--任务详情主体-->
    <cell-group style="margin-top:2vw">
      <cell title="任务标题" :value="taskInfo.title" size="large" />
      <cell title="任务描述" :value="taskInfo.description" size="large" />
      <!--取件码-->
      <collapse v-if="taskInfo.type === '代取快递'" v-model="activeName">
        <collapse-item title="取件码" name="1" size="large" @click="judgeUser">
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
        <collapse-item title="待打印文件" name="1" size="large" @click="judgeUser">
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

    <!--任务进度条-->
    <div class="task_step">
      <steps :active="active" direction="vertical" active-color="#38f" class="steps">
        <step>
          <p>任务发布</p>
          <p>{{taskInfo.createAt}}</p>
        </step>
        <step>任务被接取</step>
        <step>任务完成</step>
        <step>待确认</step>
      </steps>
    </div>
    <!--任务详情脚-->
    <cell-group style="margin-top:2vw;margin-bottom:15vw">
      <cell title="收件人" :value="taskInfo.addressee" size="large" />
      <cell title="联系电话" :value="taskInfo.telephone" size="large" />
      <cell title="收件地址" :value="taskInfo.address" size="large" />
    </cell-group>

    <!--任务栏-->
    <div class="task_bar">
      <div class="show_time">
        <count-down :time="new Date(taskInfo.expiration_time) - new Date()">
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
      </div>
      <div class="show_button">
        <span v-if="taskInfo.status === 1">闲置中</span>
        <span v-if="taskInfo.status === 2">
          <icon name="chat-o" size="8vw" />
        </span>
        <span v-if="taskInfo.status === 3">已完成</span>
        <span v-if="taskInfo.status === 4">已过期</span>
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
  Toast,
  CountDown,
  Step,
  Steps
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'TaskDetails',
  data() {
    return {
      taskInfo: {},
      activeName: [],
      active: null
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
          res.data.createAt = this.utc2beijing(res.data.createAt)
          this.taskInfo = res.data
          //改变任务进度显示
          if (this.taskInfo.status === 1) {
            this.active = 0
          } else if (this.taskInfo.status === 2) {
            this.active = 1
          } else if (this.taskInfo.status === 3) {
            this.active = 2
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //判断用户身份是否是任务的发布者
    judgeUser() {
      if (localStorage.getItem('ID') === this.taskInfo.owner_id) {
        this.activeName.push('1')
      } else {
        Toast({
          type: 'fail',
          message: '只有接取后才能查看'
        })
      }
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
  overflow: scroll;
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