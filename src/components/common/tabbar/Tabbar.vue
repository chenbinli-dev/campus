<template>
  <div id="tabbar">
    <tabbar
      v-model="active"
      active-color="#ffd300"
      class="tabbar"
      @change="onChange"
    >
      <tabbar-item name="home" icon="home-o">主页</tabbar-item>
      <tabbar-item name="task" icon="todo-list-o">任务</tabbar-item>
      <tabbar-item name="profile" icon="manager-o">我</tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  name: 'MyTabbar',
  data () {
    return {
      active: 'profile'
    }
  },
  components: {
    Tabbar,
    TabbarItem
  },
  methods: {
    onChange (name) {
      if (name === 'home') {
        this.$router.push('/home')
      } else if (name === 'task') {
        this.$router.push('/usertask')
      } else if (name === 'profile') {
        this.$router.push('/user/profile')
      }
    }
  },
  created () {
    if (this.$parent.$route.path === '/home') {
      this.active = 'home'
    } else if (this.$parent.$route.path === '/usertask') {
      this.active = 'task'
    } else if (this.$parent.$route.path === '/user/profile') {
      this.active = 'profile'
    }
  }
}
</script>

<style>
</style>