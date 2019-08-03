import React from 'react'
import { Menu, Input, Icon, Divider, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

const appItem = [
  {
    id: 122112,
    icon_url: 'https://dummyimage.com/150x150',
    name: '支付宝'
  },
  {
    id: 122,
    icon_url: 'https://dummyimage.com/150x150',
    name: '云音乐'
  }
]

@withRouter
class AppItem extends React.Component {
  constructor() {
    super(...arguments)
    const { pathname, search } = this.props.location
    const id = search && pathname === '/appinfo' && queryString.parse(search).id ? queryString.parse(search).id : null
    const openKeys = id ? [`${pathname.split('/')[1]},${id}`] : []
    this.state = {
      value: '',
      openKeys,
      defaultSelectedKeys: openKeys
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  gotoAppDetail(item, key, keyPath, domEvent) {
    const { history } = this.props
    // 等待过渡动画完成后再跳转
    this.timer = setTimeout(() => {
      history.push(`/${key.split(',').join('?id=')}`)
    }, 160)
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    const { openKeys, defaultSelectedKeys, value } = this.state
    return (
      <React.Fragment>
        <div className='side-wrap'>
          <Divider />
          <Input
            className='app-search'
            placeholder='搜索应用'
            prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={value}
            onChange={this.handleChange}
          />
          <Button
            type='primary'
            icon='plus-circle'
            className='add-app'
          >发布应用</Button>
        </div>
        <Menu
          mode='inline'
          openKeys={openKeys}
          className='app-item-menu'
          defaultSelectedKeys={defaultSelectedKeys}
          onClick={({
            item, key, keyPath, domEvent
          }) => this.gotoAppDetail(
            item, key, keyPath, domEvent
          )}
        >
          {appItem.map(item => (
            <Menu.Item key={`appinfo,${item.id}`}>
              <div className='app-item'>
                <img src={item.icon_url} width='35' />
                <div className='app-item-name-ios'>
                  <span>{item.name}</span>
                  <span>iOS</span>
                </div>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </React.Fragment>
    )
  }
}

export default AppItem
