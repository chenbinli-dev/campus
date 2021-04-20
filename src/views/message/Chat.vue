<template>
  <div id="chat" class="chat">
    <nav-bar :title="receiver.nickname?receiver.nickname:receiver.username" class="navbar">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="back" />
      </template>
    </nav-bar>

    <div class="message_list" ref="scroll">
      <div v-for="(item,index) in arr" :key="index" ref="item">
        <!--对方-->
        <div class="left" v-if="item.to_id === parseInt(uid)">
          <div class="avatar">
            <img :src="sender.avatar_url" />
          </div>
          <div class="left_item_body">
            <div class="left_message_body">{{item.message_body}}</div>
            <div class="left_send_at">{{item.send_at}}</div>
          </div>
        </div>
        <!--自己-->
        <div class="right" v-if="item.from_id === parseInt(uid)">
          <div class="avatar">
            <img :src="receiver.avatar_url" />
          </div>
          <div class="right_item_body">
            <div class="right_message_body">{{item.message_body}}</div>
            <div class="right_send_at">{{item.send_at}}</div>
          </div>
        </div>
      </div>
    </div>
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
            //处理时间，如果聊天时间不是今天，则显示具体时间
            res.data.forEach(item => {
              if (new Date(item.send_at).toLocaleDateString() === new Date().toLocaleDateString()) {
                const date = new Date(item.send_at)
                const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                item.send_at = hours + ':' + minutes
              } else {
                const date = new Date(item.send_at)
                const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
                const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                item.send_at = month + '-' + day + ' ' + hours + ':' + minutes
              }
            })
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
      socket.emit('send', data)
      const date = new Date(data.send_at)
      data.send_at = date.getHours() + ':' + date.getMinutes()
      this.arr.push(data)
      this.message = ''
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
  },
  watch: {
    //监听数组的变化,滚动定位到底部
    arr(val) {
      if (val) {
        this.$nextTick(() => {
          let scorll = this.$refs.scroll
          scorll.scrollTop = scorll.scrollHeight
        })
      }
    }
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
  padding: 12vw 0;
}
.message_list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
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
.left {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  padding: 2vw;
}
.right {
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;
  padding: 2vw;
}
.left_item_body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2vw;
}
.right_item_body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 2vw;
}
.right_message_body {
  position: relative;
  max-width: 70vw;
  padding: 2vw 3vw;
  font-size: 3.5vw;
  color: rgba(25, 29, 35, 1);
  border-radius: 2vw 2vw 0 2vw;
  background-color: rgb(148, 236, 192);
}
.left_message_body {
  position: relative;
  max-width: 70vw;
  padding: 2vw 3vw;
  border-radius: 2vw 2vw 2vw 0;
  font-size: 3.5vw;
  color: rgba(25, 29, 35, 1);
  background-color: rgb(255, 255, 255, 1);
}
.left_send_at {
  padding-top: 2vw;
  color: rgba(25, 29, 35, 1);
  width: fit-content;
  line-height: 4vw;
}
.right_send_at {
  padding-top: 2vw;
  color: rgba(25, 29, 35, 1);
  width: fit-content;
  line-height: 4vw;
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