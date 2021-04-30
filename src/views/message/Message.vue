<template>
  <div id="message">
    <nav-bar title="消息中心">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <van-row class="messageList" v-for="item in arr" :key="item">
      <van-col span="4">span: 4</van-col>
      <van-col span="10" offset="4">offset: 4, span: 10</van-col>
    </van-row>
  </div>
</template>

<script>
import { NavBar, Icon, Col as VanCol, Row as VanRow } from 'vant'
export default {
  name: 'Message',
  data () {
    return {
      arr:[]
    }
  },
  components: {
    NavBar,
    Icon,
    VanCol,
    VanRow
  }
}
</script>

<style>
</style>