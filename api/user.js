const express = require('express')
const Mock = require('mockjs')
const user = express()
const Random = Mock.Random

// 登录
user.post('/login', (req, res) => {
  const data = Mock.mock({
    'token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU1NzMwNTg2OH0.eTZrz3b-BLCa5EIR7qZuJhBBEb-K6M66Y0BQIQBHgKS6Z8YHmRnxP3dU3vDOTFKDHyIByhdQjufiaOspaXB5yQ',
    'name': Random.name(),
    'phone': /^1[0-9]{10}$/
  })
  return res.send({
    'err_code': 200,
    'err_msg': 'success',
    data
  })
})

// 退出
user.post('/logout', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

// 绑定邮箱
user.post('/app/user/bindingEmail', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

// 短信验证码
user.post('/app/user/sendSms', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

// 修改密码
user.post('/app/user/changepwd', (req, res) => {
  return res.send({
    err_code: 200,
    err_msg: 'success'
  })
})
// 忘记密码
user.post('/app/user/resetPwd', (req, res) => {
  return res.send({
    err_code: 200,
    err_msg: 'success'
  })
})

// 基本信息
user.post('/app/user/info', (req, res) => res.send({
  err_code: 200,
  err_msg: 'success',
  data: Mock.mock({
    credit_line: Random.natural,
    email: 'wrdwer0595@qq.com',
    phone: /^1[0-9]{10}$/,
    user_name: Random.name()
  })
}))

// 用户注册
user.post('/app/user/register', (req, res) => res.send({
  err_code: 200,
  err_msg: 'success'
}))

module.exports = user
