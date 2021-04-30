import Vue from 'vue'
import moment from 'moment'
import router from './router'
import store from './store'
import Io from 'socket.io-client'
import vueIo from 'vue-socket.io'
import App from './App.vue'

//socket配置
const socketOption = {
  autoConnect: false
}
Vue.use(
  new vueIo({
    debug: true,   // debug调试，生产关闭
    connection: Io("localhost:8889", socketOption)
  })
)
Vue.config.productionTip = false
Vue.prototype.$moment = moment
new Vue({
  sockets: {
    connecting () {
      console.log('正在连接')
    },
    disconnect () {
      console.log("Socket 断开")
    },
    connect_failed () {
      console.log('连接失败')
    },
    connect () {
      console.log('连接成功')
    }
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
