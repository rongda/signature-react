import React from 'react'
import { Card, Button, Row, Col, Divider } from 'antd'
import AddApp from '../../component/AddApp'
import overview from '../../api/overview'

const { getAppInfo } = overview()

class Overview extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      allow: false,
      data: null
    }
    this.updateApp = this.updateApp.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }
  componentDidMount() {
    this.getData()
  }
  componentWillReceiveProps(nextProps) {
    const { id } = nextProps
    id !== this.props.id && this.setState({ id }, () => {
      this.getData()
    })
  }
  getData() {
    const { id } = this.props
    getAppInfo({ app_id: id }).then(({ data }) => {
      console.log(data)
      this.setState({ data })
    }).catch(error => console.log(error))
  }
  handleCallback() {
    // 更新应用后的回调 获取当前最新当前数据
    console.log('update handleCallback')
    this.getData()
  }
  updateApp() {
    this.setState({ allow: true })
  }
  handleCloseModal() {
    this.setState({ allow: false })
  }
  render() {
    const { allow, data } = this.state
    return (
      <div className='app-overview'>
        <Card className='no-border'>
          <div className='app-overview-basic'>
            <div className='app-item'>
              <img className='square' src={data && data.app_icon} width='100' />
              <div className='app-item-name-ios'>
                <span>{data && data.app_name}</span>
                <span className='gray'>版本：{data && data.version}</span>
                <span className='gray'>适用于 IOS 设备</span>
              </div>
            </div>
            <Button
              type='primary'
              onClick={this.updateApp}
            >更新应用</Button>
          </div>
          <Row className='app-overview-row'>
            <Col span={4}>
              <div className='app-overview-col-title'>今日下载量</div>
              <div>{data && data.download_count ? data.download_count : '0'}</div>
            </Col>
            <Col span={4}>
              <div className='app-overview-col-title'>总下载量</div>
              <div>{data && data.total_download_count ? data.total_download_count : '0'}</div>
            </Col>
            <Col span={9}>
              <div className='app-overview-col-title'>Bundle ID</div>
              <div>{data && data.app_package}</div>
            </Col>
            <Col span={7}>
              <div className='app-overview-col-title'>下载地址</div>
              <div>{data && data.url}</div>
            </Col>
          </Row>
        </Card>
        <Card>
          <div className='app-overview-total'>
            <Row className='app-overview-row'>
              <Col span={4}>
                <div className='app-overview-day'>今日</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>新增用户</div>
                <div>{data && data.summary.today_new_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>活跃用户</div>
                <div>{data && data.summary.today_new_active_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>启动次数</div>
                <div>{data && data.summary.today_start_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>累计用户</div>
                <div>{data && data.summary.today_all_count}</div>
              </Col>
            </Row>
            <Divider />
            <Row className='app-overview-row'>
              <Col span={4}>
                <div className='app-overview-day yestoday'>昨日</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>新增用户</div>
                <div>{data && data.summary.yesterday_new_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>活跃用户</div>
                <div>{data && data.summary.yesterday_new_active_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>启动次数</div>
                <div>{data && data.summary.yesterday_start_count}</div>
              </Col>
              <Col span={5}>
                <div className='app-overview-col-title'>累计用户</div>
                <div>{data && data.summary.yesterday_all_count}</div>
              </Col>
            </Row>
          </div>
        </Card>
        {allow && <AddApp isUpdate onCloseModal={this.handleCloseModal} callback={this.handleCallback} />}
      </div>
    )
  }
}

export default Overview
