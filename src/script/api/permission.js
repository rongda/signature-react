import instance from './instance'

const headers = { 'content-type': 'application/x-www-form-urlencoded' }

export default () => ({
  // 登录
  login(params) {
    const newInstance = { ...instance }
    newInstance.defaults.headers = headers
    const paramsArr = Object.keys(params)
    params = paramsArr.map(item => `${item}=${params[item]}`).join('&')
    return newInstance.post('/login', params)
  },
  // 退出登录
  logout() {
    return instance.post('/logout')
  },
  // 绑定邮箱
  bindingEmail(params) {
    return instance.post('/app/user/bindingEmail', params)
  },
  // 修改密码
  changePwd(params) {
    return instance.post('/app/user/changepwd', params)
  },
  // 重置密码
  resetPwd(params) {
    return instance.post('/app/user/resetPwd', params)
  },
  // 短信验证码
  captchaSendSms(phone) {
    return instance.post('/app/user/sendSms', { phone })
  },
  // 基本信息
  userInfo() {
    return instance.post('/app/user/info')
  },
  // 用户注册
  userRegister(params) {
    return instance.post('/app/user/register', params)
  }
})
