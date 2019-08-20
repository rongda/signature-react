import * as React from 'react'
import { Row, Col, Icon, Avatar, Statistic, Button, Card, Tooltip } from 'antd'

interface Props {
  data: { [propName: string]: any } | null
}

export default function BasicItem({ data }: Props): React.ReactElement {
  return (
    <React.Fragment>
      <Row className='home-basic'>
        <Col span={12}>
          <Avatar
            icon='user'
            size={60}
            style={{ backgroundColor: '#1890ff' }}
          />
          &emsp;
          <div className='basic-msg'>
            <span>{data && data.user_name}</span>
            <span>
              <Icon type='pushpin' style={{ color: '#1890ff' }} />
              &ensp;个人版
            </span>
          </div>
        </Col>
        <Col span={12} className=''>
          <Statistic
            title='账户余额'
            value={data ? data.balance : 0}
            precision={2}
            suffix='元'
          />
          &emsp;
          <Button type='primary'>充值</Button>
        </Col>
      </Row>
      <Card>
        <Row className='home-statistics'>
          <Col span={6}>
            <div>今日PV&nbsp;
              <Tooltip placement='bottom' title={'今日PV：1天（00:00-24:00）之内，每打开一次下载页，记录1个PV，一天内同一用户多次打开同一页面PV计算多次。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </div>
            <div>{data ? data.summary.today_pv : 0}</div>
            <div>昨日：{data ? data.summary.yesterday_pv : 0}</div>
          </Col>
          <Col span={6}>
            <div>今日UV&nbsp;
              <Tooltip placement='bottom' title={'UV值：1天（00:00-24:00）之内，访问下载页的不重复用户数（以浏览器cookie为依据），一天内同一访客多次访问下载页只被计算1次。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </div>
            <div>{data ? data.summary.today_uv : 0}</div>
            <div>昨日：{data ? data.summary.yesterday_uv : 0}</div>
          </Col>
          <Col span={6}>
            <div>今日IP&nbsp;
              <Tooltip placement='bottom' title={'IP值：1天（00:00-24:00）之内，访问下载页的不重复IP数。一天内相同IP地址多次访问下载页只被计算1次。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </div>
            <div>{data ? data.summary.today_ip : 0}</div>
            <div>昨日：{data ? data.summary.yesterday_ip : 0}</div>
          </Col>
          <Col span={6}>
            <div>今日下载&nbsp;
              <Tooltip placement='bottom' title={'今日下载：1天（00:00-24:00）之内，每下载一次应用，记录1个下载，一天内同一用户多次下载同一应用，下载数只被记录1次。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </div>
            <div>{data ? data.summary.today_dl : 0}</div>
            <div>昨日：{data ? data.summary.yesterday_dl : 0}</div>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  )
}