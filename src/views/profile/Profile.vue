<template>
  <div id="profile" class="profile">
    <nav-bar title="我">
      <template #right>
        <icon
          class="profile-navbar-right-icon1"
          name="envelop-o"
          size="6vw"
          @click="$router.push('/user/message')"
        />
        <icon
          class="profile-navbar-right-icon2"
          name="setting-o"
          size="6vw"
          @click="$router.push('/user/setting')"
        />
      </template>
    </nav-bar>
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

import { NavBar, PullRefresh, Icon, Cell } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Profile',
  inject: ['reload'],
  data() {
    return {
      isLoading: false,
      userInfo: {}
    }
  },
  components: {
    NavBar,
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
        .get('/user/getUserByUsername/', {
          params: {
            username: localStorage.getItem('USERNAME')
          }
        })
        .then(res => {
          console.log(res.data)
          //将用户是否有支付密码的状态存入仓库
          if (res.data.pay_password) {
            this.$store.commit('pay_password_status')
          } else if (res.data.right === 2) {
            //改变仓库中用户权限状态
            this.$store.commit('change_user_right')
          } else if (parseFloat(res.data.balance) !== 0) {
            //改变仓库中用户余额状态
            this.$store.commit('banalce_status')
          }
          this.userInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style>
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
