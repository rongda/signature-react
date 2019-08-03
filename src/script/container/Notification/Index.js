import React from 'react'
import Base from '../../component/Base'

export default class Notification extends React.Component {
  render() {
    return (
      <Base content={
        <div className='notification-info'>
          Notification
        </div>
      } />
    )
  }
}
