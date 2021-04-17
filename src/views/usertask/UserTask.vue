<template>
  <div id="usertask" class="usertask">
    <nav-bar title="任务信息" class="navbar" />
    <tabs
      v-model="active"
      type="line"
      sticky
      animated
      line-width="10vw"
      color="#ffd300"
      title-active-color="#ffd300"
      class="tabs"
      @click="onClick"
    >
      <tab name="release" title="发布的任务" class="releaseTask">
        <div class="empty" v-if="MyReleaseTask.length === 0">
          <span>您还未发布任何任务</span>
        </div>
        <list
          v-else
          v-model="releaseTaskLoading"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished="releaseTaskFinished"
          finished-text="没有更多了"
          offset="400"
          @load="getMyReleaseTask"
        >
          <div
            v-for="(item,index) in MyReleaseTask"
            :key="item.tid"
            class="taskItem"
            @click="$router.push({path:'/task/'+item.tid})"
          >
            <div class="itemHeader">
              <span class="serial_number">{{index+1}}</span>
              <span class="task_title">{{item.title}}</span>
              <tag v-if="item.status === 1" color="#7232dd">闲置</tag>
              <tag v-else-if="item.status === 2" type="primary">接取</tag>
              <tag v-else-if="item.status === 3" type="success">完成</tag>
              <tag v-else type="danger">过期</tag>
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

              <div class="task_type_label">
                <tag v-if="item.type === '代取快递'" color="#7232dd" plain>代取快递</tag>
                <tag v-else-if="item.type === '代打印'" color="#7232dd" plain>代打印</tag>
                <tag v-else-if="item.type === '代购物'" color="#7232dd" plain>代购物</tag>
                <tag v-else color="#7232dd" plain>其他</tag>
              </div>
            </div>
          </div>
        </list>
      </tab>
      <!--接取任务列表-->
      <tab name="receive" title="接取的任务">
        <div class="empty" v-if="MyReceiveTask.length === 0">
          <span>您还未接取任何任务</span>
        </div>
        <list
          v-else
          v-model="receiveTaskLoading"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished="receiveTaskFinished"
          finished-text="没有更多了"
          @load="getMyReceiveTask"
        >
          <div
            v-for="(item,index) in MyReceiveTask"
            :key="item.tid"
            class="taskItem"
            @click="$router.push({path:'/task/receiveTask/'+item.tid})"
          >
            <div class="itemHeader">
              <span class="serial_number">{{index+1}}</span>
              <span class="task_title">{{item.title}}</span>
              <tag v-if="item.status === 2" type="primary">进行中</tag>
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

              <div class="task_type_label">
                <tag v-if="item.type === '代取快递'" color="#7232dd" plain>代取快递</tag>
                <tag v-else-if="item.type === '代打印'" color="#7232dd" plain>代打印</tag>
                <tag v-else-if="item.type === '代购物'" color="#7232dd" plain>代购物</tag>
                <tag v-else color="#7232dd" plain>其他</tag>
              </div>
            </div>
          </div>
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
      active: 0,
      MyReleaseTask: [],
      MyReceiveTask: [],
      releaseTaskLoading: false,
      releaseTaskFinished: false,
      receiveTaskLoading: false,
      receiveTaskFinished: false,
      error: false
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
    //选项卡点击
    onClick(name) {
      if (name === 'release') {
        this.MyReleaseTask = []
        this.getMyReleaseTask()
      } else if (name === 'receive') {
        this.MyReceiveTask = []
        this.getMyReceiveTask()
      }
    },
    //获取用户发布的任务
    getMyReleaseTask() {
      userRequest
        .get('/task/getUserReleaseTask', {
          params: { uid: localStorage.getItem('ID') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data) {
            res.data.forEach(item => {
              this.MyReleaseTask.push(item)
              this.releaseTaskLoading = true
            })
            //检查是否加载完毕
            this.releaseTaskFinished = true
          }
        })
        .catch(err => {
          console.log(err)
          this.error = true
        })
    },
    //获取用户接取的任务
    getMyReceiveTask() {
      userRequest
        .get('/task/getUserReceiveTask', {
          params: { uid: localStorage.getItem('ID') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data) {
            res.data.forEach(item => {
              this.MyReceiveTask.push(item)
              this.receiveTaskLoading = true
            })
            //检查是否加载完毕
            this.receiveTaskFinished = true
          }
        })
        .catch(err => {
          console.log(err)
          this.error = true
        })
    },
    //更新任务状态为过期
    updateTaskStatus(tid, status) {
      const requestBody = {
        tid: tid,
        status: status
      }
      userRequest
        .post('/task/updateTaskStatus', requestBody)
        .then(res => {
          if (res.data.message === 'UPDATE_SUCCESS' && res.data.statusCode === 200) {
            return res.data.statusCode
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getMyReleaseTask()
  }
}
</script >

<style>
.usertask {
  height: 100%;
  overflow: scroll;
}
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.tabs {
  margin-top: 12vw;
}

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
  height: 100%;
  text-align: center;
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
.task_type_label {
  margin-top: 2vw;
  font-size: 4vw;
}
</style>