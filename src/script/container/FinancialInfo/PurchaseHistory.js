import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import financial from '../../api/financial'
import {
  TABLE_PAGINATION, INIT_PAGINATION
} from '../../static/constant'

const { getPurchaseHistory } = financial()
const columns = [
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

function PurchaseHistory({ filter }) {
  const [pagination, setPagination] = useState({
    ...INIT_PAGINATION,
    total: 0 // 总共条数
  })
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  // const [prevFilter, setPrevFilter] = useState(null)

  // if (prevFilter !== null && JSON.stringify(filter) !== JSON.stringify(prevFilter)) {
  //   console.log('test')
  //   setPrevFilter(filter)
  // }

  console.log(filter)

  async function getData(pagination) {
    try {
      await setLoading(true)
      const { data } = await getPurchaseHistory({
        ...pagination,
        id: filter.id === 'all' ? undefined : filter.id,
        begin: filter.time[0],
        end: filter.time[1]
      })
      await setLoading(false)
      await setTableData(data ? data.records : [])
      await setPagination({
        ...pagination,
        total: data ? data.total_rows : 0
      })
    } catch (error) {
      console.log(error)
      await setLoading(false)
    }
  }

  useEffect(() => {
    getData(INIT_PAGINATION)
  }, [filter])

  return (
    <Table
      rowKey={'id'}
      loading={loading}
      columns={columns}
      scroll={{ x: 800 }}
      dataSource={tableData}
      className='home-appitem-table'
      pagination={{
        current: pagination.page,
        pageSize: pagination.row,
        pageSizeOptions: TABLE_PAGINATION,
        showQuickJumper: true,
        showSizeChanger: true,
        total: pagination.total
      }}
      onChange={({
        current: page,
        pageSize: row
      }) => getData({ row, page })}
    />
  )
}

export default PurchaseHistory
