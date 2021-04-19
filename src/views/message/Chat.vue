<template>
  <div id="chat" class="chat">
    <nav-bar :title="receiver.nickname?receiver.nickname:receiver.username" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="back" />
      </template>
    </nav-bar>

    <ul class="message_list">
      <li v-for="(item,index) in arr" :key="index">
        <!--发送者-->
        <div class="message-item-sender" v-if="item.from_id === parseInt(uid)">
          <div class="sender_item_body">
            <div class="sender_message_body">{{item.message_body}}</div>
            <!-- <div class="sender_send_at">{{item.send_at}}</div> -->
          </div>
          <div class="avatar">
            <img :src="sender.avatar_url" />
          </div>
        </div>
        <!--接收者-->
        <div class="message-item-receiver" v-else>
          <div class="avatar">
            <img :src="receiver.avatar_url" />
          </div>
          <div class="receiver_item_body">
            <div class="receiver_message_body">{{item.message_body}}</div>
            <!-- <div class="receiver_send_at">{{item.send_at}}</div> -->
          </div>
        </div>
      </li>
    </ul>
    <div class="input">
      <input v-model="message" placeholder="请输入" />
      <div class="send_icon" @click="send">
        <img src="~assets/img/send_icon.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Toast } from 'vant'
import io from 'socket.io-client'
import userRequest from 'network/http'
const socket = io('http://localhost:8880')
export default {
  name: 'Chat',
  data() {
    return {
      receiver: {},
      sender: {},
      message: '',
      uid: localStorage.getItem('ID'),
      arr: []
    }
  },
  components: {
    NavBar,
    Icon
  },
  methods: {
    //获取用户聊天记录
    getUserChatRecord() {
      userRequest
        .get('/chat/getRecord', {
          params: { uid: this.uid }
        })
        .then(res => {
          console.log(res.data)
          if (res.data) {
            this.arr = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //返回并断开连接
    back() {
      this.$router.back()
      this.disconnet()
      //清空消息数组
      this.arr = []
    },
    join() {
      socket.emit('join', parseInt(localStorage.getItem('ID')))
    },
    //发送消息
    send() {
      if (!this.message) {
        //不能发送空白内容
        Toast({
          type: 'fail',
          message: '不能发送空消息'
        })
        return
      }
      const data = {
        message_body: this.message,
        to_id: this.receiver.uid,
        from_id: parseInt(this.uid),
        send_at: new Date()
      }
      this.arr.push(data)
      socket.emit('send', data)
      this.message = ''
      console.log(this.arr)
    },
    //接受消息
    getMessage() {
      socket.on('getMessage', data => {
        this.arr.push(data)
      })
    },
    //监听错误
    onError() {
      socket.on('Error', error => {
        console.log(error)
      })
    },
    //断开连接
    disconnet() {
      socket.emit('out', parseInt(this.uid))
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
    },
    //获取用户自己头像
    getSenderUser(uid) {
      userRequest
        .get('/user/getUserByUid', {
          params: { uid: uid }
        })
        .then(res => {
          this.sender = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.join()
    this.getMessage()
    this.getUser(parseInt(this.$route.params.uid))
    this.getSenderUser(parseInt(this.uid))
    this.getUserChatRecord()
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
.chat {
  height: 100%;
  overflow: scroll;
}
.message_list {
  margin-top: 12vw;
  margin-bottom: 12vw;
}
.message_list li {
  margin: 2vw;
  outline-style: none;
}
.avatar {
  width: 10vw;
  height: 10vw;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.message-item-sender {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 2vw;
}
.sender_item_body {
  width: fit-content;
  margin-right: 2vw;
}
.receiver_item_body {
  margin-left: 2vw;
}
.sender_message_body {
  display: inline-block;
  position: relative;
  right: 0;
  padding: 2vw;
  margin: 0 2vw 0 0;
  border-radius: 2vw;
  background-color: rgb(148, 236, 192);
}
.message-item-receiver {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 2vw;
}
.receiver_message_body {
  display: inline-block;
  padding: 2vw;
  margin: 0 0 0 2vw;
  border-radius: 2vw;
  background-color: #8fe;
}
.receiver_send_at {
  padding-left: 2vw;
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
  margin: 2vw 4vw;
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
  margin-right: 6vw;
}
.send_icon img {
  width: 8vw;
  height: 8vw;
}
</style>