<template>
  <div id="complaint">
    <nav-bar title="投诉" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <!--代跑信息-->
    <cell-group>
      <cell title="任务编号" :value="taskInfo.task_number" size="large" />
      <cell title="任务类型" size="large">
        <template #right-icon>
          <tag color="#ffd300">{{taskInfo.type}}</tag>
        </template>
      </cell>
      <collapse v-model="activeNames">
        <collapse-item name="1" size="large">
          <template #title>
            <div>代跑用户</div>
          </template>
          <template #value>
            <van-image
              width="8vw"
              height="8vw"
              radius="50%"
              lazy-load:true
              show-loading
              :src="receiveUser.avatar_url"
            />
          </template>
          <cell title="用户名">{{receiveUser.username}}</cell>
          <cell title="信誉分">{{receiveUser.credit_points}}</cell>
        </collapse-item>
      </collapse>
      <cell title="投诉" size="large" icon="warning-o" @click="show = true" is-link>{{content}}</cell>
      <action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="selectType"
      />
      <cell>
        <van-button color="#ffd300" size="large" @click="onSubmit">提交</van-button>
      </cell>
    </cell-group>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  ActionSheet,
  Tag,
  Button as VanButton,
  Image as VanImage,
  Toast
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Complaint',
  data() {
    return {
      taskInfo: {},
      receiveUser: {},
      activeNames: ['1'],
      show: false,
      actions: [{ name: '任务超时' }, { name: '代跑物品丢失' }, { name: '额外索取费用' }],
      content: ''
    }
  },
  components: {
    NavBar,
    Icon,
    Cell,
    CellGroup,
    Collapse,
    CollapseItem,
    ActionSheet,
    Tag,
    VanButton,
    VanImage
  },
  methods: {
    //获取任务信息
    getTaskInfo() {
      userRequest
        .get('/task/getTaskDetails', {
          params: { tid: this.$route.params.tid }
        })
        .then(res => {
          if (res.data) {
            this.taskInfo = res.data
          }
          this.getReceiveUser(this.taskInfo.tid)
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
    selectType(action) {
      this.content = action.name
    },
    //提交投诉
    onSubmit() {
      if (!this.content) {
        Toast({
          type: 'fail',
          message: '请选择'
        })
        return
      }
      const compalint = {
        task_number: this.taskInfo.task_number,
        receiver_id: this.receiveUser.uid,
        content: this.content,
        user_id: parseInt(localStorage.getItem('ID'))
      }
      userRequest
        .post('/task/submitComplaint', compalint, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.message === 'SUBMIT_SUCCESS') {
            Toast({
              type: 'success',
              message: '投诉已提交',
              onClose: () => {
                this.$router.back()
              }
            })
          } else {
            Toast({
              type: 'success',
              message: '提交失败',
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
    this.getTaskInfo()
  }
}
</script>

<style>
</style>