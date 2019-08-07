const express = require('express')
const Mock = require('mockjs')
const apps = express()
const Random = Mock.Random

// 应用列表
apps.post('/list', (req, res) => res.send({
  err_code: 200,
  err_msg: 'success',
  ...Mock.mock({
    [`data|10`]: [{
      'id|+1': 0,
      'name|1': ['支付宝', '网易云音乐', '多闪', '腾讯体育'],
      'icon_url': 'https://dummyimage.com/150x150'
    }]
  })
}))

// 版本记录
apps.post('/statis/versionlog', (req, res) => {
  const { page, size } = req.body
  res.send({
    err_code: 200,
    err_msg: 'success',
    data: {
      ...Mock.mock({
        [`rows|${size}`]: [{
          'id|+1': (page - 1) * size + 1,
          'download_count': Random.natural(0, 1000),
          'size': '10M',
          'time': Random.date('yyyy-MM-dd'),
          'version': `1.0.${size}`
        }]
      }),
      'total': 100
    }
  })
})

// 下载记录
apps.post('/statis/downlog', (req, res) => {
  const { page, size } = req.body
  res.send({
    err_code: 200,
    err_msg: 'success',
    data: {
      ...Mock.mock({
        [`rows|${size}`]: [{
          'id|+1': (page - 1) * size + 1,
          'app_name': Random.cname(1, 4),
          'price|1': ['10元', '20元'],
          'udid': 'abced',
          'device': 'iphone xs max',
          'system': 'MacBook Pro',
          'version': `1.0.${size}`,
          'ip': '192.168.0.1',
          'down_type': '1',
          'download_count': Random.natural(0, 1000),
          'time': Random.date('yyyy-MM-dd')
        }]
      }),
      'total': 100
    }
  })
})

module.exports = apps
