<template>
  <!-- 登录页面 -->
  <div id="login" class="login">
    <div id="loginTypeTitle" class="loginTypeTitle">{{ loginTypeTitle }}</div>
    <text-input
      type="text"
      placeholder="请输入您的用户名"
      class="login-text-input"
      lengthLimit="20"
      clearable="true"
      @emitContent="(res) => (this.userInfo.username = res)"
    />
    <text-input
      type="password"
      placeholder="请输入您的密码，8-18位且字母开头"
      class="login-text-input"
      rule="^[a-zA-Z]\w{7,17}$"
      lengthLimit="18"
      clearable="true"
      @emitContent="(res) => (this.userInfo.password = res)"
    />
    <van-row>
      <van-button round color="#ffd300" size="large" class="loginButton" @click="Login">登录</van-button>
    </van-row>
    <van-row class="goRegister">
      <p @click="$router.push('/user/register')">没有账号？立即注册</p>
    </van-row>
    <div id="bottom-ico" class="bottom-ico">
      <img class="logo" src="../../assets/img/logo.svg" />
    </div>
  </div>
</template>

<script>
//导入组件
const TextInput = () => import('components/common/input/TextInput')
import { Toast, Button as VanButton, Row as VanRow } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Login',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      loginTypeTitle: '登录'
    }
  },
  components: {
    TextInput,
    VanButton,
    VanRow
  },
  methods: {
    //用户登录
    Login() {
      //对用户名和密码进行校验，是否符合规范
      const usernameRule1 = /[a-zA-Z0-9_]{7,19}$/
      const usernameRule2 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      const userpasswordRule = /^[a-zA-Z]\w{7,17}$/
      if (!this.userInfo.username || !this.userInfo.password) {
        //1.用户名和密码都不能为空
        Toast({
          type: 'fail',
          message: '用户名或密码不能为空'
        })
      } else if (
        (!usernameRule1.test(this.userInfo.username) &&
          !usernameRule2.test(this.userInfo.username)) ||
        !userpasswordRule.test(this.userInfo.password) ||
        this.userInfo.username.length > 20 ||
        this.userInfo.password.length > 18
      ) {
        //2.输入的用户名和密码是否符合规范
        Toast({
          type: 'fail',
          position: 'bottom',
          message: '您的用户名或密码不符合'
        })
      } else {
        //3.发送登录请求
        userRequest
          .post('/user/login', this.userInfo)
          .then(res => {
            // console.log(res.data);
            //登录成功
            if (res.data.username === this.userInfo.username && res.data.token) {
              //将返回的数据保存在localstorage中
              localStorage.setItem('ID', res.data.uid)
              localStorage.setItem('USERNAME', res.data.username)
              localStorage.setItem('TOKEN', res.data.token)
              const toast = Toast({
                type: 'success',
                duration: 1000,
                message: '登录成功'
              })
              setTimeout(() => {
                toast.clear()
                this.$router.push('/user/profile')
              }, 1000)
            }
          })
          .catch(err => {
            console.log(err.response)
          })
      }
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  padding: 10vw 10vw 0;
}
.loginTypeTitle {
  display: inline-block;
  margin-bottom: 5vw;
  font-size: 6vw;
}
.login-text-input {
  font-size: 5vw;
  margin-bottom: 5vw;
  border-bottom: solid 1px #ffd300;
}
.loginButton {
  margin-bottom: 5vw;
  font-size: 6vw;
}
.goRegister {
  font-size: 4vw;
  padding-left: 2vw;
}
.bottom-ico {
  width: 100%;
  position: fixed;
  margin-bottom: 5vw;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
}
.logo {
  width: 10vw;
  height: 10vw;
  vertical-align: middle;
}
.logoTitle {
  vertical-align: middle;
}
</style>