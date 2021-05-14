<template>
  <div id="editPassword">
    <nav-bar title="修改密码">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <van-form @submit="onSubmit" style="margin-top:2vw">
      <field
        v-model="old_password"
        label="旧密码"
        placeholder="请输入旧密码"
        :rules="[{ pattern, message: '密码格式不正确' }]"
        required
        clearable
        type="password"
        style="font-size: 4vw"
      />
      <field
        v-model="new_password"
        label="新密码"
        placeholder="请输入旧密码"
        :rules="[{ pattern,message: '密码格式不正确' }]"
        required
        clearable
        type="password"
        style="font-size: 4vw"
      />
      <field
        v-model="confirm_password"
        label="再次输入"
        placeholder="请确保两次输入的密码一致"
        :rules="[{pattern,message: '密码格式不正确' }]"
        required
        clearable
        type="password"
        style="font-size: 4vw"
      />
      <van-button
        round
        size="large"
        native-type="submit"
        color="#ffd300"
        text="修改"
        style="font-size: 4.5vw; margin-top: 2vw"
      />
    </van-form>
  </div>
</template>

<script>
import { NavBar, Icon, Button as VanButton, Form as VanForm, Field, Toast } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'EditPassword',
  data() {
    return {
      old_password: '',
      new_password: '',
      confirm_password: '',
      pattern: /^[a-zA-Z]\w{7,17}$/
    }
  },
  components: {
    NavBar,
    Icon,
    VanButton,
    VanForm,
    Field
  },
  methods: {
    //提交修改信息
    onSubmit() {
      const req = {
        uid: parseInt(localStorage.getItem('ID')),
        password: this.old_password,
        new_password: this.new_password
      }
      userRequest
        .post('/user/updatePassword', req, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.message === 'UPDATE_SUCCESS' && res.data.statusCode === 200) {
            Toast({
              type: 'success',
              message: '修改成功',
              onClose: () => {
                this.$router.back()
              }
            })
          } else if (res.data.message === 'PASSWORD_NOT_MATCH' && res.data.statusCode === 500) {
            //密码不匹配
            Toast({
              type: 'success',
              message: '密码不正确',
              onClose: () => {
                this.old_password = ''
                this.new_password = ''
                this.confirm_password = ''
              }
            })
          } else {
            Toast({
              type: 'fail',
              message: '修改失败',
              onClose: () => {
                this.old_password = ''
                this.new_password = ''
                this.confirm_password = ''
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
</style>