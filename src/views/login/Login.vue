<template>
<!-- 登录页面 -->
  <div id="login" class="login">
      <text-input
      type="text"
      placeholder="请输入您的用户名"
      class="login-text-input"
      rule="^.{6,16}$"
      clearable=true
      />
      <text-input
      type="password"
      placeholder="请输入您的密码"
      class="login-text-input"
      rule="^.{6,16}$"
      clearable=true
      />
  </div>
</template>

<script>
//导入组件
const TextInput = () => import('components/common/input/TextInput')

export default {
  components: { TextInput },
    name:'Login',
    data() {
        return {
            username:'',
            password:''
        }
    },
    comments: {
        TextInput
    },
    methods: {
        
    },
}
</script>

<style>
.login-text-input{
    font-size: 5vw;
    margin: 4vw 0;
    background-color: #fff;
    border-bottom: solid 1px #ffd300;
}
</style>