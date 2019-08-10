import React from 'react'
import { Modal, message } from 'antd'
import AddAppForm from './AddAppForm'
import upload from '../api/upload'

const { getUploadInfo, uploadSubmit } = upload()

class ModifyApp extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      info: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // code 获取 信息
    const { code } = this.props
    getUploadInfo(code).then(
      ({ data: info }) => {
        this.setState({ info })
      }
    ).catch(error => console.log(error))
  }

  handleSubmit(values) {
    const { code, onCloseModal, callback } = this.props
    console.log({
      ...values,
      code
    })
    uploadSubmit({
      ...values,
      code
    }).then(res => {
      message.success('修改成功', 1, () => {
        callback()
      })
      onCloseModal()
    }).catch(error => {
      message.error(error.err_msg)
      console.log(error)
    })
  }

  render() {
    const { onCloseModal } = this.props
    const { info } = this.state
    return (
      <Modal
        visible
        centered
        width={700}
        footer={null}
        title={'修改应用'}
        maskClosable={false}
        onCancel={onCloseModal}
        wrapClassName='modal-max-scroll'
      >
        <div className='add-app-content'>
          <AddAppForm
            isModify
            info={info}
            onSubmit={this.handleSubmit}
          />
        </div>
      </Modal>
    )
  }
}

export default ModifyApp
