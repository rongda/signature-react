import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import {
  TABLE_PAGINATION, INIT_PAGINATION
} from '../../static/constant'

/*
 * filter
 * func: get data funtion
 * columns
 */

function PurchaseHistory({ filter, func, columns }) {
  const [pagination, setPagination] = useState({
    ...INIT_PAGINATION,
    total: 0 // 总共条数
  })
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])

  async function getData(pagination) {
    try {
      await setLoading(true)
      let { data } = await func({
        ...pagination,
        id: filter.id === 'all' ? undefined : filter.id,
        begin: filter.time[0],
        end: filter.time[1]
      })
      if (data && data.records) {
        // add rowkey
        data.records = data.records.map((item, index) => ({
          ...item,
          _id: index.toString()
        }))
      }
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
      rowKey={'_id'}
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
