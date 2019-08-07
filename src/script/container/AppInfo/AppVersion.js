import React from 'react'
import { Table } from 'antd'
import apps from '../../api/apps'
import {
  TABLE_PAGINATION, INIT_PAGINATION
} from '../../static/constant'

const { getAppVersionlog } = apps()

export default class AppVersion extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      pagination: {
        ...INIT_PAGINATION,
        total: 0 // 总共条数
      },
      loading: false,
      tableData: [],
      id: undefined
    }
  }

  componentDidMount() {
    // 获取初始化值
    this.getData(INIT_PAGINATION)
  }

  async getData(pagination) {
    const { id } = this.state
    try {
      await this.setState({ loading: true })
      const { data } = await getAppVersionlog({
        app_id: id,
        ...pagination
      })
      await this.setState({
        loading: false,
        tableData: data ? data.rows : [],
        pagination: {
          ...pagination,
          total: data ? data.total : 0
        }
      })
    } catch (error) {
      console.log(error)
      await this.setState({ loading: false })
    }
  }

  handleTableChange(pagination) {
    const { current: page, pageSize: size } = pagination
    this.getData({ size, page })
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps
    id !== this.props.id && this.setState({ id }, () => {
      this.getData(INIT_PAGINATION)
    })
  }
  render() {
    const { pagination, loading, tableData } = this.state
    const columns = [
      {
        title: '版本',
        dataIndex: 'version'
      },
      {
        title: '大小',
        dataIndex: 'size'
      },
      {
        title: '下载次数',
        dataIndex: 'download_count'
      },
      {
        title: '更新时间',
        dataIndex: 'time'
      }
    ]

    return (
      <Table
        rowKey={'id'}
        loading={loading}
        columns={columns}
        scroll={{ x: 800 }}
        dataSource={tableData}
        className='home-appitem-table app-versions'
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
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
