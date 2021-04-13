<template>
  <div id="editProfile">
    <nav-bar title="修改个人信息">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
      <template #right>
        <span style="font-size: 5vw" @click="updateInfo">保存</span>
      </template>
    </nav-bar>

    <div class="uploaderFile">
      <uploader
        class="uploaderImg"
        preview-size="100vw"
        accept="image/png, image/jpeg,image/jpg"
        capture="camera "
        :after-read="afterRead"
      />
      <edit-input>
        <span slot="left">头像</span>
        <img
          slot="right"
          v-if="userInfo.avatar_url"
          :src="userInfo.avatar_url"
        />
        <img slot="right" v-else src="~assets/img/default_img.jpg" />
      </edit-input>
    </div>

    <edit-input>
      <span slot="left">账号</span>
      <span slot="right">{{ userInfo.username }}</span>
    </edit-input>

    <edit-input @InputClick="nicknameShow = true">
      <span slot="left">昵称 </span>
      <span v-if="userInfo.nickname" slot="right">
        {{ userInfo.nickname }}
      </span>
      <span v-else slot="right">未设置</span>
    </edit-input>

    <edit-input @InputClick="genderShow = true">
      <span slot="left">性别</span>
      <span v-if="userInfo.gender" slot="right">
        {{ userInfo.gender === 100 ? '男' : '女' }}
      </span>
      <span v-else slot="right">未设置</span>
    </edit-input>

    <edit-input @InputClick="telephoneShow = true">
      <span slot="left">联系电话 </span>
      <span v-if="userInfo.telephone" slot="right">
        {{ userInfo.telephone }}
      </span>
      <span v-else slot="right">未设置</span>
    </edit-input>

    <edit-input @InputClick="calendarShow = true">
      <span slot="left">生日 </span>
      <span slot="right" v-if="userInfo.brithday">{{ userInfo.brithday }}</span>
      <span slot="right" v-else>未设置</span>
    </edit-input>

    <van-dialog
      title="昵称"
      v-model="nicknameShow"
      show-cancel-button
      @confirm="nicknameConfirm"
    >
      <field v-model="nickname" autofocus="" />
    </van-dialog>

    <van-dialog
      title="联系电话"
      v-model="telephoneShow"
      show-cancel-button
      @confirm="telephoneConfirm"
    >
      <field v-model="telephone" autofocus="" />
    </van-dialog>

    <action-sheet
      v-model="genderShow"
      :actions="userGender"
      cancel-text="取消"
      @select="onSelect"
    />

    <calendar
      type="single"
      color="#ffd300"
      :min-date="minDate"
      :max-date="maxDate"
      v-model="calendarShow"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
const EditInput = () => import("components/common/input/EditInput")

import { NavBar, Icon, Uploader, ActionSheet, Calendar, Dialog, Field, Toast } from 'vant'
import userRequest from 'network/http'


export default {
  name: 'EditProfile',
  components: {
    NavBar,
    EditInput,
    Icon,
    Uploader,
    ActionSheet,
    Calendar,
    [Dialog.Component.name]: Dialog.Component,
    Field
  },
  inject: ['reload'],
  data () {
    return {
      userInfo: {
        username: '',
        avatar_url: '',
        nickname: '',
        gender: null,
        telephone: '',
        brithday: ''
      },
      nicknameShow: false,
      telephoneShow: false,
      genderShow: false,
      calendarShow: false,
      nickname: '',
      telephone: '',
      userGender: [{ name: '男', val: 100 }, { name: '女', val: 200 }],
      //自定义日历日期
      minDate: new Date(1899, 0, 1),
      maxDate: new Date(2015, 0, 31),
    }
  },
  methods: {
    //获取用户信息
    getUserInfo () {
      userRequest.get('/user/getUserByUsername/',
        {
          params: {
            username: localStorage.getItem('USERNAME')
          }
        })
        .then(res => {
          console.log(res.data)
          this.userInfo.username = res.data.username
          //加上时间戳，实现图片的刷新
          this.userInfo.avatar_url = res.data.avatar_url + '?time=' + Date.now()
          this.userInfo.nickname = res.data.nickname
          this.userInfo.gender = res.data.gender
          this.userInfo.telephone = res.data.telephone
          this.userInfo.brithday = res.data.brithday
        })
        .catch(err => {
          console.log(err)
        })
    },
    //提交用户信息的修改
    updateInfo () {
      console.log(this.userInfo)
      //1.判断用户信息填写,昵称不能为空
      if (!this.userInfo.nickname) {
        this.$toast({
          type: 'warning',
          message: '信息不全'
        })
        return
      } else if (this.userInfo.nickname.length <= 4) {
        this.$toast({
          type: 'warning',
          message: '昵称长度过短'
        })
        return
      } else if (this.userInfo.nickname.length >= 10) {
        this.$toast({
          type: 'warning',
          message: '昵称长度过长'
        })
        return
      }
      //2.进行用户信息更新
      userRequest.post('/user/updateUserInfo', this.userInfo, {
        headers: { 'Authorization': localStorage.getItem('TOKEN') }
      })
        .then(res => {
          if (res.data.statusCode === 200) {
            this.$toast({
              type: 'success',
              message: '修改成功'
            })
            this.getUserInfo()
            this.reload()
          } else {
            this.$toast({
              type: 'warning',
              message: '修改失败'
            })
            this.reload()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //文件读取完毕后
    afterRead (file) {
      //将文件信息放入表单中，上传后台
      const formData = new FormData()
      formData.append("avatar", file.file)

      userRequest.post('/upload/avatar', formData, {
        headers: { 'Authorization': localStorage.getItem('TOKEN') }
      })
        .then(res => {
          if (res.data.message === 'UPLOAD_SUCCESS') {
            this.$forceUpdate()
            this.$toast({
              type: 'success',
              message: '上传成功',
            })
          } else {
            this.$toast({
              type: 'fail',
              message: '上传失败'
            })
          }
          this.reload()
        })
        .catch(err => {
          console.log(err)
        })
    },
    nicknameConfirm () {
      this.userInfo.nickname = this.nickname
      this.nicknameShow = false
    },
    telephoneConfirm () {
      const teltphoneRule = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (teltphoneRule.test(this.telephone)) {
        this.userInfo.telephone = this.telephone
        this.telephoneShow = false
      } else {
        Toast({
          type: 'fail',
          message: '输入不合法'
        })
        this.telephoneShow = false
      }
    },
    //用户选择性别之后
    onSelect (data) {
      this.userInfo.gender = data.val
      this.genderShow = false
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    //选择日期后
    onConfirm (date) {
      this.userInfo.brithday = this.formatDate(date)
      this.calendarShow = false
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style>
.uploaderFile {
  margin-top: 2vw;
  position: relative;
  overflow: hidden;
}
.uploaderImg {
  position: absolute;
  opacity: 0;
}
</style>