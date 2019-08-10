import React from 'react'
import { Table, Switch, Button, message } from 'antd'
import overview from '../../api/overview'
import apps from '../../api/apps'
import ModifyApp from '../../component/ModifyApp'
import {
  TABLE_PAGINATION, INIT_PAGINATION
} from '../../static/constant'

const { getOverviewApps } = overview()
const { updateStatus } = apps()

export default class Tableitem extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      pagination: {
        ...INIT_PAGINATION,
        total: 0 // 总共条数
      },
      loading: false,
      tableData: [],
      allow: false,
      code: null
    }
    this.modifyApp = this.modifyApp.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  modifyApp(code) {
    this.setState({ allow: true, code })
  }

  componentDidMount() {
    // 获取初始化值
    this.getData(INIT_PAGINATION)
  }

  async getData(pagination) {
    try {
      await this.setState({ loading: true })
      const { data } = await getOverviewApps(pagination)
      await this.setState({
        loading: false,
        tableData: data ? data.apps : [],
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

  handleStatus(record) {
    console.log(record)
    updateStatus(
      record.id,
      record.status === 0 ? 1 : 0
    ).then(res => {
      message.success('更新成功', 1, () => {
        this.setState(preState => ({
          tableData: preState.tableData.map(
            item => item.id === record.id ? {
              ...item,
              status: item.status === 0 ? 1 : 0
            } : item
          )
        }))
      })
    }).catch(error => {
      console.log(error)
      message.error(error.err_msg)
    })
  }

  handleTableChange(pagination) {
    const { current: page, pageSize: row } = pagination
    this.getData({ row, page })
  }

  handleCloseModal() {
    this.setState({ allow: false })
  }

  render() {
    const { pagination, loading, tableData, allow, code } = this.state
    const columns = [
      {
        title: '应用名称',
        key: 'name',
        render: (text, record) => (
          <div className='app-item'>
            <img src={record.icon_url} width='35' />
            <div className='app-item-name-ios'>
              <span>{record.name}</span>
              <span>iOS</span>
            </div>
          </div>
        )
      },
      {
        title: '版本',
        dataIndex: 'version'
      },
      {
        title: '下载地址',
        dataIndex: 'download_url'
      },
      {
        title: '创建时间',
        dataIndex: 'create_at'
      },
      {
        title: '上架状态',
        key: 'status',
        render: (text, record) => (
          <Switch
            checked={record.status !== 0}
            onChange={this.handleStatus.bind(this, record)}
          />
        )
      },
      {
        title: '操作',
        fixed: 'right',
        width: 120,
        render: (text, record, index) => (
          <Button
            type='primary'
            onClick={this.modifyApp.bind(this, record.code)}
          >修改</Button>
        )
      }
    ]

    return (
      <React.Fragment>
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
        {allow && (
          <ModifyApp
            code={code}
            onCloseModal={this.handleCloseModal}
            callback={() => this.getData(pagination)}
          />
        )}
      </React.Fragment>
    )
  }
}
