<template>
  <div id="userInfo" class="userInfo" @click="$router.push(route)">
    <div id="avatar" class="avatar">
      <van-image
        width="100%"
        height="100%"
        radius="50%"
        v-if="userInfo.avatar_url"
        :src="userInfo.avatar_url"
      >
        <template slot:loading>
          <loading type="spinner" size="20" />
        </template>
        <template slot:error>加载失败</template>
      </van-image>
      <van-image
        v-else
        width="100%"
        height="100%"
        radius="50%"
        :src="require('../../assets/img/default_avatar_svg')"
      />
    </div>
    <div id="userInfo_Mid" class="userInfo_Mid">
      <div id="nickname" class="nickname">
        <span v-if="userInfo.nickname">
          {{
          userInfo.nickname
          }}
        </span>
        <span v-else>我还没有昵称呢</span>
        <img src="~assets/img/verify.svg" v-if="userInfo.right === 2" />
        <img src="~assets/img/not_verify.svg" v-else />
      </div>
      <div id="userid" class="userid">
        <span>UID:{{ userInfo.uid }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Image as VanImage, Loading } from 'vant'
export default {
  name: 'UserDetails',
  props: ['userInfo', 'route'],
  components: {
    VanImage,
    Loading
  }
}
</script>

<style scoped>
.userInfo {
  height: 22vw;
  margin: 2vw 2vw;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-radius: 3vw;
}
.avatar {
  width: 20vw;
  height: 20vw;
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  margin: 1vw 0 1vw 2vw;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.userInfo_Mid {
  padding: 2vw 0 2vw 30vw;
}
.nickname {
  font-size: 5vw;
}
.nickname span {
  vertical-align: middle;
}
.nickname img {
  width: 5vw;
  height: 5vw;
  margin-left: 2vw;
  vertical-align: middle;
}
.userid {
  font-size: 2vw;
  margin-top: 1vw;
}
</style>