import { Toast } from 'vant'
/* 配置axios */

import axios from 'axios'
import errorTypes from './errorType'
//创建axios的实例
const userRequest = axios.create({
  //后端接口
  baseURL: 'http://localhost:8888',
  //请求超时
  timeout: 5000
})

//设置请求前拦截器
userRequest.interceptors.request.use(request => {

  return request
}, error => {
  return Promise.reject(error)
})

//设置响应前拦截器
userRequest.interceptors.response.use(response => {
  //处理不同的错误响应码
  return response
}, error => {
  console.log(error.response)
  let errorResponse = error.response.data
  let errorMessage = ''
  switch (errorResponse) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      errorMessage = '用户名或密码不能为空！'
      break
    case errorTypes.USER_ALREADY_EXISTS:
      errorMessage = '用户名已经存在！'
      break
    case errorTypes.USER_DOES_NOT_EXISTS:
      errorMessage = '用户不存在！'
      break
    case errorTypes.PASSWORD_IS_INCORENT:
      errorMessage = '密码不正确！'
      break
    case errorTypes.UNAUTHORIZATION:
      errorMessage = '登录信息有误'
      break
    case errorTypes.EXPIRATION_TOKEN:
      errorMessage = '登录信息过期'
      break
    default:
      errorMessage = 'NOT FOUND'
  }
  Toast.fail(errorMessage)

  return Promise.reject(error)
})

export default userRequest