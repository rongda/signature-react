import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Tooltip, Icon, Input, Form, Button, message, Spin } from 'antd'
import Base from '../../component/Base'
import { emailreg } from '../../utils/reg'
import permission from '../../api/permission'

const { bindingEmail, userInfo } = permission()
const FormItem = Form.Item

class BaseInfo extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      btnValue: '绑定邮箱',
      isEdit: false,
      data: null
    }
    this.inputRef = React.createRef()
    this.bindEmail = this.bindEmail.bind(this)
  }

  componentDidMount() {
    userInfo().then(({ data }) => {
      this.setState({ data })
    }).catch(err => console.log(err))
  }

  bindEmail(e) {
    e.preventDefault()
    const { btnValue } = this.state
    if (btnValue === '绑定邮箱') {
      this.inputRef.current.focus()
      this.setState({
        btnValue: '确认',
        isEdit: true
      })
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          bindingEmail(values).then(res => {
            message.success('成功绑定邮箱')
            this.setState({
              btnValue: '绑定邮箱',
              isEdit: false
            })
          }).catch(error => console.log(error))
        }
      })
    }
  }

  render() {
    const { btnValue, isEdit, data } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Base content={
        <div className='base-info'>
          <div className='bread-crumbs-title'>
            <span>基本信息</span>
            <Link to='/userInfo'>设置</Link>
          </div>
          <Spin tip='Loading...' spinning={data === null}>
            <div className='main-box'>
              <Row className='base-info-item'>
                <Col span={6}>用户名</Col>
                <Col span={16}>{data && data.user_name}</Col>
              </Row>
              <Row className='base-info-item'>
                <Col span={6}>邮箱</Col>
                <Col span={16}>
                  <Form layout='inline' onSubmit={this.bindEmail}>
                    <FormItem className='email'>
                      {getFieldDecorator('email', {
                        initialValue: data ? data.email : '',
                        normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value, // 禁止输入空格
                        rules: [{
                          required: true, message: '请输入邮箱'
                        }, {
                          pattern: emailreg, message: '请正确输入邮箱'
                        }]
                      })(
                        <Input
                          ref={this.inputRef}
                          disabled={!isEdit}
                          placeholder={'请输入邮箱'}
                        />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button
                        htmlType='submit'
                        style={{ cursor: 'pointer' }}
                      >{btnValue}</Button>
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <Row className='base-info-item'>
                <Col span={6}>手机号</Col>
                <Col span={16}>{data && data.phone}</Col>
              </Row>
              <Row className='base-info-item'>
                <Col span={6}>信用额度</Col>
                <Col span={16}>
                  {data && data.credit_line ? data.credit_line : '无'}&nbsp;
                  <Tooltip placement='bottom' title={'当您余额不足时，可在信用额度范围内继续消费，保持您应用的上架状态。如需提高额度，请联系您的代理商。'}>
                    <Icon type='question-circle' />
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </Spin>
        </div>
      } />
    )
  }
}

export default Form.create()(BaseInfo)
