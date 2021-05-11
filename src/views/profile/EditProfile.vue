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

    <uploader
      class="uploader"
      accept="image/png, image/jpeg, image/jpg"
      :deletable="false"
      :max-count="1"
      :after-read="afterRead"
    >
      <cell is-link size="large" :center="true" class="avatar">
        <template #title>
          <span>头像</span>
        </template>
        <van-image
          v-if="userInfo.avatar_url"
          :src="userInfo.avatar_url"
          width="10vw"
          height="10vw"
          round
        />
        <van-image
          v-else
          name="default_image"
          width="10vw"
          height="10vw"
          round
          :src="require('../../assets/img/default_avatar.svg')"
        />
      </cell>
    </uploader>
    <cell-group>
      <cell :value="userInfo.username">
        <template #title>
          <span>账号</span>
        </template>
      </cell>

      <cell :value="userInfo.nickname" is-link @click="nicknameShow = true">
        <template #title>
          <span>昵称</span>
        </template>
      </cell>

      <cell :value="handleGender" is-link @click="genderShow = true">
        <template #title>
          <span>性别</span>
        </template>
      </cell>

      <cell :value="userInfo.telephone" is-link @click="telephoneShow = true">
        <template #title>
          <span>联系电话</span>
        </template>
      </cell>

      <cell :value="userInfo.brithday" is-link @click="showTimeSelect = true">
        <template #title>
          <span>生日</span>
        </template>
      </cell>
    </cell-group>

    <van-dialog title="昵称" v-model="nicknameShow" show-cancel-button @confirm="nicknameConfirm">
      <field v-model="nickname" autofocus />
    </van-dialog>

    <van-dialog title="联系电话" v-model="telephoneShow" show-cancel-button @confirm="telephoneConfirm">
      <field v-model="telephone" autofocus />
    </van-dialog>

    <action-sheet v-model="genderShow" :actions="userGender" cancel-text="取消" @select="onSelect" />

    <popup v-model="showTimeSelect" position="bottom" :style="{ height: '40%' }">
      <datetime-picker
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="timeSelect"
        @cancel="showTimeSelect = false"
      />
    </popup>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Cell,
  CellGroup,
  Uploader,
  Image as VanImage,
  ActionSheet,
  DatetimePicker,
  Popup,
  Dialog,
  Field,
  Toast
} from 'vant'
import userRequest from 'network/http'

export default {
  name: 'EditProfile',
  components: {
    NavBar,
    Cell,
    CellGroup,
    Icon,
    Uploader,
    VanImage,
    ActionSheet,
    DatetimePicker,
    Popup,
    [Dialog.Component.name]: Dialog.Component,
    Field
  },
  inject: ['reload'],
  data() {
    return {
      userInfo: {
        username: '',
        avatar_url: null,
        nickname: '',
        gender: null,
        telephone: '',
        brithday: null
      },
      default_avatar: [],
      nicknameShow: false,
      telephoneShow: false,
      genderShow: false,
      showTimeSelect: false,
      nickname: '',
      telephone: '',
      userGender: [
        { name: '男', val: 100 },
        { name: '女', val: 200 }
      ],
      //自定义日历日期
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2015, 0, 31)
    }
  },
  computed: {
    handleGender() {
      let gender
      if (this.userInfo.gender === 100) {
        gender = '男'
      } else if (this.userInfo.gender === 200) {
        gender = '女'
      } else if (!this.userInfo.gender) {
        gender = '未设置'
      }
      return gender
    }
  },
  methods: {
    //获取用户信息
    getUserInfo() {
      userRequest
        .get('/user/getUserByUid', {
          params: {
            uid: localStorage.getItem('ID')
          }
        })
        .then(res => {
          console.log(res.data)
          this.userInfo.username = res.data.username
          //加上时间戳，实现图片的刷新
          this.userInfo.avatar_url = res.data.avatar_url + '?time=' + Date.now()
          if (res.data.nickname) {
            this.userInfo.nickname = res.data.nickname
          } else {
            this.userInfo.nickname = '未设置'
          }
          this.userInfo.gender = res.data.gender
          if (res.data.telephone) {
            this.userInfo.telephone = res.data.telephone
          } else {
            this.userInfo.telephone = '未设置'
          }
          if (res.data.brithday) {
            this.userInfo.brithday = res.data.brithday
          } else {
            this.userInfo.brithday = '未设置'
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //提交用户信息的修改
    updateInfo() {
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
      userRequest
        .post('/user/updateUserInfo', this.userInfo, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
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
    afterRead(file) {
      //将文件信息放入表单中，上传后台
      const formData = new FormData()
      formData.append('avatar', file.file)

      userRequest
        .post('/upload/avatar', formData, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.message === 'UPLOAD_SUCCESS') {
            this.$forceUpdate()
            this.$toast({
              type: 'success',
              message: '上传成功'
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
    nicknameConfirm() {
      this.userInfo.nickname = this.nickname
      this.nicknameShow = false
    },
    telephoneConfirm() {
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
    onSelect(data) {
      this.userInfo.gender = data.val
      this.genderShow = false
    },
    //选择日期后
    timeSelect(date) {
      this.userInfo.brithday = this.$moment(date).format('YYYY-MM-DD')
      this.showTimeSelect = false
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style>
.uploader {
  position: relative;
  width: 100%;
}
.uploader .van-uploader__input-wrapper {
  width: 100%;
}
</style>