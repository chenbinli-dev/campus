<template>
  <div id="balance" class="balance">
    <nav-bar title="账户余额">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
      <template #right>
        <span style="font-size:5vw" @click="$router.push('/user/balanceRecord')">账单</span>
      </template>
    </nav-bar>

    <pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh" class="refreshBody">
      <div class="balanceInfo">
        <div class="balanceBox">
          <span class="balanceValue">{{ this.balance }}</span>
        </div>
        <div class="updateTime">更新时间：{{ this.updateTime }}</div>
      </div>

      <div id="balance_list" class="balance_list">
        <cell
          v-if="!pay_password"
          title="支付密码"
          is-link
          value="未设置"
          class="cell"
          @click="createPayPasswordShow = true"
        />
        <cell
          v-else
          title="支付密码"
          value="去修改"
          is-link
          class="cell"
          @click="updatePayPasswordShow = true"
        />
        <cell title="去充值" is-link to="/user/recharge" class="cell" />
        <cell title="去提现" is-link to="/user/withdraw" class="cell" />
      </div>
    </pull-refresh>

    <popup
      v-model="createPayPasswordShow"
      closeable
      @closed="closePopup"
      close-icon-position="top-left"
      position="top"
      :style="{ height: '100%' }"
    >
      <ul class="setInputList">
        <li>
          <span class="title">设置支付密码，用于支付任务金</span>
        </li>
        <li>
          <div class="firstInput">
            <span class="labelTitle">请输入支付密码</span>
            <password-input
              :value="firstInput"
              :length="6"
              :focused="showKeyboard"
              @focus=";(showKeyboard = true), (showKeyboard2 = false)"
            />
            <number-keyboard
              v-model="firstInput"
              :show="showKeyboard"
              maxlength="6"
              @blur="showKeyboard = false"
            />
          </div>
        </li>
        <li>
          <div class="secondInput">
            <span class="labelTitle">确认支付密码</span>
            <password-input
              :value="secondInput"
              :length="6"
              :focused="showKeyboard2"
              @focus=";(showKeyboard2 = true), (showKeyboard = false)"
            />
            <number-keyboard
              v-model="secondInput"
              :show="showKeyboard2"
              maxlength="6"
              @blur="showKeyboard2 = false"
            />
          </div>
        </li>
        <li class="buttonBox">
          <van-button
            :disabled="
              this.firstInput.length < 6 || this.secondInput.length < 6
            "
            color="#ffd300"
            size="large"
            @click="Confirm"
          >确认</van-button>
        </li>
      </ul>
    </popup>
    <!--修改支付密码-->
    <popup
      v-model="updatePayPasswordShow"
      closeable
      @closed="closePopup"
      close-icon-position="top-left"
      position="top"
      :style="{ height: '100%' }"
    >
      <ul class="updateInputList">
        <li>
          <span class="title">修改支付密码</span>
        </li>
        <li>
          <div class="firstInput">
            <span class="labelTitle">请输入支付密码</span>
            <password-input
              :value="oldPasswordInput"
              :length="6"
              :focused="showUpdateKeyboard1"
              @focus="
                ;(showUpdateKeyboard1 = true), (showUpdateKeyboard2 = false)
              "
            />
            <number-keyboard
              v-model="oldPasswordInput"
              :show="showUpdateKeyboard1"
              maxlength="6"
              @blur="showUpdateKeyboard1 = false"
            />
          </div>
        </li>
        <li>
          <div class="secondInput">
            <span class="labelTitle">设置新支付密码</span>
            <password-input
              :value="newPasswordInput"
              :length="6"
              :focused="showUpdateKeyboard2"
              @focus="
                ;(showUpdateKeyboard2 = true), (showUpdateKeyboard1 = false)
              "
            />
            <number-keyboard
              v-model="newPasswordInput"
              :show="showUpdateKeyboard2"
              maxlength="6"
              @blur="showUpdateKeyboard2 = false"
            />
          </div>
        </li>
        <li class="buttonBox">
          <van-button
            :disabled="
              this.oldPasswordInput.length < 6 ||
              this.newPasswordInput.length < 6
            "
            color="#ffd300"
            size="large"
            @click="Update"
          >确认修改</van-button>
        </li>
      </ul>
    </popup>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  PullRefresh,
  Button as VanButton,
  Popup,
  Cell,
  PasswordInput,
  NumberKeyboard,
  Toast
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Balance',
  inject: ['reload'],
  data() {
    return {
      isLoading: false,
      createPayPasswordShow: false,
      updatePayPasswordShow: false,
      showKeyboard: false,
      showKeyboard2: false,
      showUpdateKeyboard1: false,
      showUpdateKeyboard2: false,
      isDisabled: true,
      firstInput: '',
      secondInput: '',
      oldPasswordInput: '',
      newPasswordInput: '',
      confirm: {
        confirmPassword: '',
        uid: null
      },
      update: {
        oldPassword: '',
        newPassword: '',
        uid: null
      },
      balance: '',
      updateTime: '',
      pay_password: ''
    }
  },
  components: {
    NavBar,
    Icon,
    PullRefresh,
    Popup,
    Cell,
    PasswordInput,
    NumberKeyboard,
    VanButton
  },
  methods: {
    //通过用户id获取用户余额和支付密码
    getUserBalanceAndPayPasswordByUid() {
      userRequest
        .get('/user/getUserBalanceAndPayPasswordByUid', {
          params: { uid: localStorage.getItem('ID') }
        })
        .then(res => {
          this.balance = res.data.balance
          let date = new Date()
          let y = date.getFullYear()
          let m = date.getMonth() + 1
          m = m < 10 ? '0' + m : m
          let d = date.getDate()
          d = d < 10 ? '0' + d : d
          let h = date.getHours()
          h = h < 10 ? '0' + h : h
          let minute = date.getMinutes()
          let second = date.getSeconds()
          minute = minute < 10 ? '0' + minute : minute
          second = second < 10 ? '0' + second : second

          let deadtime = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
          this.updateTime = deadtime
          this.pay_password = res.data.pay_password
        })
        .catch(err => {
          console.log(err)
        })
    },
    //关闭弹出层
    closePopup() {
      this.reload()
    },
    //提交支付密码
    Confirm() {
      if (
        this.firstInput.length < 6 ||
        this.secondInput.length < 6 ||
        !this.firstInput ||
        !this.secondInput
      ) {
        Toast({
          type: 'fail',
          message: '信息不完整'
        })
      } else if (this.firstInput !== this.secondInput) {
        Toast({
          type: 'fail',
          message: '两次密码不一致'
        })
      } else {
        //校验通过
        this.confirm.confirmPassword = this.secondInput
        this.confirm.uid = localStorage.getItem('ID')
        userRequest
          .post('/balance/createPayPassword', this.confirm, {
            headers: { Authorization: localStorage.getItem('TOKEN') }
          })
          .then(res => {
            if (res.data.message === 'INSERT_SUCCESS' && res.data.statusCode === 200) {
              Toast({
                type: 'fail',
                message: '设置成功',
                onClose: () => {
                  this.createPayPasswordShow = false
                  this.reload()
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    //更新用户支付密码
    Update() {
      if (
        this.oldPasswordInput.length < 6 ||
        this.newPasswordInput.length < 6 ||
        !this.oldPasswordInput ||
        !this.newPasswordInput
      ) {
        Toast({
          type: 'fail',
          message: '信息不完整'
        })
      } else {
        //校验通过
        this.update.oldPassword = this.oldPasswordInput
        this.update.newPassword = this.newPasswordInput
        this.update.uid = localStorage.getItem('ID')
        userRequest
          .post('/balance/updatePayPassword', this.update, {
            headers: { Authorization: localStorage.getItem('TOKEN') }
          })
          .then(res => {
            console.log(res.data)
            if (res.data.message === 'UPDATE_SUCCESS' && res.data.statusCode === 200) {
              Toast({
                type: 'fail',
                message: '修改成功',
                onClose: () => {
                  this.updatePayPasswordShow = false
                  this.reload()
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    //下拉刷新
    onRefresh() {
      this.getUserBalanceAndPayPasswordByUid()
      this.isLoading = false
    }
  },
  created() {
    this.getUserBalanceAndPayPasswordByUid()
  }
}
</script>

<style lang="less" scoped>
.balance {
  height: 100%;
}
.refreshBody {
  height: 100%;
  z-index: 10;
}
.balanceInfo {
  width: 100%;
  height: 50vw;
  padding: 5vw 2vw;
}
.balanceBox {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
  width: 100%;
  height: 50vw;
  border-radius: 2vw;
  background: linear-gradient(to bottom right, #17d9a6, pink);
}
.balanceValue {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
  width: 30vw;
  height: 30vw;
  border: 1vw solid #fff;
  border-radius: 50%;
  font-size: 5vw;
  color: #fff;
}
.updateTime {
  width: 100%;
  text-align: right;
  padding-right: 2vw;
  font-size: 4vw;
}
.balance_list {
  margin-top: 20vw;
  padding: 0 2vw;
}
.cell {
  border-radius: 3vw;
  font-size: 4vw;
  margin-bottom: 2vw;
}
.title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 3.5vw;
  font-weight: bold;
  margin-bottom: 6vw;
}
.setInputList,
.updateInputList {
  margin: 30vw 2vw 0 2vw;
}
.labelTitle {
  display: block;
  padding-left: 5vw;
  margin-bottom: 2vw;
  font-size: 5vw;
}
.buttonBox {
  margin-top: 4vw;
  padding: 0 4vw;
}
</style>