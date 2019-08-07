import React from 'react'
import ReactMarkdown from 'react-markdown'
import privacy from './privacy.md'
import server from './server.md'
import publishServer from './publishServer.md'

export default [
  {
    type: 'server',
    title: '超级签名服务条款',
    main: <ReactMarkdown source={server} escapeHtml={false} />
  },
  {
    type: 'privacy',
    title: '超级签名隐私声明',
    main: <ReactMarkdown source={privacy} escapeHtml={false} />
  },
  {
    type: 'publishServer',
    title: '服务使用条款',
    main: <ReactMarkdown source={publishServer} escapeHtml={false} />
  },
  {
    type: null,
    title: null,
    main: null
  }
]
