<template>
  <!-- 注册页面 -->
  <div id="register" class="register">
    <div id="backIcon" class="backIcon">
      <icon name="arrow-left" size="8vw" @click="$router.push('/user/login')" />
    </div>
    <div id="registerTypeTitle" class="registerTypeTitle">
      {{ registerTypeTitle }}
    </div>
    <text-input
      type="text"
      placeholder="请输入您的用户名,8-16位数字或字母"
      class="register-text-input"
      rule="[a-zA-Z0-9_]{7,15}$"
      lengthLimit="16"
      clearable="true"
      @emitContent="(res) => (this.userInfo.username = res)"
    />
    <text-input
      type="password"
      placeholder="请输入您的密码，8-18位且字母开头"
      class="register-text-input"
      rule="^[a-zA-Z]\w{7,17}$"
      lengthLimit="18"
      clearable="true"
      @emitContent="(res) => (this.userInfo.password = res)"
    />
    <text-input
      type="password"
      placeholder="请再次输入您的密码"
      class="register-text-input"
      rule="^[a-zA-Z]\w{7,17}$"
      lengthLimit="18"
      clearable="true"
      @emitContent="(res) => (this.passwordAgain = res)"
    />
    <van-button
      round
      size="large"
      color="#ffd300"
      class="registerButton"
      @click="register"
    >
      注册
    </van-button>
  </div>
</template>

<script>
//导入组件
const TextInput = () => import('components/common/input/TextInput')
import { Toast, Icon, Button as VanButton } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Register',
  data () {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      passwordAgain: '',
      registerTypeTitle: '自定义用户名注册',

    }
  },
  components: { TextInput, VanButton, Icon },
  methods: {
    //用户注册
    register () {
      //对用户名和密码进行校验，是否符合规范
      const usernameRule = /[a-zA-Z0-9_]{7,15}$/
      const userpasswordRule = /^[a-zA-Z]\w{7,17}$/

      if (!this.userInfo.username || !this.userInfo.password || !this.passwordAgain) {
        //1.用户名和密码都不能为空
        Toast({
          type: 'warning',
          message: '用户名或密码不能为空'
        })
      } else if (this.userInfo.password !== this.passwordAgain) {
        //2.两次输入的密码是否一致
        this.$toast({
          type: 'warning',
          message: '两次输入的密码不一致'
        })
      } else if (!usernameRule.test(this.userInfo.username)
        || !userpasswordRule.test(this.userInfo.password)
        || this.userInfo.username.length > 16
        || this.userInfo.password.length > 18) {
        Toast({
          type: 'danger',
          message: '您的用户名或密码不符合'
        })
        //3.输入的用户名和密码是否符合规范
      } else {
        //4.全部符合，发送注册请求
        userRequest.post('/user/register', this.userInfo)
          .then(res => {
            console.log(res)
            if (res.data.affectedRows === 1) {
              //console.log('注册成功');
              Toast({
                type: 'success',
                duration: 1000,
                message: '注册成功',
                onClose: () => {
                  this.$router.push('/user/login')
                }
              })
            } else {
              Toast({
                type: 'fail',
                duration: 1000,
                message: '用户名已存在！'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
  }

}
</script>

<style>
.register {
  height: 100%;
  padding: 10vw 10vw 0 10vw;
}
.registerTypeTitle {
  display: inline-block;
  margin: 5vw 0 5vw 0;
  font-size: 6vw;
}
.register-text-input {
  font-size: 5vw;
  margin-bottom: 5vw;
  background-color: #fff;
  border-bottom: solid 1px #ffd300;
}
.registerButton {
  margin-bottom: 5vw;
  font-size: 6vw;
}
.goRegister {
  margin: 5vw 0 0 10vw;
}
</style>