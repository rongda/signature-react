import axios from 'axios'
import { message } from 'antd'
import storage from '../utils/storage'

const instance = axios.create({
  baseURL: process.env.api,
  timeout: 6000,
  headers: {
    token: storage.getToken(),
    'content-type': 'application/json'
  }
})

// Add a request interceptor
instance.interceptors.request.use(config => config, error => {
  message.warning('请求超时，请稍后重试', 1)
  return Promise.resolve(error)
})

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    if (response.data.err_code === 200) {
      return response.data
    }
    // if (response.data.err_code === 600) {
    //   message.warning('系统异常，请稍后重试', 1)
    // }
    if (response.data.err_code === 601) {
      message.warning('账号已登出，请重新认证', 1, () => {
        // 返回登录页面
        storage.remove()
        window.location.href = '/login'
      })
      return null
    }
    // if (response.data.err_code === 602) {
    //   message.warning('参数错误，请稍后重试', 1)
    // }
    return Promise.reject(response.data)
  },
  error => {
    console.log(error)
    // 响应超时
    if (error.toString().indexOf('timeout') > -1) {
      message.warning('网络出差啦，请稍后重试', 1)
    }
    if (error.response.status === 500) {
      message.warning('服务端正出差，请稍后重试', 1)
    }
    return Promise.reject(error)
  }
)

export default instance
