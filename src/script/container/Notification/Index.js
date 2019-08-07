import React from 'react'
import { Link } from 'react-router-dom'
import Base from '../../component/Base'

export default class Notification extends React.Component {
  render() {
    return (
      <Base content={
        <div className='notification-info'>
          <div className='bread-crumbs-title'>
            <span>通知设置</span>
            <Link to='/userInfo'>设置</Link>
          </div>
          <div className='main-box'>Notification</div>
        </div>
      } />
    )
  }
}
