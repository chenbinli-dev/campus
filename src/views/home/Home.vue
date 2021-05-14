<template>
  <div id="home">
    <nav-bar title="主页" />
    <notice-bar text="校园代跑平台现已正式上线" mode="closeable" left-icon="volume-o" />
    <div id="entrance" class="entrance">
      <van-button
        round
        color="linear-gradient(to right, #ffd000, #ffd300)"
        size="large"
        class="button"
        @click="showTypeSelect"
      >发布任务</van-button>

      <van-button
        round
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        size="large"
        class="button"
        @click="toGetTask"
      >接取任务</van-button>
    </div>
    <!--发布任务类型选择-->
    <popup
      v-model="typeSelectShow"
      round
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '50%', padding: '10vw 10vw 0 10vw' }"
    >
      <van-button
        round
        color="#ffd000"
        size="large"
        class="typeButton"
        plain
        text="代取快递"
        @click="
          $router.push({
            path: '/user/releaseTask',
            query: { type: '代取快递' },
          })"
      />
      <van-button
        round
        color="#ffd000"
        size="large"
        class="typeButton"
        plain
        text="代打印"
        @click="$router.push({ path: '/user/releaseTask', query: { type: '代打印' } })"
      />
      <van-button
        round
        color="#ffd000"
        size="large"
        class="typeButton"
        plain
        text="代购物"
        @click="$router.push({ path: '/user/releaseTask', query: { type: '代购物' } })"
      />
      <van-button
        round
        color="#ffd000"
        size="large"
        class="typeButton"
        plain
        text="其他代跑"
        @click="
          $router.push({
            path: '/user/releaseTask',
            query: { type: '其他代跑' },
          })"
      />
    </popup>

    <tabbar />
  </div>
</template>

<script>
const Tabbar = () => import('components/common/tabbar/Tabbar')
import { NavBar, Button as VanButton, NoticeBar, Popup, Toast, Dialog } from 'vant'
export default {
  name: 'Home',
  data() {
    return {
      typeSelectShow: false
    }
  },
  components: {
    Tabbar,
    NavBar,
    VanButton,
    NoticeBar,
    Popup,
    [Dialog.Component.name]: Dialog.Component
  },
  methods: {
    //判断用户身份、是否有支付密码、是否余额为0
    showTypeSelect() {
      if (this.$store.state.user_right === 1) {
        Toast({
          type: 'fail',
          message: '您还未进行身份验证'
        })
        return
      } else if (this.$store.state.have_pay_password === false) {
        Toast({
          type: 'fail',
          message: '请先设置支付密码'
        })
        return
      } else if (this.$store.state.have_balance === false) {
        Toast({
          type: 'fail',
          message: '余额不足'
        })
        return
      } else if (this.$store.state.is_forbidden === 1) {
        Toast({
          type: 'fail',
          message: '该账号已禁用'
        })
        return
      } else {
        this.typeSelectShow = true
      }
    },
    //接取任务
    toGetTask() {
      if (this.$store.state.user_right === 1) {
        Toast({
          type: 'fail',
          message: '您还未进行身份验证'
        })
        return
      } else if (this.$store.state.is_forbidden === 1) {
        Toast({
          type: 'fail',
          message: '该账号已禁用'
        })
        return
      }
      Dialog.alert({
        title: '注意',
        message: '接取的任务无法取消，不能按时完成任务将影响到您的信誉评分'
      }).then(() => {
        // on close
        this.$router.push('/category')
      })
    }
  }
}
</script>

<style scoped>
.entrance {
  padding: 10vw;
}
.button {
  margin-bottom: 5vw;
}
.typeButton {
  margin: 2vw 0;
}
</style>
