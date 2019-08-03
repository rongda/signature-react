const express = require('express')
const Mock = require('mockjs')
const overview = express()
const Random = Mock.Random

// 常用应用
overview.post('/apps', (req, res) => {
  const { page, row } = req.body
  const data = Mock.mock({
    [`apps|${row}`]: [{
      'id|+1': (page - 1) * row + 1,
      'create_at': Random.date('yyyy-MM-dd'),
      'name|1': ['支付宝', '网易云音乐', '多闪', '腾讯体育'],
      'download_url': 'http://roda.wang/',
      'status|1': [0, 1],
      'icon_url': 'https://dummyimage.com/150x150',
      'version': 'v1.0.1'
    }],
    total_rows: 100
  })
  return res.send({
    err_code: 200,
    err_msg: 'success',
    data
  })
})

// 账号信息
overview.post('/accountInfo', (req, res) => res.send({
  err_code: 200,
  err_msg: 'success',
  data: {
    'balance': '100.01',
    'summary': Mock.mock({
      'today_dl': Random.natural(0, 10000),
      'today_ip': Random.natural(0, 10000),
      'today_pv': Random.natural(0, 10000),
      'today_uv': Random.natural(0, 10000),
      'yesterday_dl': Random.natural(0, 10000),
      'yesterday_ip': Random.natural(0, 10000),
      'yesterday_pv': Random.natural(0, 10000),
      'yesterday_uv': Random.natural(0, 10000)
    }),
    'user_name': 'Roda'
  }
}))

module.exports = overview
