import React from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Row, Col, message } from 'antd'
import Base from '../../component/Base'
import { pwdreg } from '../../utils/reg'
import permission from '../../api/permission'

const { changePwd } = permission()
const FormItem = Form.Item
const labelCol = { span: 3 }
const wrapperCol = { span: 8 }
const formItemLayout = {
  labelCol,
  wrapperCol
}

class UserPass extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      confirmDirty: false,
      loading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values)
        this.setState({
          loading: true
        }, () => {
          changePwd(values).then(res => {
            message.success('修改密码成功', 1, () => {
              this.setState({ loading: false })
              this.props.form.resetFields()
            })
          }).catch(err => {
            console.log(err)
            this.setState({ loading: false })
          })
        })
      }
    })
  }

  handleConfirmBlur(e) {
    const value = e.target.value
    this.setState(preState => ({
      confirmDirty: preState.confirmDirty || !!value
    }))
  }

  checkConfirm(rule, value, callback) {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['new_password'], { force: true })
    }
    callback()
  }

  checkPassword(rule, value, callback) {
    const { form } = this.props
    if (value && value === form.getFieldValue('old_password')) {
      callback('新旧密码一致')
    } else {
      callback()
    }
  }

  render() {
    const { loading } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Base content={
        <div className='user-pass'>
          <div className='bread-crumbs-title'>
            <span>修改密码</span>
            <Link to='/userInfo'>设置</Link>
          </div>
          <Form className='main-box' onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={'账户密码'}
            >
              {getFieldDecorator('old_password', {
                rules: [{
                  required: true,
                  message: `请输入旧密码`
                }, {
                  pattern: pwdreg,
                  message: '请输入6-20位英文数字组合密码'
                }, {
                  validator: this.checkConfirm
                }],
                validateFirst: true,
                // validateTrigger: 'onBlur',
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  type='password'
                  placeholder='请输入旧密码'
                  autoComplete={'off'}
                  size={'large'}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'新的密码'}
            >
              {getFieldDecorator('new_password', {
                rules: [{
                  required: true,
                  message: `请输入新密码`
                }, {
                  pattern: pwdreg,
                  message: '请输入6-20位英文数字组合密码'
                }, {
                  validator: this.checkPassword
                }],
                validateFirst: true,
                // validateTrigger: 'onBlur',
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  type='password'
                  placeholder='请输入新密码'
                  autoComplete={'off'}
                  size={'large'}
                  onBlur={this.handleConfirmBlur}
                />
              )}
            </FormItem>
            <Row>
              <Col {...labelCol} />
              <Col {...wrapperCol}>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={loading}
                >确定</Button>
              </Col>
            </Row>
          </Form>
        </div>
      } />
    )
  }
}

export default Form.create()(UserPass)
