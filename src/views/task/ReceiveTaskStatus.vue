<template>
  <!--任务代跑状态页面-->
  <div id="receive_status" class="receive_status">
    <nav-bar title="任务代跑进程" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <div class="task_number">代跑编号：{{process.id}}</div>
    <div class="taskFile">
      <div class="FileBox_title" v-if="taskInfo.type === '代取快递'">取件码</div>
      <ul class="file_list">
        <li v-for="item in taskInfo.upload_file_url" :key="item.tid">
          <van-image width="50%" height="50%" lazy-load:true show-loading :src="item" />
        </li>
      </ul>
    </div>
    <div class="process">
      <div class="process_title">任务进度</div>
      <steps
        :active="active"
        direction="vertical"
        active-color="#ffd300"
        class="steps"
        v-if="taskInfo.type === '代取快递'"
      >
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
          <p>等待发布用户确认完成</p>
          <p v-if="process.releaser_confirm_at">{{process.releaser_confirm_at}}</p>
        </step>
      </steps>
    </div>
    <cell title="发布用户" size="large" class="releaser">
      <van-image
        width="8vw"
        height="8vw"
        radius="50%"
        lazy-load:true
        show-loading
        :src="releaseUser.avatar_url"
      />
    </cell>
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
          if (res.data.receiver_confirm === 1) {
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
.task_number {
  width: 100%;
  text-align: center;
  font-size: 4vw;
  margin-top: 12vw;
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
.file_list li img {
  border-radius: 1vw;
}
.process_title {
  padding-left: 4vw;
  font-size: 4vw;
  background-color: #fff;
  color: black;
}
</style>