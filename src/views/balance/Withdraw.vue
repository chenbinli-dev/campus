<template>
  <div id="withdraw">
    <nav-bar title="提现">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <field
      v-model="withdraw_value"
      type="number"
      label="提现金额"
      left-icon="gold-coin-o"
      :placeholder="placeholder"
      style="font-size: 4vw; margin-top: 5vw"
    />
    <div class="ConfirmButton">
      <van-button
        :disabled="!this.withdraw_value"
        round
        color="#ffd300"
        size="large"
        @click="confirmWithdraw"
        >确认提现</van-button
      >
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Field, Button as VanButton, Toast } from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Withdraw',
  data () {
    return {
      withdraw_value: '',
      placeholder: '',
      balance: ''
    }
  },
  components: {
    NavBar,
    Icon,
    Field,
    VanButton
  },
  methods: {
    //获取用户余额
    getBalance () {
      userRequest.get('/balance/getBalance', {
        params: { uid: localStorage.getItem('ID') },
        headers: { 'Authorization': localStorage.getItem('TOKEN') }
      })
        .then(res => {
          this.balance = res.data.balance
          this.placeholder = '余额' + this.balance + '元'
        })
        .catch(err => {
          console.log(err)
        })
    },
    //提现
    confirmWithdraw () {
      //判断输入的金额是否大于余额
      if (parseFloat(this.withdraw_value) > parseFloat(this.balance)) {
        Toast({
          type: 'fail',
          message: '余额不足'
        })
        return
      }
      const withdraw_request = {
        withdraw_value: this.withdraw_value,
        uid: localStorage.getItem('ID')
      }
      userRequest.post('/balance/withdraw', withdraw_request, {
        headers: { 'Authorization': localStorage.getItem('TOKEN') }
      })
        .then(res => {
          if (res.data.message === 'WITHDRAW_SUCCESS' && res.data.statusCode === 200) {
            Toast({
              type: 'success',
              message: '已提交,注意查看账户',
              onClose: () => {
                this.$router.back()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.getBalance()
  }
}
</script>

<style>
.ConfirmButton {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  margin-top: 2vw;
  padding: 0 2vw;
}
</style>