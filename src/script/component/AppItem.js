import React from 'react'
import { Menu, Input, Icon, Divider } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { getAppItem, getAppItemFilter } from '../store/actions'
import Publish from './Publish'

@connect(
  state => ({
    appItem: state.appItem
  }),
  {
    getAppItem,
    getAppItemFilter
  }
)
@withRouter
class AppItem extends React.Component {
  constructor() {
    super(...arguments)
    const { pathname, search } = this.props.location
    const id = search && pathname === '/appinfo' && queryString.parse(search).id ? queryString.parse(search).id : null
    const openKeys = id ? [`${pathname.split('/')[1]},${id}`] : []
    this.state = {
      openKeys,
      defaultSelectedKeys: openKeys
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleCallback() {
    console.log('handleCallback')
  }

  componentDidMount() {
    // console.log(this.props)
    const { appItem, getAppItem } = this.props
    appItem.source.length === 0 && getAppItem()
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
    const { value } = e.target
    const { getAppItemFilter } = this.props
    getAppItemFilter(value)
  }

  render() {
    const { openKeys, defaultSelectedKeys } = this.state
    const { appItem } = this.props
    return (
      <React.Fragment>
        <div className='side-wrap'>
          <Divider />
          <Input
            className='app-search'
            placeholder='搜索应用'
            prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={appItem.keys}
            onChange={this.handleChange}
          />
          <Publish callback={this.handleCallback} />
        </div>
        <div className='app-item-menu'>
          <Menu
            mode='inline'
            openKeys={openKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onClick={({
              item, key, keyPath, domEvent
            }) => this.gotoAppDetail(
              item, key, keyPath, domEvent
            )}
          >
            {appItem.filter.map(item => (
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
        </div>
      </React.Fragment>
    )
  }
}

export default AppItem
