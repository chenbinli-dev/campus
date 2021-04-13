<template>
  <div id="submitInfo">
    <nav-bar title="填写学生信息" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
      <template #right>
        <span style="font-size: 5vw" @click="submit">提交</span>
      </template>
    </nav-bar>

    <edit-input @InputClick="nameShow = true">
      <span slot="left">姓名</span>
      <span slot="right" v-if="this.studentInfo.name">{{
        this.studentInfo.name
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="idNumberShow = true">
      <span slot="left">身份证号</span>
      <span slot="right" v-if="this.studentInfo.id_number">{{
        this.studentInfo.id_number
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="provicneShow = true">
      <span slot="left">学校所在省份</span>
      <span slot="right" v-if="this.studentInfo.province">{{
        this.studentInfo.province
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="universityShow = true">
      <span slot="left">学校名称</span>
      <span slot="right" v-if="this.studentInfo.university_name">{{
        this.studentInfo.university_name
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="educationBackgroundShow = true">
      <span slot="left">学历</span>
      <span slot="right" v-if="this.studentInfo.education_background">{{
        this.studentInfo.education_background
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="studentNumberShow = true">
      <span slot="left">学号</span>
      <span slot="right" v-if="this.studentInfo.student_number">{{
        this.studentInfo.student_number
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <edit-input @InputClick="enrollmentYearShow = true">
      <span slot="left">入学年份</span>
      <span slot="right" v-if="this.studentInfo.enrollment_year">{{
        this.studentInfo.enrollment_year
      }}</span>
      <span slot="right" v-else>无</span>
    </edit-input>
    <!--姓名输入-->
    <van-dialog
      title="姓名"
      v-model="nameShow"
      show-cancel-button
      @confirm="nameConfirm"
    >
      <field v-model="name" autofocus="true" />
    </van-dialog>
    <!--身份证号输入-->
    <van-dialog
      title="身份证号"
      v-model="idNumberShow"
      show-cancel-button
      @confirm="idNumerConfirm"
    >
      <field v-model="id_number" autofocus="true" />
    </van-dialog>
    <!--省份选择-->
    <popup
      v-model="provicneShow"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <picker
        title="学校所在省份"
        show-toolbar
        :columns="provinces"
        @cancel="onCancle"
        @confirm="onConfirm"
      />
    </popup>
    <!--学校名字-->
    <van-dialog
      title="学校名称"
      v-model="universityShow"
      show-cancel-button
      @confirm="universityConfirm"
    >
      <field v-model="university_name" autofocus="true" />
    </van-dialog>
    <!--学历-->
    <action-sheet
      v-model="educationBackgroundShow"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    <!--学号输入-->
    <van-dialog
      title="学号"
      v-model="studentNumberShow"
      show-cancel-button
      @confirm="studentNumerConfirm"
    >
      <field v-model="student_number" autofocus="true" />
    </van-dialog>
    <!--入学年份选择-->
    <popup
      v-model="enrollmentYearShow"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <picker
        title="入学年份"
        show-toolbar
        :columns="years"
        @cancel="yearCancle"
        @confirm="yearConfirm"
      />
    </popup>
  </div>
</template>

<script>
const EditInput = () => import("components/common/input/EditInput")
import { NavBar, Icon, Dialog, Field, Picker, Popup, ActionSheet, Toast } from 'vant'

import userRequest from 'network/http'
export default {
  name: 'SubmitInfo',
  data () {
    return {
      studentInfo: {
        name: '',
        id_number: '',
        province: '',
        university_name: '',
        education_background: '',
        student_number: '',
        enrollment_year: '',
        uid: localStorage.getItem('ID')
      },
      nameShow: false,
      idNumberShow: false,
      provicneShow: false,
      universityShow: false,
      educationBackgroundShow: false,
      studentNumberShow: false,
      enrollmentYearShow: false,
      provinces: ['北京市', '广东省', '山东省', '江苏省', '河南省', '上海市', '河北省', '浙江省', '香港特别行政区', '陕西省', '湖南省', '重庆市', '福建省', '天津市', '云南省', '四川省', '广西壮族自治区', '安徽省', '海南省', '江西省', '湖北省', '山西省', '辽宁省', '台湾省', '黑龙江', '内蒙古自治区', '澳门特别行政区', '贵州省', '甘肃省', '青海省', '新疆维吾尔自治区', '西藏区', '吉林省', '宁夏回族自治区'],
      actions: [{ name: '大专' }, { name: '本科' }, { name: '硕士研究生' }, { name: '博士研究生' }],
      years: ['2021', '2020', '2019', '2018', '2017'],
      name: '',
      id_number: '',
      university_name: '',
      student_number: '',

    }
  },
  components: {
    NavBar,
    EditInput,
    Icon,
    [Dialog.Component.name]: Dialog.Component,
    Field,
    Picker,
    Popup,
    ActionSheet
  },
  methods: {
    //姓名确认
    nameConfirm () {
      this.studentInfo.name = this.name
      this.nameShow = false
    },
    //身份证哈号确认
    idNumerConfirm () {
      this.studentInfo.id_number = this.id_number
      this.idNumberShow = false
    },
    //省份确认
    onConfirm (value) {
      this.studentInfo.province = value
      this.provicneShow = false
    },
    onCancle () {
      this.provicneShow = false
    },
    //学校名称确认
    universityConfirm () {
      this.studentInfo.university_name = this.university_name
      this.universityShow = false
    },
    //选择学历
    onSelect (item) {
      this.studentInfo.education_background = item.name
      this.educationBackgroundShow = false
    },
    //学号确认
    studentNumerConfirm () {
      this.studentInfo.student_number = this.student_number
      this.studentNumberShow = false
    },
    //入学年份确认和取消选择
    yearConfirm (value) {
      this.studentInfo.enrollment_year = value
      this.enrollmentYearShow = false
    },
    yearCancle () {
      this.enrollmentYearShow = false
    },
    //提交学生信息
    submit () {
      const id_number_rule = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      //对学生信息进行校验
      if (!this.studentInfo.name
        || !this.studentInfo.id_number
        || !this.studentInfo.province
        || !this.studentInfo.university_name
        || !this.studentInfo.education_background
        || !this.studentInfo.student_number
        || !this.studentInfo.enrollment_year) {
        //信息不完整
        Toast({
          type: 'fail',
          duration: 1000,
          message: '信息不完整'
        })
      } else if (this.studentInfo.name && this.studentInfo.name.length > 10) {
        Toast({
          type: 'fail',
          duration: 1000,
          message: '名字过长'
        })
      } else if (this.studentInfo.id_number
        && this.studentInfo.id_number.length < 16
        || this.studentInfo.id_number.length > 18
        || !id_number_rule.test(this.studentInfo.id_number)) {
        //身份证号不合法
        Toast({
          type: 'fail',
          duration: 1000,
          message: '身份证号码不合法'
        })
      } else if (this.studentInfo.university_name && this.studentInfo.university_name > 15) {
        Toast({
          type: 'fail',
          duration: 1000,
          message: '学校名称过长'
        })
      } else if (this.studentInfo.student_number && this.studentInfo.student_number.length > 30) {
        Toast({
          type: 'fail',
          duration: 1000,
          message: '学号过长'
        })
      } else {
        //信息校验通过，提交后台
        userRequest.post('/user/submitStudentInfo', this.studentInfo, {
          headers: { 'Authorization': localStorage.getItem('TOKEN') }
        })
          .then(res => {
            console.log(res.data)
            if (res.data.statusCode === 200 && res.data.message === 'SUCCESS') {
              //提交成功
              Toast({
                type: 'success',
                duration: 1000,
                message: '提交成功，等待审核',
                onClose: () => {
                  this.$router.back()
                }
              })
            } else if (res.data.statusCode === 500 && res.data.message === 'HAVE_STUDENTINFO') {
              //已有认证记录
              Toast({
                type: 'fail',
                duration: 1000,
                message: '学生信息重复'
              })
            } else {
              Toast({
                type: 'faill',
                duration: 1000,
                message: '提交失败'
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
.navbar {
  margin-bottom: 2vw;
}
</style>