import React from 'react'
import Base from '../../component/Base'
import TableItem from './TableItem'
import BasicItem from './BasicItem'

export default class Home extends React.Component {
  render() {
    return (
      <Base content={
        <div className='home'>
          <div className='bread-crumbs-title'>
            账户资料
          </div>
          <div className='main-box'>
            <BasicItem />
          </div>
          <div className='bread-crumbs-title'>
            常用应用
          </div>
          <div className='main-box'>
            <TableItem />
          </div>
        </div>
      } />
    )
  }
}
