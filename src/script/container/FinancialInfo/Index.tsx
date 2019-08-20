import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button, Statistic, Row, Col, Tabs } from 'antd'
import Base from '../../component/Base'
import financial from '../../api/financial'
import TabBarExtra from './TabBarExtra.js'
import FinancialRecord from './FinancialRecord'
import { PAY_TYPE, DATE_FORMATE } from '../../static/constant'
import IFilterDefault from './IFilterDefault'

const { TabPane } = Tabs
const { getBalance, getPurchaseHistory, getPayHistory } = financial()

const purchaseColumns: Array<{ [propName: string]: any }> = [
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
const payColumns: Array<{ [propName: string]: any }> = [
  {
    title: '订单号',
    dataIndex: 'order_code'
  },
  {
    title: '充值金额',
    dataIndex: 'amount'
  },
  {
    title: '充值方式',
    render: (text, record) => PAY_TYPE[record.pay_type]
  },
  {
    title: '充值时间',
    dataIndex: 'date'
  }
]

const filterDefault: IFilterDefault = {
  id: 'all',
  time: [
    moment().startOf('month').format(DATE_FORMATE),
    moment().endOf('day').format(DATE_FORMATE)
  ]
}

export default function FinancialInfo(): React.ReactElement {
  const tabBarExtraRef = useRef(null)
  const [balance, setBalance] = useState<string>('0')
  const [filter, setFilter] = useState<IFilterDefault>(filterDefault)
  const [activeKey, setActiveKey] = useState<string>('purchaseHistory')

  useEffect(() => {
    getBalance().then(({ data }) => {
      setBalance(data.balance)
    }).catch((error): void => console.log(error))
  }, [])

  function handleTabsChange(activeKey: string): void {
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
                time: filter.time.map(item => moment(item).format(DATE_FORMATE))
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
