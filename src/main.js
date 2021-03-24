import Vue from 'vue';
import router from './router';
//按需引入
import Field from 'vant';
import Toast from 'vant';
import Icon from 'vant';
import 'vant/lib/index.css';

import App from './App.vue';


Vue.config.productionTip = false;
Vue.use(Field);
Vue.use(Toast);
Vue.use(Icon);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
