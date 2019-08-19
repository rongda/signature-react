import * as React from 'react'
import { Tag } from 'antd'
import Base from '../../component/Base'
import TableItem from './TableItem'
import BasicItem from './BasicItem'
import overview from '../../api/overview'
import storage from '../../utils/storage'

const { getAccountInfo } = overview()

interface Props {}
interface State {
  data: {
    balance: string,
    [propName: string]: any
  }
}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      data: null
    }
  }

  componentDidMount(): void {
    storage.getToken() && getAccountInfo().then(({ data }): void => {
      this.setState({ data })
    }).catch((err): void => console.log(err))
  }

  render(): React.ReactElement {
    const { data } = this.state
    return (
      <Base content={
        <div className='home'>
          <div className='bread-crumbs-title'>
            <span>
              账户资料 &nbsp;
              {data && parseFloat(data.balance) <= 0 && (
                <Tag color='red'>余额不足，请充值</Tag>
              )}
            </span>
          </div>
          <div className='main-box'>
            <BasicItem data={data} />
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
