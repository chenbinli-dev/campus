<template>
  <div id="profile" class="profile">
    <nav-bar title="我">
      <template #right>
        <icon
          class="profile-navbar-right-icon1"
          name="envelop-o"
          size="6vw"
          @click="$router.push('/user/message')"
          :dot="$store.state.showDot"
        />
        <icon
          class="profile-navbar-right-icon2"
          name="setting-o"
          size="6vw"
          @click="$router.push('/user/setting')"
        />
      </template>
    </nav-bar>
    <!--账号禁用提示-->
    <notice-bar
      v-if="this.$store.state.is_forbidden === 1"
      :text="forbidden_text"
      left-icon="warning-o"
    />
    <!--个人主页-->
    <pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      head-height="50"
      @refresh="onRefresh"
      class="refreshBody"
    >
      <profile-header route="/user/editProfile" :user-info="this.userInfo" />

      <div id="profile_list" class="profile_list">
        <cell title="信誉分" :value="userInfo.credit_points" class="cell" />
        <cell title="学生认证" is-link to="/user/verify" class="cell" />
        <cell title="账户余额" is-link to="/user/balance" class="cell" />
        <cell title="收件地址" is-link to="/user/address" class="cell" />
      </div>
    </pull-refresh>
    <tabbar></tabbar>
  </div>
</template>

<script>
const Tabbar = () => import('components/common/tabbar/Tabbar')

const ProfileHeader = () => import('./ProfileHeader')

import { NavBar, NoticeBar, PullRefresh, Icon, Cell, Toast } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Profile',
  inject: ['reload'],
  data() {
    return {
      forbidden_text: '',
      isLoading: false,
      showDot: false,
      userInfo: {}
    }
  },
  components: {
    NavBar,
    NoticeBar,
    Tabbar,
    ProfileHeader,
    Cell,
    PullRefresh,
    Icon
  },
  methods: {
    //下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.reload()
        this.isLoading = false
      }, 1000)
    },
    getUserInfo() {
      userRequest
        .get('/user/getUserByUid/', {
          params: {
            uid: localStorage.getItem('ID')
          }
        })
        .then(res => {
          // console.log(res.data)
          //将用户是否有支付密码的状态存入仓库
          if (res.data.pay_password) {
            this.$store.commit('pay_password_status')
          } else {
            this.$store.commit('pay_password_status_default')
          }
          if (res.data.right === 2) {
            //改变仓库中用户权限状态
            this.$store.commit('change_user_right')
          } else {
            this.$store.commit('change_user_right_default')
          }
          if (parseFloat(res.data.balance) !== 0) {
            //改变仓库中用户余额状态
            this.$store.commit('banalce_status')
          } else {
            this.$store.commit('banalce_status_default')
          }

          //判断用户是否被禁用
          if (res.data.is_forbidden === 1) {
            this.getForbiddenInfo()
            this.$store.commit('is_forbidden_true')
            Toast({
              type: 'fail',
              message: '该账号已被禁用'
            })
          } else {
            this.$store.commit('is_forbidden_false')
          }
          this.userInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取未读信息
    getUnreadMessage() {
      userRequest
        .get('/chat/getUnreadMessage', {
          params: { to_id: localStorage.getItem('ID') }
        })
        .then(res => {
          // console.log(res.data)
          if (res.data.message === 'HAVE') {
            this.$store.commit('change_showDot_true')
          } else {
            this.$store.commit('change_showDot_false')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取禁用信息
    getForbiddenInfo() {
      userRequest
        .get('/user/getUserForbiddenInfo', {
          params: {
            uid: localStorage.getItem('ID')
          }
        })
        .then(res => {
          // console.log(res.data)
          let type = ''
          if (res.data.type === 0) {
            type = '暂时禁用'
          } else {
            type = '永久禁用'
          }
          this.forbidden_text =
            '禁用类型：' +
            type +
            '，禁用原因：' +
            res.data.reason +
            '，禁用时间：' +
            this.$moment(res.data.createAt).format('YYYY-MM-DD HH:mm:ss')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserInfo()
    this.getUnreadMessage()
  }
}
</script>

<style scoped>
.profile {
  height: 100%;
}
.refreshBody {
  height: 100%;
  z-index: 10;
}
.profile_list {
  margin-top: 10vw;
  padding: 0 2vw;
}
.cell {
  border-radius: 3vw;
  font-size: 4vw;
  margin-bottom: 2vw;
}
.profile-navbar-right-icon1 {
  margin-right: 4vw;
}
</style>
