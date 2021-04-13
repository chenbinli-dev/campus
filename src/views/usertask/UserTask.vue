<template>
  <div id="usertask">
    <nav-bar title="任务信息"></nav-bar>
    <tabbar></tabbar>
  </div>
</template>

<script>
const Tabbar = () => import("components/common/tabbar/Tabbar")
import { NavBar } from 'vant'
export default {
  name: "UserTask",
  components: {
    Tabbar,
    NavBar
  }
}
</script >

  <style>
</style>