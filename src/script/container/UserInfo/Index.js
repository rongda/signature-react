import React from 'react'
import { Row, Col, Card, Icon } from 'antd'
import { Link } from 'react-router-dom'
import Base from '../../component/Base'

export default class UserInfo extends React.Component {
  render() {
    return (
      <Base content={
        <div className='user-info'>
          <div className='bread-crumbs-title'>设置</div>
          <div className='main-box'>
            <Row gutter={24} className='user-info-item'>
              <Col span={8}>
                <Link to='/baseinfo'>
                  <Card className='user-info-card' hoverable>
                    <span>
                      <Icon type='schedule' style={{ fontSize: '30px', color: '#ccc' }} />
                    </span>
                    <span>基本资料</span>
                    <span>修改查看账户的基本资料</span>
                  </Card>
                </Link>
              </Col>
              <Col span={8}>
                <Link to='/userpass'>
                  <Card className='user-info-card' hoverable>
                    <span>
                      <Icon type='lock' style={{ fontSize: '30px', color: '#ccc' }} />
                    </span>
                    <span>修改密码</span>
                    <span>修改当前账号的登录密码</span>
                  </Card>
                </Link>
              </Col>
              <Col span={8}>
                <Link to='/financialinfo'>
                  <Card className='user-info-card' hoverable>
                    <span>
                      <Icon type='dollar' style={{ fontSize: '30px', color: '#ccc' }} />
                    </span>
                    <span>财务信息</span>
                    <span>查看消费记录和充值记录</span>
                  </Card>
                </Link>
              </Col>
              <Col span={8}>
                {/* <Link to='/notification'> */}
                <Card className='user-info-card unopen'>
                  <span>
                    <Icon type='setting' style={{ fontSize: '30px', color: '#ccc' }} />
                  </span>
                  <span>通知设置</span>
                  <span>通知设置</span>
                </Card>
                {/* </Link> */}
              </Col>
              <Col span={8}>
                <Card className='user-info-card unopen'>
                  <span>
                    <Icon type='file-protect' style={{ fontSize: '30px', color: '#ccc' }} />
                  </span>
                  <span>发票</span>
                  <span>暂未开通</span>
                </Card>
              </Col>
              <Col span={8}>
                <Card className='user-info-card unopen'>
                  <span>
                    <Icon type='solution' style={{ fontSize: '30px', color: '#ccc' }} />
                  </span>
                  <span>我的方案</span>
                  <span>暂未开通</span>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      } />
    )
  }
}
