import React from 'react'
import { Tabs } from 'antd'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'
import Base from '../../component/Base'
import AppVersion from './AppVersion'
import Downlog from './Downlog'
import Overview from './Overview'

const { TabPane } = Tabs

export default class AppInfo extends React.Component {
  constructor() {
    super(...arguments)
    const { search } = this.props.location
    this.state = {
      id: queryString.parse(search).id,
      key: 'overview'
    }
    this.handleKeyChange = this.handleKeyChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { search } = nextProps.location
    search !== this.props.location.search && this.setState({
      id: queryString.parse(search).id,
      key: 'overview'
    })
  }

  handleKeyChange(key) {
    this.setState({ key })
  }

  render() {
    const { id, key } = this.state
    return id !== undefined ? (
      <Base content={
        <div className='app-info'>
          <div className='bread-crumbs-title'>
            <span>签约宝</span>
          </div>
          <Tabs activeKey={key} onChange={this.handleKeyChange}>
            <TabPane tab={`应用概述`} key='overview'>
              <Overview id={id} />
            </TabPane>
            <TabPane tab={`统计`} key='2' disabled>
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab='下载记录' key='Downlog'>
              <Downlog id={id} />
            </TabPane>
            <TabPane tab={`启动记录`} key='3' disabled>
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab='版本记录' key='AppVersion' disabled>
              <AppVersion id={id} />
            </TabPane>
            <TabPane tab={`渠道`} key='4' disabled>
              Content of Tab Pane 4
            </TabPane>
            {/* <TabPane tab={`消息推送`} key='5' disabled>
              Content of Tab Pane 5
            </TabPane>
            <TabPane tab={`应用合并`} key='6' disabled>
              Content of Tab Pane 6
            </TabPane>
            <TabPane tab={`反作弊`} key='7' disabled>
              Content of Tab Pane 7
            </TabPane>
            <TabPane tab={`设置`} key='8' disabled>
              Content of Tab Pane 8
            </TabPane> */}
          </Tabs>
        </div>
      } />
    ) : <Redirect to='/index' />
  }
}
