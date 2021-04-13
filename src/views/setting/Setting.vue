<template>
  <div id="setting">
    <nav-bar title="设置">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
      <template #right>
        <span style="font-size: 5vw">客服</span>
      </template>
    </nav-bar>

    <div id="setting_list" class="setting_list">
      <cell title="修改密码" is-link to="/user/editPassword" class="cell" />
      <cell title="服务协议" is-link class="cell" />
      <cell title="版本更新" is-link value="v1.0.0.0" class="cell" />
      <van-button
        round
        color="#ffd300"
        size="large"
        class="exitButton"
        @click="exitLogin"
      >
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script>

import { NavBar, Icon, Dialog, Cell, Button as VanButton } from 'vant'
export default {
  name: 'Setting',
  components: {
    NavBar,
    Cell,
    VanButton,
    Icon
  },
  methods: {
    //退出登录，删除本地token
    exitLogin () {
      Dialog.confirm({
        title: '警告',
        message: '确认退出吗？'
      })
        .then(async () => {
          await localStorage.clear()
          close()
          this.$router.push('/user/login')
        })
        .catch(() => {
          close()
        })
    }
  }
}
</script>

<style>
.setting_list {
  margin: 2vw 2vw 0 2vw;
}
.cell {
  border-radius: 3vw;
  font-size: 4vw;
  margin-bottom: 2vw;
}
.exitButton {
  font-size: 4vw;
}
</style>