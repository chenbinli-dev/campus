<template>
  <div id="recharge">
    <nav-bar title="充值">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <div class="chooseValue">
      <span class="chooseTitle">选择充值额度</span>
      <grid :column-num="3" clickable>
        <grid-item
          icon="gold-coin-o"
          v-for="value in values"
          :key="value"
          :text="value"
          :class="{ active: value === selectValue }"
          @click="selectValue = value"
        />
      </grid>
    </div>
    <div class="confirmButton">
      <van-button
        :disabled="!this.selectValue"
        color="#ffd300"
        size="large"
        @click="confirmValue"
      >支付{{ this.selectValue }}元</van-button>
    </div>
    <ul class="tips">
      <li>Tps:</li>
      <li>1.账户余额与真实金额一比一，可用预估金，任务金支付。</li>
      <li>2.账户余额可随时提现。</li>
    </ul>

    <van-dialog
      v-model="select_pay_method_show"
      title="选择支付方式"
      show-cancel-button
      @confirm="confirm_recharge"
    >
      <div class="pay_ways">
        <radio-group v-model="pay_methods">
          <radio name="wechat" checked-color="#ffd300">
            <img src="~assets/img/pay_wechat.svg" style="width: 10vw; height: 10vw" />
          </radio>
          <radio name="alipay" checked-color="#ffd300">
            <img src="~assets/img/pay_alipay.svg" style="width: 10vw; height: 10vw" />
          </radio>
        </radio-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Grid,
  GridItem,
  Button as VanButton,
  Dialog,
  RadioGroup,
  Radio,
  Toast
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Recharge',
  data() {
    return {
      values: ['20.00', '30.00', '50.00', '70.00', '100.00', '150.00'],
      selectValue: '20.00',
      select_pay_method_show: false,
      isactive: true,
      pay_methods: 'wechat'
    }
  },
  components: {
    NavBar,
    Icon,
    Grid,
    GridItem,
    VanButton,
    [Dialog.Component.name]: Dialog.Component,
    RadioGroup,
    Radio
  },
  methods: {
    //提交支付金额
    confirmValue() {
      console.log(this.selectValue)
      this.select_pay_method_show = true
    },
    //跳转第三方支付平台进行支付，这里做模拟
    confirm_recharge() {
      console.log(this.pay_methods)
      const requestDate = {
        recharge_value: this.selectValue,
        pay_methods: this.pay_methods,
        uid: localStorage.getItem('ID')
      }
      userRequest
        .post('/balance/recharge', requestDate, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.message === 'RECHARGE_SUCCESS' && res.data.statusCode === 200) {
            Toast({
              type: 'success',
              message: '充值成功'
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

<style scoped>
.chooseValue {
  padding: 2vw;
}
.chooseTitle {
  display: block;
  font-size: 4vw;
  font-weight: bold;
  padding: 3vw 0;
}
.confirmButton {
  margin: 2vw 2vw;
}
.active {
  color: #ffd300;
}
.pay_ways {
  padding: 2vw;
  display: flex;
  justify-content: center;
}
.tips {
  padding: 2vw 2vw 0 2vw;
  font-size: 3.5vw;
  font-weight: bold;
}
</style>