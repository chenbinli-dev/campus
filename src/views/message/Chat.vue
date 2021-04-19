<template>
  <div id="chat">
    <nav-bar :title="receiver.nickname?receiver.nickname:receiver.username" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <div class="input">
      <input placeholder="请输入" />
      <div class="send_icon">
        <van-image
          width="8vw"
          height="8vw"
          radius="50%"
          lazy-load:true
          show-loading
          src="@~assets/img/send_icon.svg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Image as VanImage } from 'vant'
import io from 'socket.io-client'
import userRequest from 'network/http'
const socket = io('http://localhost:8880')
export default {
  name: 'Chat',
  data() {
    return {
      receiver: {},
      message: ''
    }
  },
  components: {
    NavBar,
    Icon,
    VanImage
  },
  methods: {
    //发送消息
    send() {
      socket.emit('message', '你好')
    },
    //获取聊天对象信息
    getUser(uid) {
      userRequest
        .get('/user/getUserByUid', {
          params: { uid: uid }
        })
        .then(res => {
          console.log(res.data)
          this.receiver = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUser(parseInt(this.$route.params.uid))
  }
}
</script>

<style>
.navbar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 12vw;
  background-color: #fff;
  display: flex;
}
.input input {
  flex: 1;
  padding: 2vw 10vw 2vw 2vw;
  margin: 2vw;
  background-color: #eee;
  outline-style: none;
  border-style: none;
  border-radius: 3vw;
}
.send_icon {
  position: absolute;
  right: 0;
  height: 12vw;
  padding: 2vw 0;
  margin-right: 4vw;
}
</style>