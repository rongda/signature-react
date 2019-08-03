const express = require('express')
const Mock = require('mockjs')
const salesman = express()
const Random = Mock.Random

// 业务员列表
salesman.post('/list', (req, res) => {
  const { page, size } = req.body
  const data = Mock.mock({
    [`rows|${size}`]: [{
      'id|+1': (page - 1) * size + 1,
      'create_at': Random.date('yyyy-MM-dd'),
      'name': Random.cname(),
      'phone': /^1[0-9]{10}$/,
      'status|1': [0, 1],
      'count': 10,
      'username': Random.string(10)
    }],
    total: 100
  })
  return res.send({
    err_code: 200,
    err_msg: 'success',
    data
  })
})

// 业务员业务统计列表
salesman.post('/achievement/list', (req, res) => {
  const { id } = req.body
  console.log(id)
  const data = Mock.mock({
    'achievement_list|8': [
      {
        'amount': Random.float(0, 10000),
        'failure_quantity': Random.natural(0, 10000),
        'merchant_quantity': Random.natural(0, 10000),
        'month|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        'success_quantity': Random.natural(0, 10000)
      }
    ],
    'amount': Random.float(0, 100000),
    'failure_quantity': Random.natural(0, 10000),
    'merchant_quantity': Random.natural(0, 10000),
    'success_quantity': Random.natural(0, 10000)
  })
  return res.send({
    err_code: 200,
    err_msg: 'success',
    data
  })
})

// 业绩设置
salesman.post('/achievement/set', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

// 业务员密码重置
salesman.post('/password/reset', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

// 业务员状态更改
salesman.post('/status/update', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success'
}))

module.exports = salesman
