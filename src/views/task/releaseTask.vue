<template>
  <div id="releaseTask" class="releaseTask">
    <nav-bar title="发布代跑任务" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <van-form @submit="onSubmit" class="releaseTaskForm">
      <field style="font-size: 4vw" label="任务类型" :value="taskType" readonly />
      <field
        v-model="title"
        label="任务标题"
        placeholder="取个吸引人的标题吧"
        :rules="[{ validator, message: '标题长度不符合' }]"
        required
        clearable
        style="font-size: 4vw"
      />
      <field
        v-model="description"
        rows="4"
        autosize
        required
        label="任务描述"
        type="textarea"
        maxlength="150"
        placeholder="请输入任务描述，方便他人了解任务哦"
        :rules="[{ required: true, message: '请填写任务描述' }]"
        show-word-limit
        clearable
        style="font-size: 4vw"
      />
      <!--上传取件码图片文件-->
      <field
        required
        name="uploader"
        label="上传代取件码"
        v-if="taskType === '代取快递'"
        style="font-size: 4vw"
      >
        <template #input>
          <uploader
            accept=".jpg, .png"
            :before-read="beforeRead"
            :after-read="afterRead"
            v-model="codeImageList"
          />
        </template>
      </field>
      <!--上传打印文件-->
      <field
        required
        name="uploader"
        label="上传打印文件(.doc/.docx/.pdf格式)"
        v-if="taskType === '代打印'"
        style="font-size: 4vw"
      >
        <template #input>
          <uploader
            accept=".doc, .docx, .pdf"
            :before-read="beforeFileRead"
            :after-read="afterFileRead"
            v-model="printFileList"
          />
        </template>
      </field>
      <!--打印份数-->
      <field
        name="estimated_amount"
        label="份数"
        required
        style="font-size: 4vw"
        v-if="taskType === '代打印'"
      >
        <template #input>
          <stepper v-model="copies" theme="round" step="1" min="1" max="99" input-width="10vw" />
          <span style="margin-left: 2vw">份</span>
        </template>
      </field>
      <!--上传购物文件-->
      <field
        required
        name="uploader"
        label="上传商品照片"
        v-if="taskType === '代购物'"
        style="font-size: 4vw"
      >
        <template #input>
          <uploader
            accept=".jpg, .png"
            :before-read="beforeRead"
            :after-read="afterRead"
            v-model="shoppingFileList"
          />
        </template>
      </field>
      <!--代打印和代购物的预估金-->
      <field
        name="estimated_amount"
        label="预估金"
        required
        style="font-size: 4vw"
        v-if="taskType === '代打印' || taskType === '代购物'"
      >
        <template #input>
          <stepper
            v-model="estimated_amount"
            theme="round"
            step="0.5"
            :decimal-length="2"
            min="1"
            max="50"
            input-width="10vw"
          />
          <span style="margin-left: 2vw">元</span>
        </template>
      </field>
      <!--任务金-->
      <field name="commission" label="任务金" required style="font-size: 4vw">
        <template #input>
          <stepper
            v-model="commission"
            theme="round"
            step="0.5"
            :decimal-length="2"
            min="1"
            max="50"
            input-width="10vw"
          />
          <span style="margin-left: 2vw">元</span>
        </template>
      </field>
      <!--任务有效时间-->
      <field name="commission" label="任务有效时间" required style="font-size: 4vw">
        <template #input>
          <stepper
            v-model="validTime"
            theme="round"
            default-value="1"
            min="1"
            max="5"
            integer
            input-width="10vw"
          />
          <span style="margin-left: 2vw">天</span>
        </template>
      </field>
      <!--收件人-->
      <field
        v-model="addressee"
        label="收件人"
        placeholder="请填写真实姓名"
        :rules="[{ required: true, message: '请填写收件人' }]"
        required
        clearable
        style="font-size: 4vw"
      />
      <!--联系电话-->
      <field
        v-model="telephone"
        label="联系电话"
        placeholder="请填写联系电话"
        :rules="[{ pattern, message: '请填写正确的电话格式' }]"
        required
        clearable
        style="font-size: 4vw"
      />
      <!--收件地址-->
      <field
        v-model="address"
        label="收件地址"
        placeholder="越详细越好哦"
        :rules="[{ required: true, message: '请填写地址' }]"
        required
        clearable
        style="font-size: 4vw"
      />
      <!--确认弹出层-->
      <popup
        v-model="confirmShow"
        closeable
        close-icon="close"
        round
        position="bottom"
        :style="{ height: '50%' }"
      >
        <ul class="confirmList">
          <divider
            :style="{
              color: '#ffd300',
              borderColor: '#ffd300',
              padding: '0 2vw',
            }"
          >预支付确认</divider>
          <li v-if="taskType === '代打印' || taskType === '代购物'">
            <span>预估金:</span>
            <span>{{ this.estimated_amount }}元</span>
          </li>
          <li>
            <span>任务金:</span>
            <span>{{ this.commission }}元</span>
          </li>
          <li>
            <span>账户余额:</span>
            <span>{{ this.balance }}元</span>
          </li>
          <li>
            <span>校验结果:</span>
            <span>
              通过
              <icon size="4vw" color="green" name="success" />
            </span>
          </li>
          <li>
            <van-button
              round
              size="large"
              color="#ffd300"
              text="确认发布"
              style="font-size: 4vw; margin-top: 2vw"
              @click="showPayPasswordInput = true"
            />
          </li>
        </ul>
      </popup>
      <!--支付密码弹出层-->
      <van-dialog
        v-model="showPayPasswordInput"
        title="输入支付密码"
        show-cancel-button
        confirm-button-color="#ffd300"
        @confirm="confirmPaypassword"
        @cancle="this.passwordInput = ''"
      >
        <password-input
          :value="passwordInput"
          :length="6"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
        <number-keyboard
          v-model="passwordInput"
          style="position:relative"
          :show="showKeyboard"
          maxlength="6"
          @blur="showKeyboard = false"
        />
      </van-dialog>
      <van-button
        round
        size="large"
        native-type="submit"
        color="#ffd300"
        text="发布"
        style="font-size: 4vw; margin-top: 2vw"
      />
    </van-form>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Field,
  Button as VanButton,
  Form as VanForm,
  Uploader,
  Stepper,
  Toast,
  Popup,
  Divider,
  Dialog,
  PasswordInput,
  NumberKeyboard
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'ReleaseTask',
  data() {
    return {
      taskType: '',
      user_address_list: [],
      title: '',
      description: '',
      //真正上传到服务器的文件数组
      upload_file: [],
      codeImageList: [],
      printFileList: [],
      shoppingFileList: [],
      copies: null,
      estimated_amount: null,
      commission: null,
      validTime: null,
      addressee: '',
      telephone: '',
      address: '',
      confirmShow: false,
      balance: null,
      pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      showPayPasswordInput: false,
      showKeyboard: false,
      passwordInput: ''
    }
  },
  components: {
    NavBar,
    Icon,
    Field,
    VanButton,
    VanForm,
    Uploader,
    Stepper,
    Popup,
    Divider,
    [Dialog.Component.name]: Dialog.Component,
    PasswordInput,
    NumberKeyboard
  },
  methods: {
    //获取用户地址列表
    getUserAddress() {
      userRequest
        .get('/user/getUserAddress', {
          params: { uid: localStorage.getItem('ID') },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data) {
            this.user_address_list = res.data
            res.data.some(item => {
              if (item.isDefault === 1) {
                this.addressee = item.realname
                this.telephone = item.telephone
                this.address = item.university_name + item.address_details
                return true
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //判断用户输入的任务标题长度
    validator(title) {
      return title.length <= 15 && title.length >= 6
    },
    //代取件码、商品照片上传前处理
    beforeRead(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast('请上传 jpg、png 格式图片')
        return false
      }
      return true
    },
    //代取件码图片、商品照片读取完毕
    afterRead(file) {
      //将文件加入到task对象的upload_file数组中
      this.upload_file.push(file.file)
    },
    //打印文件上传前处理
    beforeFileRead(file) {
      if (
        file.type !== 'application/msword' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.type !== 'application/pdf'
      ) {
        Toast({
          type: 'fail',
          message: '请上传格式正确的文件'
        })
        return false
      }
      //forEach停止需要由异常来判断
      try {
        if (this.printFileList.length >= 1) {
          this.printFileList.forEach(item => {
            if (item.file.name === file.name) {
              Toast({
                type: 'fail',
                message: '请勿重复上传'
              })
              throw new Error('重复')
            }
          })
        }
      } catch (error) {
        if (error.message === '重复') return false
      }
      return true
    },
    //打印文件读取完毕
    afterFileRead(file) {
      //将文件加入到task对象的upload_file数组中
      this.upload_file.push(file.file)
    },
    //将任务有效时间转换为过期时间
    dealTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate() + this.validTime
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute

      let deadtime = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second

      return deadtime
    },
    //提交表单，发布任务
    onSubmit() {
      //判断用户是否上传了图片或文件
      if (this.taskType === '代取快递' && this.codeImageList.length === 0) {
        Toast({
          type: 'fail',
          message: '缺少取件码'
        })
        return
      } else if (this.taskType === '代打印' && this.printFileList.length === 0) {
        Toast({
          type: 'fail',
          message: '还未选择打印文件'
        })
        return
      }
      //获取用户余额
      userRequest
        .get('/balance/getBalance', {
          params: { uid: localStorage.getItem('ID') },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          const user_balance = parseFloat(res.data.balance)
          if (user_balance < this.commission + this.estimated_amount) {
            Toast({
              type: 'fail',
              message: '余额不足'
            })
            return
          }
          this.confirmShow = true
          this.balance = res.data.balance
        })
        .catch(err => {
          console.log(err)
        })
    },
    //校验支付密码
    confirmPaypassword() {
      console.log(this.passwordInput)
      const requestBody = {
        pay_password: this.passwordInput,
        uid: localStorage.getItem('ID')
      }
      userRequest
        .post('/user/verifyPayPassword', requestBody, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.VerifyMessage === 'PAY_PASSWORD_WROPNG' && res.data.VerifyCode === 500) {
            //密码不正确
            Toast({
              type: 'fail',
              message: '密码不正确'
            })
          } else {
            //密码正确，发布任务
            Toast.loading({
              duration: 1000,
              message: '发布任务中',
              forbidClick: true,
              loadingType: 'spinner',
              onClose:() => {
                 this.confirmRelease()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //确认发布，用户输入支付密码，校验通过后发布任务
    confirmRelease() {
      //将发送数据封装成FormData后发送
      let task = new FormData()

      task.append('title', this.title)
      task.append('type', this.taskType)
      task.append('description', this.description)
      //加入文件
      this.upload_file.forEach((item, index) => {
        let fileNmuber = 'file_' + index
        task.append(fileNmuber, item)
      })
      if (this.taskType === '代打印' || this.taskType === '代购物') {
        task.append('copies', this.copies)
        task.append('estimated_amount', this.estimated_amount)
      }
      task.append('commission', this.commission)
      const deadtime = this.dealTime()
      task.append('expiration_time', deadtime)
      task.append('addressee', this.addressee)
      task.append('telephone', this.telephone)
      task.append('address', this.address)
      task.append('uid', localStorage.getItem('ID'))
      console.log(task)
      //发送服务器
      userRequest
        .post('/task/releaseTask', task, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.message === 'RELEASE_SUCCESS' && res.data.statusCode === 200) {
            Toast.clear()
            Toast({
              type: 'success',
              message: '发布成功',
              onClose: () => {
                this.confirmShow = false
                this.$router.push('/home')
              }
            })
          } else {
            Toast.clear()
            Toast({
              type: 'fail',
              message: '发布失败',
              onClose: () => {
                this.confirmShow = false
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.taskType = this.$route.query.type
    this.getUserAddress()
  }
}
</script>

<style lang="less">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.releaseTask {
  height: 100%;
  overflow: scroll;
}
.releaseTaskForm {
  margin-top: 15vw;
  font-size: 5vw;
}
.confirmList {
  padding: 10vw;
  display: flex;
  flex-flow: column;
}
.confirmList li {
  margin-bottom: 2vw;
  display: flex;
  font-size: 5vw;
  justify-content: space-between;
}
</style>