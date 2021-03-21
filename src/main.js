import Vue from 'vue';
import router from './router';
import { Field } from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';


Vue.config.productionTip = false;
Vue.use(Field);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
