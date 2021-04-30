<template>
  <div id="comment">
    <nav-bar title="任务评价" class="navbar">
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
      <cell title="任务用时" size="large">{{getTimeRecord}}</cell>
      <cell title="评分" size="large" allow-half>
        <rate v-model="comment.rate" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
      </cell>
      <field
        v-model="comment.content"
        rows="5"
        autosize
        size="large"
        label="内容"
        type="textarea"
        maxlength="150"
        placeholder="请输入评价内容"
        clearable
        show-word-limit
      />
      <cell>
        <van-button color="#ffd300" size="large" @click="onSubmit">提交</van-button>
      </cell>
    </cell-group>
  </div>
</template>

<script>
import { NavBar, Icon, Cell, CellGroup, Tag, Rate, Field, Button as VanButton, Toast } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Comment',
  inject: ['reload'],
  data() {
    return {
      taskInfo: {},
      process: {},
      comment: {
        rate: 0,
        content: ''
      }
    }
  },
  components: {
    NavBar,
    Icon,
    Cell,
    CellGroup,
    Tag,
    Rate,
    Field,
    VanButton
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
        return days + '天' + hours + '小时' + minutes + '分'
      } else {
        return null
      }
    }
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
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取任务进程信息
    getTaskProcess() {
      userRequest
        .get('/task/getReceiveTaskProcess', {
          params: { tid: this.$route.params.tid }
        })
        .then(res => {
          if (res.data) {
            this.process = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //提交评价
    onSubmit() {
      this.comment.task_number = this.taskInfo.task_number
      this.comment.receiver_id = this.process.receiver_id
      this.comment.releaser_id = this.process.releaser_id
      userRequest
        .post('/task/submitComment', this.comment, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.message === 'COMMENT_SUCCESS') {
            Toast({
              type: 'success',
              message: '评价成功',
              onClose: () => {
                this.$router.push('/usertask')
              }
            })
          } else {
            Toast({
              type: 'success',
              message: '评价失败',
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
    this.getTaskProcess()
  }
}
</script>

<style>
</style>