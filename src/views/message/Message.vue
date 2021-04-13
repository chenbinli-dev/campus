<template>
  <div id="message">
    <nav-bar title="消息中心">
      <template #left>
        <icon name="arrow-left" size="6vw" @click="$router.back()" />
      </template>
    </nav-bar>
  </div>
</template>

<script>
import { NavBar, Icon } from 'vant'
export default {
  name: 'Message',
  components: {
    NavBar,
    Icon
  }
}
</script>

<style>
</style>