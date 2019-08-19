import * as React from 'react'
import { Button } from 'antd'
import ProtocolItem from './ProtocolItem'
import content from '../static/content'
import AddApp from './AddApp'

const { useState } = React

type StringOrNull = string | null
interface Props {
  callback: Function
}

function Publish({
  callback
}: Props): any {
  const [type, setType] = useState<StringOrNull>(null)
  const [allow, setAllow] = useState<boolean>(false)

  function scanProtocol(e: React.MouseEvent, type: string | null): void {
    e.preventDefault()
    setType(type)
  }

  function agree(e: React.MouseEvent): void {
    scanProtocol(e, null)
    setAllow(true)
  }
  return (
    <React.Fragment>
      <Button
        type='primary'
        icon='plus-circle'
        className='add-app'
        onClick={e => scanProtocol(e, 'publishServer')}
      >发布应用</Button>
      <ProtocolItem
        type={type}
        footer={(
          <div>
            <Button
              onClick={e => scanProtocol(e, null)}
            >不同意</Button>
            <Button
              type='primary'
              onClick={e => agree(e)}
            >我同意</Button>
          </div>
        )}
        onCloseModal={e => scanProtocol(e, null)}
        content={content.find(item => item.type === type)}
      />
      {allow && <AddApp onCloseModal={() => setAllow(false)} callback={callback} />}
    </React.Fragment>
  )
}

export default Publish
