import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button, Statistic, Row, Col, Tabs } from 'antd'
import Base from '../../component/Base'
import financial from '../../api/financial'
import TabBarExtra from './TabBarExtra.js'
import PurchaseHistory from './PurchaseHistory'

const { TabPane } = Tabs
const dateFormat = 'YYYY-MM-DD'
const { getBalance } = financial()

export default class FinancialInfo extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      balance: '0',
      activeKey: 'purchaseHistory',
      filter: {
        id: 'all',
        time: [
          moment().startOf('month').format(dateFormat),
          moment().endOf('day').format(dateFormat)
        ]
      }
    }
    this.handleFilterData = this.handleFilterData.bind(this)
    this.handleTabsChange = this.handleTabsChange.bind(this)
  }

  componentDidMount() {
    getBalance().then(({ data }) => {
      this.setState({ balance: data.balance })
    }).catch(error => console.log(error))
  }

  handleFilterData(filter) {
    this.setState({
      ...filter,
      time: filter.time.map(item => moment(item).format(dateFormat))
    })
  }

  handleTabsChange(activeKey) {
    this.setState({ activeKey })
  }

  render() {
    const { balance, activeKey, filter } = this.state
    console.log('filter', filter)
    return (
      <Base content={
        <div className='financial-info'>
          <div className='bread-crumbs-title'>
            <span>财务信息</span>
            <Link to='/userInfo'>设置</Link>
          </div>
          <div className='main-box'>
            <Row className='financial-info-row'>
              <Col span={12}>
                <Statistic
                  title='账户余额'
                  value={balance}
                  precision={2}
                  suffix='元'
                />
              </Col>
              <Col span={12} style={{ height: '60px' }} >
                <Button type='primary'>充值</Button>
              </Col>
            </Row>
          </div>
          <Tabs
            className='financial-tabs'
            defaultActiveKey='purchaseHistory'
            tabBarExtraContent={(
              <TabBarExtra
                filterData={this.handleFilterData}
                isShowApp={activeKey === 'purchaseHistory'}
              />
            )}
            onChange={this.handleTabsChange}
          >
            <TabPane tab='消费记录' key='purchaseHistory'>
              <PurchaseHistory filter={filter} />
            </TabPane>
            <TabPane tab='充值记录' key='payHistory'>
              充值记录
            </TabPane>
          </Tabs>
        </div>
      } />
    )
  }
}
