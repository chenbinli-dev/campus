<template>
  <div id="usertask" class="usertask">
    <tabs
      v-model="active"
      type="line"
      animated
      line-width="12vw"
      color="#ffd300"
      title-active-color="#ffd300"
      class="tabs"
      @click="onClick"
    >
      <tab name="0" title="发布的任务" class="tab">
        <!--下拉菜单-->
        <dropdown-menu active-color="#ffd300">
          <dropdown-item v-model="type" :options="types" @change="changeType" get-container="#app" />
          <dropdown-item
            v-model="status"
            :options="status_options"
            @change="changeStatus"
            get-container="#app"
          />
        </dropdown-menu>
        <!--显示列表-->
        <list
          v-model="ReleaseTaskListLoading"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished="ReleaseTaskListFinished"
          finished-text="没有更多了"
          offset="400"
          class="releaseTaskList"
          @load="getTaskList"
        >
          <div
            v-for="(item,index) in TaskList"
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
                <count-down
                  :time="new Date(item.expiration_time) - new Date()"
                  v-if="item.status !== 3"
                >
                  <template #default="timeData">
                    <span class="block">{{ timeData.days }}</span>
                    <span class="colon">天</span>
                    <span class="block">{{ timeData.hours }}</span>
                    <span class="colon">小时</span>
                    <span class="block">{{ timeData.minutes }}</span>
                    <span class="colon">分</span>
                  </template>
                </count-down>
                <div class="tips" v-else>任务已完成，快去评价吧>>></div>
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
      <tab name="1" title="接取的任务">
        <!--下拉菜单-->
        <dropdown-menu active-color="#ffd300">
          <dropdown-item v-model="type" :options="types" @change="changeType" get-container="#app" />
          <dropdown-item
            v-model="status"
            :options="receive_status_options"
            @change="changeStatus"
            get-container="#app"
          />
        </dropdown-menu>
        <!--列表-->
        <list
          v-model="ReceiveTaskListLoading"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished="ReceiveTaskListFinished"
          finished-text="没有更多了"
          @load="getTaskList"
        >
          <div
            v-for="(item,index) in TaskList"
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
                <count-down
                  :time="new Date(item.expiration_time) - new Date()"
                  v-if="item.status !== 3"
                >
                  <template #default="timeData">
                    <span class="block">{{ timeData.days }}</span>
                    <span class="colon">天</span>
                    <span class="block">{{ timeData.hours }}</span>
                    <span class="colon">小时</span>
                    <span class="block">{{ timeData.minutes }}</span>
                    <span class="colon">分</span>
                  </template>
                </count-down>

                <div class="tips" v-else>任务完成，很棒哦</div>
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
import { Tab, Tabs, DropdownMenu, DropdownItem, List, Tag, CountDown, Toast } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'UserTask',
  data() {
    return {
      active: '0',
      type: 0,
      status: 0,
      types: [
        { text: '代取快递', value: 0 },
        { text: '代打印', value: 1 },
        { text: '代购物', value: 2 },
        { text: '其他代跑', value: 3 }
      ],
      status_options: [
        { text: '闲置', value: 0 },
        { text: '进行中', value: 1 },
        { text: '已完成', value: 2 },
        { text: '过期', value: 3 },
        { text: '超时', value: 4 }
      ],
      receive_status_options: [
        { text: '进行中', value: 0 },
        { text: '已完成', value: 1 },
        { text: '超时', value: 2 }
      ],
      TaskList: [],
      ReleaseTaskListLoading: false,
      ReleaseTaskListFinished: false,
      ReceiveTaskListLoading: false,
      ReceiveTaskListFinished: false,
      error: false
    }
  },
  components: {
    Tabbar,
    Tab,
    Tabs,
    DropdownMenu,
    DropdownItem,
    List,
    Tag,
    CountDown
  },
  methods: {
    //选项卡点击
    onClick(name) {
      if (name === '0') {
        this.type = 0
        this.status = 0
        this.getTaskList()
      } else if (name === '1') {
        this.type = 0
        this.status = 0
        this.getTaskList()
      }
    },
    //获取任务列表,active代表发布或者接取，type为任务类型，status为任务状态
    getTaskList() {
      this.TaskList = []
      userRequest
        .get('/task/getUserTaskList', {
          params: {
            list_type: this.active,
            type: this.type,
            status: this.status,
            uid: localStorage.getItem('ID')
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length === 0) {
            //没有对应的任务
            Toast({
              type: 'fail',
              message: '没有对应的任务',
              duration: 500,
              onClose: () => {
                if (this.active === '0') {
                  this.ReleaseTaskListLoading = false
                  this.ReleaseTaskListFinished = true
                } else {
                  this.ReceiveTaskListLoading = false
                  this.ReceiveTaskListFinished = true
                }
              }
            })
          } else {
            if (this.active === '0') {
              res.data.forEach(item => {
                this.TaskList.push(item)
                this.ReleaseTaskListLoading = true
              })

              if (this.TaskList.length === res.data.length) {
                this.ReleaseTaskListFinished = true
              }
            } else {
              res.data.forEach(item => {
                this.TaskList.push(item)
                this.ReceiveTaskListLoading = true
              })

              if (this.TaskList.length === res.data.length) {
                this.ReceiveTaskListFinished = true
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //监听用户点击下拉菜单
    changeType(value) {
      this.type = value
      this.getTaskList()
    },
    changeStatus(value) {
      this.status = value
      this.getTaskList()
    }
  },
  mounted() {
    if (sessionStorage.getItem('CACHE')) {
      this.getTaskList()
    }
  }
}
</script >

<style>
.usertask {
  height: 100%;
  padding-bottom: 12vw;
}
.tab {
  height: 100%;
}
.dropdown {
  width: 100%;
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
.tips {
  font-size: 4vw;
  color: #ffd300;
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