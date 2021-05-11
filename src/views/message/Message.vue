<template>
  <div id="message">
    <nav-bar title="消息中心">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
    <van-row v-if="session.length === 0" type="flex" justify="center" class="empty_tips">当前没有会话</van-row>
    <swipe-cell>
      <van-row
        class="messageList"
        v-for="(item) in session"
        :key="item.user.uid"
        type="flex"
        justify="space-between"
        @click="$router.push({path:'/chat/',query:{to_id: item.user.uid}})"
      >
        <van-col span="6" class="session_avatar">
          <van-image round width="15vw" height="15vw" :src="item.user.avatar_url" />
        </van-col>
        <van-col span="12" class="message_body">
          <van-row class="name">{{item.user.nickname?item.user.nickname:item.user.username}}</van-row>
          <van-row class="message">{{item.last_message.message_body}}</van-row>
        </van-col>
        <van-col span="6" class="message_time">
          <van-row type="flex" justify="center" class="send_at">{{item.last_message.send_at}}</van-row>
          <van-row
            type="flex"
            justify="center"
            v-if="item.un_read_num !== 0"
            style="font-size:2.5vw"
          >
            <badge :content="item.un_read_num" color="#909399" max="99" />
          </van-row>
        </van-col>
        <van-row>
          <div class="van-hairline--bottom"></div>
        </van-row>
      </van-row>
      <template #right>
        <van-button square text="删除" type="danger" class="delete-button" />
      </template>
    </swipe-cell>
  </div>
</template>

<script>
import {
  NavBar,
  Icon,
  Col as VanCol,
  Row as VanRow,
  Image as VanImage,
  button as VanButton,
  Badge,
  SwipeCell
} from 'vant'
import userRequest from 'network/http'
export default {
  name: 'Message',
  data() {
    return {
      session: []
    }
  },
  components: {
    NavBar,
    Icon,
    VanCol,
    VanRow,
    VanImage,
    VanButton,
    Badge,
    SwipeCell
  },
  methods: {
    getSessionList() {
      userRequest
        .get('/chat/getUserSesssion', {
          params: { uid: localStorage.getItem('ID') }
        })
        .then(res => {
          console.log(res)
          res.data.forEach(item => {
            //处理显示时间
            switch (this.$moment(item.last_message.send_at).format('YYYY-MM-DD')) {
              case this.$moment()
                .subtract(0, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = this.$moment(item.last_message.send_at).format('HH:mm')
                break
              case this.$moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '1天前'
                break
              case this.$moment()
                .subtract(2, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '2天前'
                break
              case this.$moment()
                .subtract(3, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '3天前'
                break
              case this.$moment()
                .subtract(4, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '4天前'
                break
              case this.$moment()
                .subtract(5, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '5天前'
                break
              case this.$moment()
                .subtract(6, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '6天前'
                break
              case this.$moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'):
                item.last_message.send_at = '1周前'
                break
              default:
                item.last_message.send_at = this.$moment(item.last_message.send_at).format(
                  'YYYY-MM-DD'
                )
                break
            }
          })
          this.session = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getSessionList()
  }
}
</script>

<style scoped>
.empty_tips {
  padding: 2vw;
  font-size: 3.5vw;
}
.messageList {
  padding: 2vw;
  background-color: #fff;
}
.session_avatar {
  text-align: center;
}
.message_body {
  padding: 0 2vw;
}
.name {
  font-size: 4vw;
  color: black;
  margin-bottom: 2vw;
}
.message {
  font-size: 3.5vw;
  color: #909399;
  text-overflow: ellipsis;
}
.message_time {
  padding: 0 2vw;
}
.send_at {
  font-size: 3.5vw;
  color: #909399;
  margin-bottom: 2vw;
}
</style>