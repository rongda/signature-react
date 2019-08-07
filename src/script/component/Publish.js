import React from 'react'
import { Button } from 'antd'
import ProtocolItem from '../component/ProtocolItem'
import content from '../static/content'
import AddApp from './AddApp'

class Publish extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      type: null, // ['publishServer', null]
      allow: false
    }
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  scanProtocol(e, type) {
    e.preventDefault()
    this.setState({ type })
  }

  agree(e) {
    this.scanProtocol(e, null)
    this.setState({ allow: true })
  }

  handleCloseModal() {
    this.setState({ allow: false })
  }

  render() {
    const { type, allow } = this.state
    const { callback } = this.props
    return (
      <React.Fragment>
        <Button
          type='primary'
          icon='plus-circle'
          className='add-app'
          onClick={e => this.scanProtocol(e, 'publishServer')}
        >发布应用</Button>
        <ProtocolItem
          type={type}
          footer={(
            <div>
              <Button
                onClick={e => this.scanProtocol(e, null)}
              >不同意</Button>
              <Button
                type='primary'
                onClick={e => this.agree(e)}
              >我同意</Button>
            </div>
          )}
          onCloseModal={e => this.scanProtocol(e, null)}
          content={content.find(item => item.type === type)}
        />
        {allow && <AddApp onCloseModal={this.handleCloseModal} callback={callback} />}
      </React.Fragment>
    )
  }
}

export default Publish
