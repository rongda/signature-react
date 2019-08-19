import * as React from 'react'
import { Modal } from 'antd'

const { useState } = React

interface Content {
  title: string,
  main: React.ReactNode
}

interface Props {
  type: string | null, // 'publishServer', null
  onCloseModal: any,
  content: Content,
  footer: React.ReactNode
}

function ProtocolItem({
  type,
  onCloseModal,
  content,
  footer
}: Props): any {
  const [visible] = useState<boolean>(true)
  return (
    type && <Modal
      centered
      width={700}
      footer={footer || null}
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
