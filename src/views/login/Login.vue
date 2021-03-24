<template>
<!-- 登录页面 -->
  <div id="login" class="login">
      <div id="loginTypeTitle" class="loginTypeTitle">{{loginTypeTitle}}</div>
      <text-input
      type="text"
      placeholder="请输入您的用户名,8-16位数字或字母"
      class="login-text-input"
      rule="[a-zA-Z0-9_]{7,15}$"
      lengthLimit=16
      clearable=true
      @emitContent="res => (this.userInfo.username = res)"
      />
      <text-input
      type="password"
      placeholder="请输入您的密码，8-18位且字母开头"
      class="login-text-input"
      rule="^[a-zA-Z]\w{7,17}$"
      lengthLimit=18
      clearable=true
      @emitContent="res => (this.userInfo.password = res)"
      />
      <diy-button 
      class="loginButton" 
      width="100%" 
      height="16vw" 
      btnText="登录"
      @click.native="Login"
      />
      <div class="goRegister" @click="$router.push('/user/register')">没有账号？立即注册</div>
      <div id="bottom-ico" class="bottom-ico">
          <img class="logo" src="../../assets/img/logo.svg">
      </div>
  </div>
</template>

<script>
//导入组件
const TextInput = () => import('components/common/input/TextInput');
const DiyButton = () => import('components/common/button/Button');

import userRequest from 'network/http'

export default {
  components: { TextInput,DiyButton},
    name:'Login',
    data() {
        return {
            userInfo: {
                username:'',
                password:''
            },
            loginTypeTitle:'自定义用户名登录',

        }
    },
    comments: {
        TextInput
    },
    methods: {
        //用户登录
        Login() {
            //对用户名和密码进行校验，是否符合规范
            const usernameRule = /[a-zA-Z0-9_]{7,15}$/;
            const userpasswordRule = /^[a-zA-Z]\w{7,17}$/
            if(!this.userInfo.username || !this.userInfo.password){
                //1.用户名和密码都不能为空
                this.$toast({
                    type:'fail',
                    message:'用户名或密码不能为空'
                });
            }else if(!usernameRule.test(this.userInfo.username)
            || !userpasswordRule.test(this.userInfo.password)
            || this.userInfo.username.length > 16
            || this.userInfo.password.length > 18){
                //2.输入的用户名和密码是否符合规范
                  this.$toast({
                    type:'fail',
                    position:'bottom',
                    message:'您的用户名或密码不符合'
                });
            }else {
                //3.发送登录请求
                userRequest.post('/user/login',this.userInfo)
                .then(res => {
                    //登录成功
                    if(res.data.username === this.userInfo.username) {
                        this.$toast({
                            type:'success',
                            duration:1000,
                            position:'bottom',
                            message:'登录成功',
                            onClose:()=>{
                                this.$router.push('/user/profile')
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    }
        
}
</script>

<style>
.login{
    height: 100%;
}
.loginTypeTitle{
    display: inline-block;
    margin: 10vw 0 5vw 10vw;
    font-size: 6vw;
}
.login-text-input{
    font-size: 5vw;
    margin: 4vw 10vw;
    background-color: #fff;
    border-bottom: solid 1px #ffd300;
}
.loginButton{
    margin: 0 10vw;
    font-size: 6vw;
}
.goRegister{
    margin: 5vw 0 0 10vw;
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
.logo{
    width: 10vw;
    height: 10vw;  
    vertical-align: middle; 
}
.logoTitle{
    vertical-align: middle;
}
</style>