/* 配置axios */

import axios from 'axios';

//创建axios的实例
const request = axios.create({
    //后端接口
    baseURL:'http://loaclhost:8888',
    //请求超时
    timeout:5000

});

//设置请求前拦截器
request.interceptors.request.use(config => {

    //do something
  },error => {
      return Promise.reject(error)
  })

//设置响应前拦截器
request.interceptors.response.use(response => {

    //do something
  },error => {
      return Promise.reject(error)
  })

  export default request;