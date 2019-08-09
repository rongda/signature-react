import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button, Statistic, Row, Col, Tabs } from 'antd'
import Base from '../../component/Base'
import financial from '../../api/financial'
import TabBarExtra from './TabBarExtra.js'
import FinancialRecord from './FinancialRecord'

const { TabPane } = Tabs
const dateFormat = 'YYYY-MM-DD'
const { getBalance, getPurchaseHistory, getPayHistory } = financial()
const purchaseColumns = [
  {
    title: '日期',
    dataIndex: 'date'
  },
  {
    title: '应用名称',
    dataIndex: 'name'
  },
  {
    title: '下载量',
    dataIndex: 'download'
  },
  {
    title: '消费金额',
    dataIndex: 'amount'
  }
]
const payColumns = [
  {
    title: '订单id',
    dataIndex: 'order_code'
  },
  {
    title: '充值金额',
    dataIndex: 'amount'
  },
  {
    title: '充值方式',
    dataIndex: 'pay_type'
  },
  {
    title: '充值时间',
    dataIndex: 'date'
  }
]

const filterDefault = {
  id: 'all',
  time: [
    moment().startOf('month').format(dateFormat),
    moment().endOf('day').format(dateFormat)
  ]
}

export default function FinancialInfo() {
  const tabBarExtraRef = useRef(null)
  const [balance, setBalance] = useState('0')
  const [filter, setFilter] = useState(filterDefault)
  const [activeKey, setActiveKey] = useState('purchaseHistory')

  useEffect(() => {
    getBalance().then(({ data }) => {
      setBalance(data.balance)
    }).catch(error => console.log(error))
  }, [])

  function handleTabsChange(activeKey) {
    setActiveKey(activeKey)
    setFilter(filterDefault)
    // 重置搜索框
    tabBarExtraRef.current.resetFields()
  }

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
              ref={tabBarExtraRef}
              filterData={filter => setFilter({
                ...filter,
                time: filter.time.map(item => moment(item).format(dateFormat))
              })}
              isShowApp={activeKey === 'purchaseHistory'}
            />
          )}
          onChange={activeKey => handleTabsChange(activeKey)}
        >
          <TabPane tab='消费记录' key='purchaseHistory'>
            <FinancialRecord
              filter={filter}
              columns={purchaseColumns}
              func={getPurchaseHistory}
            />
          </TabPane>
          <TabPane tab='充值记录' key='payHistory'>
            <FinancialRecord
              filter={filter}
              columns={payColumns}
              func={getPayHistory}
            />
          </TabPane>
        </Tabs>
      </div>
    } />
  )
}
