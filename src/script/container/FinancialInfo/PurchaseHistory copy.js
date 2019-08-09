import React from 'react'
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

class PurchaseHistory extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      pagination: {
        ...INIT_PAGINATION,
        total: 0 // 总共条数
      },
      loading: false,
      tableData: []
    }
  }

  componentDidMount() {
    // 获取初始化值
    this.getData(INIT_PAGINATION)
  }

  // static getDerivedStateFromProps(props, state) {
  //   console.log(props, state)
  //   return null
  // }

  componentWillReceiveProps(nextProps) {
    this.getData(INIT_PAGINATION)
  }

  async getData(pagination) {
    const { filter } = this.props
    try {
      await this.setState({ loading: true })
      const { data } = await getPurchaseHistory({
        ...pagination,
        id: filter.id === 'all' ? undefined : filter.id,
        begin: filter.time[0],
        end: filter.time[1]
      })
      await this.setState({
        loading: false,
        tableData: data ? data.records : [],
        pagination: {
          ...pagination,
          total: data ? data.total_rows : 0
        }
      })
    } catch (error) {
      console.log(error)
      await this.setState({ loading: false })
    }
  }

  handleTableChange(pagination) {
    const { current: page, pageSize: row } = pagination
    this.getData({ row, page })
  }

  render() {
    const { pagination, loading, tableData } = this.state
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
        onChange={pagination => this.handleTableChange(pagination)}
      />
    )
  }
}

export default PurchaseHistory
