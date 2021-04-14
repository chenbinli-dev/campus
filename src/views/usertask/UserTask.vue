<template>
  <div id="usertask">
    <nav-bar title="任务信息" />
    <tabs
      type="line"
      sticky
      animated
      line-width="10vw"
      color="#ffd300"
      title-active-color="#ffd300"
    >
      <tab title="发布的任务">
        <div class="empty" v-if="MyReleaseTask.length === 0">
          <span>您还未发布任何任务</span>
        </div>
        <list
          v-else
          v-model="releaseTaskLoading"
          :finished="releaseTaskFinished"
          finished-text="没有更多了"
          @load="getMyReleaseTask"
        >
          <div v-for="(item,index) in MyReleaseTask" :key="item.tid" class="taskItem">
            <div class="itemHeader">
              <span class="serial_number">{{index+1}}</span>
              <span class="task_title">{{item.title}}</span>
              <tag v-if="item.status === 1" color="#7232dd">闲置</tag>
              <tag v-else-if="item.status === 2" type="primary">被接取</tag>
              <tag v-else-if="item.status === 3" type="success">已完成</tag>
              <tag v-else type="danger">已过期</tag>
            </div>
            <div class="itemBody">
              <span class="countDown">
                <count-down :time="new Date(item.expiration_time) - new Date()">
                  <template #default="timeData">
                    <span class="block">{{ timeData.days }}</span>
                    <span class="colon">天</span>
                    <span class="block">{{ timeData.hours }}</span>
                    <span class="colon">小时</span>
                    <span class="block">{{ timeData.minutes }}</span>
                    <span class="colon">分</span>
                  </template>
                </count-down>
              </span>
            </div>
          </div>
        </list>
      </tab>

      <tab title="接取的任务">
        <div class="empty" v-if="MyReceiveTask.length === 0">
          <span>您还未接取任何任务</span>
        </div>
        <list
          v-else
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getMyReceiveTask"
        >
          <div v-for="(item) in MyReceiveTask" :key="item"></div>
        </list>
      </tab>
    </tabs>
    <tabbar></tabbar>
  </div>
</template>

<script>
const Tabbar = () => import('components/common/tabbar/Tabbar')
import { NavBar, Tab, Tabs, List, Tag, CountDown } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'UserTask',
  data() {
    return {
      MyReleaseTask: [],
      MyReceiveTask: [],
      releaseTaskLoading: false,
      releaseTaskFinished: false,
      receiveTaskLoading: false,
      receiveTaskFinished: false
    }
  },
  components: {
    Tabbar,
    NavBar,
    Tab,
    Tabs,
    List,
    Tag,
    CountDown
  },
  methods: {
    //获取用户发布的任务
    getMyReleaseTask() {
      userRequest
        .get('/task/getUserReleaseTask', {
          params: { uid: localStorage.getItem('ID') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data) {
            this.MyReleaseTask = res.data
            this.releaseTaskLoading = false
            this.releaseTaskFinished = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取用户接取的任务
    getMyReceiveTask() {}
  },
  created() {
    this.getMyReleaseTask()
  }
}
</script >

<style>
.taskItem {
  padding: 2vw;
  margin: 2vw;
  background-color: #fff;
  border-radius: 3vw;
}
.itemHeader {
  margin-bottom: 5vw;
}
.serial_number {
  display: inline-block;
  width: 8vw;
  height: 8vw;
  text-align: center;
  border-radius: 50%;
  border: solid 0.1vw #ffd300;
  color: #ffd300;
  font-size: 5vw;
  margin-right: 5vw;
}
.task_title {
  font-size: 4.5vw;
  overflow: hidden;
}
.itemHeader :nth-child(3) {
  float: right;
  font-size: 4vw;
}
.itemBody {
  margin-left: 13vw;
}
.countDown {
  vertical-align: middle;
}
.colon {
  display: inline-block;
  margin: 0 0.5vw;
  color: #ee0a24;
}
.block {
  display: inline-block;
  width: 6vw;
  color: #fff;
  font-size: 1.6vw;
  text-align: center;
  border-radius: 50%;
  background-color: #ee0a24;
}
</style>