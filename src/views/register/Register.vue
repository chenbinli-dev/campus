<template>
  <!-- 注册页面 -->
  <div id="register" class="register">
    <div id="backIcon" class="backIcon">
      <icon name="arrow-left" size="8vw" @click="$router.push('/user/login')" />
    </div>
    <!--注册方式-->
    <tabs v-model="active" color="#ffd300" background="#eee">
      <tab title="自定义" name="0">
        <text-input
          style="margin-top:5vw"
          type="text"
          placeholder="请输入您的用户名,8-20位数字或字母"
          class="register-text-input"
          rule="[a-zA-Z0-9_]{7,19}$"
          lengthLimit="20"
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
        <van-button round size="large" color="#ffd300" class="registerButton" @click="register">注册</van-button>
      </tab>
      <!--邮箱注册-->
      <tab title="邮箱注册" name="1">
        <text-input
          style="margin-top:5vw"
          type="text"
          placeholder="请输入您的邮箱"
          class="register-text-input"
          lengthLimit="20"
          clearable="true"
          @emitContent="(res) => (this.email = res)"
        />
        <field v-model="verifyCode" clearable placeholder="请输入6位字符验证码" style="margin-bottom:5vw">
          <template #button>
            <van-button
              v-if="!showCounter"
              size="small"
              type="primary"
              :text="button_text"
              @click="sendCode"
            />
            <van-button v-else size="small" color="#666666" disabled>{{time_counter+'s后重新获取'}}</van-button>
          </template>
        </field>
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
          @click="email_register"
        >注册</van-button>
      </tab>
    </tabs>
  </div>
</template>

<script>
//导入组件
const TextInput = () => import('components/common/input/TextInput')
import { Field, Toast, Icon, Button as VanButton, Tab, Tabs } from 'vant'
import userRequest from 'network/http'

export default {
  name: 'Register',
  data() {
    return {
      active: '0',
      userInfo: {
        username: '',
        password: ''
      },
      passwordAgain: '',
      email: '',
      verifyCode: '',
      showCounter: false,
      time_counter: null,
      registerTypeTitle: '自定义用户名注册',
      button_text: '发送验证码'
    }
  },
  components: { Field, TextInput, VanButton, Icon, Tab, Tabs },
  methods: {
    //用户自定义注册
    register() {
      //对用户名和密码进行校验，是否符合规范
      const usernameRule = /[a-zA-Z0-9_]{7,19}$/
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
      } else if (
        !usernameRule.test(this.userInfo.username) ||
        !userpasswordRule.test(this.userInfo.password) ||
        this.userInfo.username.length > 20 ||
        this.userInfo.password.length > 18
      ) {
        Toast({
          type: 'danger',
          message: '您的用户名或密码不符合'
        })
        //3.输入的用户名和密码是否符合规范
      } else {
        //4.全部符合，发送注册请求
        userRequest
          .post('/user/register', this.userInfo)
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
    //用户获取邮箱验证码
    sendCode() {
      console.log(this.email)
      const email_rule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (email_rule.test(this.email)) {
        //邮箱格式通过,发送用户邮箱，等待后台发送验证码
        const body = {
          email: this.email
        }
        userRequest
          .post('/user/getEmailCode', body)
          .then(res => {
            console.log(res.data)
            if (res.data.message === 'SEND_SUCCESS' && res.data.sendStatus === 200) {
              //发送成功
              Toast({
                type: 'success',
                message: '验证码已发送到您邮箱'
              })
              this.showCounter = true
              this.userInfo.username = this.email
              //设置倒计时
              this.time_counter = 60
              const timer = setInterval(() => {
                if (this.time_counter > 0) {
                  this.time_counter--
                } else {
                  this.showCounter = false
                  this.button_text = '重新获取'
                  clearInterval(timer)
                }
              }, 1000)
            } else {
              //发送失败
              Toast({
                type: 'fail',
                message: '发送失败，请重试',
                onClose: () => {
                  this.email = ''
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        //邮箱格式不通过
        Toast({
          type: 'fail',
          message: '邮箱不合法'
        })
        return
      }
    },
    //提交邮箱注册信息
    email_register() {
      const userpasswordRule = /^[a-zA-Z]\w{7,17}$/
      if (!this.verifyCode) {
        Toast({
          type: 'fail',
          message: '验证码为空'
        })
        return
      } else if (this.verifyCode.length !== 6) {
        Toast({
          type: 'fail',
          message: '验证码不合法'
        })
        return
      } else if (!this.userInfo.password || !this.passwordAgain) {
        Toast({
          type: 'fail',
          message: '密码不能为空'
        })
        return
      } else if (this.userInfo.password !== this.passwordAgain) {
        Toast({
          type: 'fail',
          message: '前后密码不一致'
        })
        return
      } else if (
        !userpasswordRule.test(this.userInfo.password) ||
        !userpasswordRule.test(this.passwordAgain)
      ) {
        Toast({
          type: 'fail',
          message: '密码不合法'
        })
        return
      } else {
        //全部通过，提交后台
        const body = {
          username: this.userInfo.username,
          password: this.userInfo.password,
          verifyCode: this.verifyCode
        }
        userRequest
          .post('/user/emailRegister', body)
          .then(res => {
            console.log(res.data)
            if (res.data.statusCode === 200) {
              //注册成功
              Toast({
                type: 'success',
                message: '注册成功',
                onClose: () => {
                  this.$router.push('/user/login')
                }
              })
            } else if (res.data.statusCode === 500) {
              //注册失败
              Toast({
                type: 'fail',
                message: '注册失败'
              })
            } else if (res.data.statusCode === 301) {
              //验证码错误
              Toast({
                type: 'fail',
                message: '验证码错误'
              })
            } else if (res.data.statusCode === 302) {
              //验证码失效
              Toast({
                type: 'fail',
                message: '无效验证码'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style>
.register {
  height: 100%;
  padding: 10vw 10vw 0 10vw;
}
.register-text-input {
  font-size: 5vw;
  margin-bottom: 5vw;
  background-color: #fff;
  border-bottom: solid 1px #ffd300;
}
.showCountDown {
  display: none;
}
.registerButton {
  margin-bottom: 5vw;
  font-size: 6vw;
}
.goRegister {
  margin: 5vw 0 0 10vw;
}
</style>