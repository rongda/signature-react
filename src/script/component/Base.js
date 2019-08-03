import React from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Card, Modal, Avatar } from 'antd'
import { withRouter, Redirect, Link } from 'react-router-dom'
import storage from '../utils/storage'
import { tryLogout } from '../store/actions'
import AppItem from './AppItem'
import logo from '../../assets/logo.png'

const confirm = Modal.confirm

const rootMenuSource = [
  {
    key: 'index',
    icon: 'home',
    name: '概述'
  },
  {
    key: 'userinfo',
    icon: 'setting',
    name: '账户设置'
  },
  {
    key: 'statistics',
    icon: 'bar-chart',
    name: '数据统计'
  }
]

@withRouter
@connect(
  null,
  {
    tryLogout
  }
)
class Base extends React.Component {
  constructor() {
    super(...arguments)
    const { pathname } = this.props.location
    const isRoot = rootMenuSource.some(item => `/${item.key}` === pathname)
    const openKeys = isRoot ? [pathname.split('/')[1]] : []
    this.state = {
      openKeys,
      defaultSelectedKeys: openKeys
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  handleLogout() {
    const { tryLogout } = this.props
    confirm({
      title: '你确定你要退出吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        tryLogout()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  gotoRouterDetail(item, key, keyPath, domEvent) {
    const { history } = this.props
    // 等待过渡动画完成后再跳转
    this.timer = setTimeout(() => {
      history.push(`/${key}`)
    }, 160)
  }

  render() {
    const { openKeys, defaultSelectedKeys } = this.state
    const { content } = this.props
    return (
      !storage.getToken() ? <Redirect to='/login' /> : <div className='base'>
        <div className='sider'>
          <Link className='logo' to='/'>
            <img src={logo} width='20' />
            <span>&ensp;iOS&ensp;App超级签名</span>
          </Link>
          <div className='scroll-bar menu-wrap'>
            <Menu
              mode='inline'
              openKeys={openKeys}
              defaultSelectedKeys={defaultSelectedKeys}
              onClick={({
                item, key, keyPath, domEvent
              }) => this.gotoRouterDetail(
                item, key, keyPath, domEvent
              )}
            >
              {rootMenuSource.map(item => (
                <Menu.Item key={item.key}>
                  <Icon type={item.icon} />
                  {item.name}
                </Menu.Item>
              ))}
            </Menu>
            <AppItem />
          </div>
        </div>
        <div className='base-right'>
          <div className='headers'>
            <div className='msg'>
              <span className='name'>
                {storage.getUserName().phone}
              </span>
              <Link to='/userinfo'><Avatar icon='user' style={{ backgroundColor: '#1890ff' }} /></Link>
              <span className='logout'
                onClick={this.handleLogout}
              >退出</span>
            </div>
          </div>
          <div className='content'>
            <Card
              className='scroll-bar content-card'
              bordered={false}
            >
              {content}
            </Card>
          </div>
        </div>
      </div>
    )
  }
}
export default Base
