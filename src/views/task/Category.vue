<template>
  <div id="category" class="category">
    <nav-bar title="任务大厅" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back(-1)" />
      </template>
    </nav-bar>
    <!--下拉菜单-->
    <div class="dropdown" :overlay="false">
      <dropdown-menu active-color="#ffd300">
        <dropdown-item v-model="type" :options="types" @change="changeType" />
        <dropdown-item v-model="sortord" :options="sortords" @change="changeSortord" />
      </dropdown-menu>
    </div>
    <!--显示列表-->
    <list
      v-model="taskListLoading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="taskListFinished"
      finished-text="没有更多了"
      offset="300"
      class="taskList"
      @load="getTaskList"
    >
      <!--代取快递列表-->
      <swipe-cell v-for="(item,index) in task" :key="index">
        <div class="taskItem" @click="$router.push({path:'/task/'+item.tid})">
          <div class="itemHeader">
            <span>{{index+1}}</span>
            <span>{{item.title}}</span>
            <tag v-if="item.type === '代取快递'" color="#7232dd" plain>代取快递</tag>
            <tag v-else-if="item.type === '代打印'" color="#7232dd" plain>代打印</tag>
            <tag v-else-if="item.type === '代购物'" color="#7232dd" plain>代购物</tag>
            <tag v-else color="#7232dd" plain>其他</tag>
          </div>
          <div class="itemBody">
            <count-down
              class="countDown"
              :time="new Date(item.expiration_time) - new Date()"
              format="距过期：DD 天 HH 时 mm 分"
            />
            <span class="money">
              <div v-if="type === 1 || type === 2" class="estimated_amount">
                <icon color="#ffd300" size="5.5vw" name="gold-coin-o" />
                {{item.estimated_amount}}
              </div>
              <div class="commission">
                <icon color="#ffd300" size="5.5vw" name="balance-o" />
                {{item.commission}}
              </div>
            </span>
          </div>
        </div>
        <template #right>
          <van-button style="height:30vw" square color="#ffd300" text="收藏" />
        </template>
      </swipe-cell>
    </list>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  DropdownMenu,
  DropdownItem,
  Toast,
  List,
  SwipeCell,
  Button as VanButton,
  Tag,
  CountDown
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Category',
  data() {
    return {
      type: 0,
      sortord: 0,
      types: [
        { text: '代取快递', value: 0 },
        { text: '代打印', value: 1 },
        { text: '代购物', value: 2 },
        { text: '其他代跑', value: 3 }
      ],
      sortords: [
        { text: '默认排序-最新', value: 0 },
        { text: '任务金排序-从高到低', value: 1 },
        { text: '有效时间排序-从长到短', value: 2 }
      ],
      task: [],
      taskListLoading: false,
      taskListFinished: false,
      error: false
    }
  },
  components: {
    NavBar,
    Icon,
    DropdownMenu,
    DropdownItem,
    List,
    SwipeCell,
    VanButton,
    Tag,
    CountDown
  },
  methods: {
    //获取最新的任务(不包括用户自己发布的任务)
    getTaskList() {
      userRequest
        .get('/task/getTaskList', {
          params: { type: this.type, sortord: this.sortord, uid: localStorage.getItem('ID') }
        })
        .then(res => {
          console.log(res.data[1])
          if (res.data[0].length === 0) {
            //没有对应的任务
            Toast({
              type: 'fail',
              message: '没有对应的任务',
              duration: 500,
              onClose: () => {
                this.taskListFinished = true
              }
            })
          } else {
            this.task = this.task.concat(res.data[0].reverse())
            this.taskListLoading = false
            if (this.task.length === res.data[1][0].num) {
              this.taskListFinished = true
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.error = true
        })
    },
    changeType(value) {
      this.task = []
      this.type = value
      this.getTaskList()
    },
    changeSortord(value) {
      this.task = []
      this.sortord = value
      this.getTaskList()
    }
  }
}
</script>

<style scoped>
.category {
  height: 100%;
  padding-top: 12vw;
}
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
}
.dropdown {
  width: 100%;
}
.taskList {
  padding-top: 2vw;
  height: 100%;
}
.taskItem {
  height: 30vw;
  padding: 2vw;
  margin: 0 2vw 2vw 2vw;
  border-radius: 3vw;
  background-color: #fff;
}
.itemHeader {
  margin-bottom: 2vw;
}
.itemHeader :nth-child(1) {
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
.itemHeader :nth-child(2) {
  font-size: 4.5vw;
}
.itemHeader :nth-child(3) {
  float: right;
  font-size: 3.5vw;
}
.itemBody {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.money {
  display: flex;
  align-items: center;
  color: #ffd300;
  font-size: 5vw;
  padding-right: 2vw;
}
.money :nth-child(1) {
  margin-right: 2vw;
}
.estimated_amount,
.commission {
  display: flex;
  align-items: center;
}
</style>