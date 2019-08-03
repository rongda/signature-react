const express = require('express')
const Mock = require('mockjs')
const notice = express()
const Random = Mock.Random

// 消息窗口
notice.post('/top/list', (req, res) => res.send(Mock.mock({
  'err_code': 200,
  'err_msg': 'success',
  'data': {
    'sum': Random.natural(0, 100),
    'list|5': [
      {
        'id|+1': 1,
        'created_at': Random.date(),
        'is_read|1': [false, true],
        'title': Random.ctitle(6, 20)
      }
    ]
  }
})))

// 消息列表
notice.post('/list', (req, res) => {
  const { page, size } = req.body
  return res.send({
    'err_code': 200,
    'err_msg': 'success',
    'data': Mock.mock({
      [`rows|${size}`]: [
        {
          'id|+1': (page - 1) * size + 1,
          'status|1': ['已读', '未读'],
          'title': Random.ctitle(3, 20),
          'type|1': ['活动消息', '预警提示'],
          'create_at': Random.date()
        }
      ],
      'total': 100
    })
  })
})

// 消息详情
notice.post('/info', (req, res) => res.send({
  'err_code': 200,
  'err_msg': 'success',
  'data': Mock.mock({
    'content': Random.cparagraph(10, 100),
    'create_at': Random.date(),
    'status|1': ['已读', '未读'],
    'title': Random.ctitle(5, 20),
    'type|1': ['活动消息', '预警提示']
  })
}))

module.exports = notice
