import React, { useState } from 'react'
import { Modal } from 'antd'

function ProtocolItem(props) {
  const { type, onCloseModal, content } = props
  const [visible] = useState(true)

  return (
    type && <Modal
      centered
      width={700}
      footer={null}
      visible={visible}
      onCancel={onCloseModal}
      title={content && content.title}
      wrapClassName='modal-max-scroll'
    >
      {content && content.main}
    </Modal>
  )
}

export default ProtocolItem
