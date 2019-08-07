import React from 'react'
import { Link } from 'react-router-dom'
import Base from '../../component/Base'

export default class FinancialInfo extends React.Component {
  render() {
    return (
      <Base content={
        <div className='financial-info'>
          <div className='bread-crumbs-title'>
            <span>财务信息</span>
            <Link to='/userInfo'>设置</Link>
          </div>
          <div className='main-box'>FinancialInfo</div>
        </div>
      } />
    )
  }
}
