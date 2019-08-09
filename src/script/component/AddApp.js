import React from 'react'
import { connect } from 'react-redux'
import { Modal, Steps, Button, Upload, Progress, Spin, message } from 'antd'
import storage from '../utils/storage'
import upload from '../api/upload'
import AddAppForm from './AddAppForm'
import { getAppItem, getAppItemFilter } from '../store/actions'

const { getUploadProcess, getUploadInfo, uploadSubmit } = upload()
const { Step } = Steps

@connect(
  state => ({
    appItem: state.appItem
  }),
  {
    getAppItem,
    getAppItemFilter
  }
)
class AddApp extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      percent: 0,
      current: 0,
      code: null,
      info: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  async getBaseAppItem() {
    const { getAppItem, getAppItemFilter, appItem } = this.props
    await getAppItem()
    await getAppItemFilter(appItem.keys)
  }

  async twoSteps(id) {
    clearTimeout(this.timer)
    try {
      const { data } = await getUploadProcess(id)
      await this.setState({
        code: data.code,
        current: 2
      })
      await this.threeSteps()
    } catch (error) {
      console.log(error)
    }
  }

  threeSteps() {
    const { code } = this.state
    getUploadInfo(code).then(
      ({ data: info }) => {
        this.setState({ info })
      }
    ).catch(error => console.log(error))
  }

  analysis(info) {
    console.log(info)
    const { status, percent, response } = info.file
    switch (status) {
      case 'uploading':
        this.setState({ percent: Math.floor(percent) })
        break
      case 'done':
        this.setState({
          current: 1
        }, () => {
          // 去解析，获得code
          // 跳转到第三步骤
          if (response.err_code !== 200) {
            message.error(response.err_msg)
            this.setState({ percent: 0, current: 0 })
          } else {
            this.timer = setTimeout(() => {
              this.twoSteps(response.data.id)
            }, 5000)
          }
        })
        break
      default:
        break
    }
  }

  handleSubmit(values) {
    const { code } = this.state
    const { isUpdate } = this.props
    console.log({
      ...values,
      code
    })
    uploadSubmit({
      ...values,
      code
    }).then(res => {
      message.success(`${isUpdate ? '更新' : '发布'}成功`, 1, () => {
        // Base列表重新获取数据
        const { callback } = this.props
        callback && callback()
        this.getBaseAppItem()
      })
      this.props.onCloseModal()
    }).catch(error => {
      console.log(error)
      message.error(error.err_msg)
    })
  }

  renderContent() {
    const { current, percent, info } = this.state
    const { onCloseModal, isUpdate } = this.props
    let main = null
    switch (current) {
      case 0:
        main = (
          <div className='add-app-content'>
            <div style={percent > 0 ? { display: 'none' } : {}}>
              <p>上传ipa提示：</p>
              <ul>
                <li>ipa包里要有codesign文件，如果没有可以由我们技术签名后上传；</li>
                <li>ipa包里必须要有embedded.mobileprovision，确保权限完整；</li>
                <li>ipa包里确保info.plist里的bundleid与二进制执行文件中的bundleid一致；</li>
                <li>ipa包最好是没有被其他机构重签过的包，不然可能会导致应用闪退；</li>
                <li>ipa包包含有第三方服务且服务与bundleid有关联的，请选择证书推送（如第三方登录和地图等）；</li>
              </ul>
              <div className='add-app-upload'>
                <Upload
                  accept='.ipa'
                  name='file'
                  action={`${process.env.api}/app/upload/ipa`}
                  headers={{
                    'token': storage.getToken()
                  }}
                  onChange={info => this.analysis(info)}
                >
                  <Button type='primary' size='large'>重新上传</Button>
                </Upload>
              </div>
              <div className='add-app-notice'>
                <p>点击按钮选择应用的安装包</p>
                <p>(支持IPA文件，单个文件最大支持2GB)</p>
              </div>
            </div>
            {percent > 0 && (
              <React.Fragment>
                <p style={{ textAlign: 'center' }}>应用正在上传，请不要关闭页面</p>
                <Progress percent={percent} status='active' />
                <div className='add-app-upload'>
                  <Button type='primary' size='large' onClick={onCloseModal}>取消上传</Button>
                </div>
              </React.Fragment>
            )}
          </div>
        )
        break
      case 1:
        main = (
          <div className='add-app-content' style={{ textAlign: 'center' }}>
            <Spin style={{
              padding: '40px 0'
            }} tip='正在解析，请稍等' />
          </div>
        )
        break
      case 2:
        // 获取详情
        main = (
          <div className='add-app-content'>
            <AddAppForm
              isUpdate={isUpdate}
              info={info}
              onSubmit={this.handleSubmit}
            />
          </div>
        )
        break
      default:
        break
    }
    return main
  }

  render() {
    const { current } = this.state
    const { onCloseModal, isUpdate } = this.props
    return (
      <Modal
        visible
        centered
        width={700}
        footer={null}
        maskClosable={false}
        title={isUpdate ? '更新应用' : '新增应用'}
        onCancel={onCloseModal}
        wrapClassName='modal-max-scroll'
      >
        <Steps className='add-app-steps' current={current}>
          <Step title='上传应用' />
          <Step title='解析' />
          <Step title='填写信息' />
        </Steps>
        {this.renderContent()}
      </Modal>
    )
  }
}

export default AddApp
