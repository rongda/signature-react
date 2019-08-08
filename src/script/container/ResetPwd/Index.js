import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Row, Col, message, Icon } from 'antd'
import logo from '../../../assets/logo.png'
import permission from '../../api/permission'
import { tryLogout } from '../../store/actions'
import { mobilereg, pwdreg } from '../../utils/reg'
import encrypt from '../../utils/encrypt'

const FormItem = Form.Item
const { captchaSendSms, resetPwd } = permission()
const second = 60

// 正确修改完密码后，退出原有的登录（如果有的话），跳转到登录页面
@connect(
  null,
  {
    tryLogout
  }
)
class ResetPwd extends React.PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      loading: false,
      disabled: false, // 验证码按钮
      buttonValue: '获取验证码',
      confirmDirty: false,
      currentSecond: second
    }
    this.getCode = this.getCode.bind(this)
    this.validateCodeBtn = this.validateCodeBtn.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.source = axios.CancelToken.source()
  }

  validateCodeBtn() {
    this.setState(preState => ({
      disabled: true,
      currentSecond: preState.currentSecond - 1,
      buttonValue: `${preState.currentSecond - 1}s`
    }), () => {
      const { currentSecond } = this.state
      if (currentSecond === 0) {
        clearInterval(this.timer)
        this.setState({
          disabled: false,
          currentSecond: second,
          buttonValue: '获取验证码'
        })
      }
    })
  }

  getCode() {
    // 先验证下username phone格式
    const { validateFields } = this.props.form
    validateFields(['phone'], { force: true }, (err, values) => {
      if (!err) {
        console.log(values)
        captchaSendSms(values.phone).then(res => {
          console.log(res)
          this.validateCodeBtn()
          this.timer = setInterval(this.validateCodeBtn, 1000)
        }).catch(err => {
          console.log(err)
          message.warning(err.err_msg, 1)
          clearInterval(this.timer)
          this.setState({
            disabled: false,
            currentSecond: second,
            buttonValue: '获取验证码'
          })
        })
      }
    })
  }

  componentWillUnmount() {
    this.source.cancel('组件卸载，取消请求')
    this.setState = (state, callback) => null
    clearInterval(this.timer)
  }

  handleSubmit(e) {
    e.preventDefault()
    const { form, tryLogout } = this.props
    form.validateFields(async(err, values) => {
      if (!err) {
        console.log(values)
        const { confirm, ...param } = values
        console.log(confirm, param)
        try {
          await this.setState({ loading: true })
          await resetPwd({
            ...param,
            password: encrypt.encryptFn(param.password)
          })
          message.success('密码修改成功', 1, () => {
            // 退出原有的登录（如果有的话），跳转到登录页面
            tryLogout()
          })
          await this.setState({ loading: false })
        } catch (error) {
          console.log(error)
          message.warning(error.err_msg, 1)
          clearInterval(this.timer)
          await this.setState({
            loading: false,
            disabled: false,
            currentSecond: second,
            buttonValue: '获取验证码'
          })
        }
      }
    })
  }

  handleConfirmBlur(e) {
    const value = e.target.value
    this.setState(preState => ({
      confirmDirty: preState.confirmDirty || !!value
    }))
  }

  checkPassword(rule, value, callback) {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致')
    } else {
      callback()
    }
  }

  checkConfirm(rule, value, callback) {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, disabled, buttonValue } = this.state
    return (
      <div className='login'>
        <div className='login-main'>
          <div className='login-logo'>
            <img
              src={logo}
              width='100'
            />
          </div>
          <Form
            className='login-form resetpwd-form'
            onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入用户名'
                }, {
                  pattern: mobilereg,
                  message: '请正确输入手机号码'
                }],
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  prefix={<Icon type='user' style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,.25)'
                  }} />}
                  placeholder='用户名（手机号码）'
                  autoComplete={'off'}
                />
              )}
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={14}>
                  {getFieldDecorator('code', {
                    rules: [{
                      required: true,
                      message: '请输入验证码'
                    }],
                    validateFirst: true,
                    // validateTrigger: 'onBlur',
                    normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
                  })(
                    <Input
                      prefix={<Icon type='message' style={{
                        fontSize: 16,
                        color: 'rgba(0,0,0,.25)'
                      }} />}
                      placeholder='请输入验证码'
                      autoComplete={'off'}
                    />
                  )}
                </Col>
                <Col span={10}>
                  <Button
                    size='large'
                    type='primary'
                    className='get-code-btn'
                    onClick={this.getCode}
                    disabled={disabled}
                  >{buttonValue}</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: `请输入新密码`
                }, {
                  pattern: pwdreg,
                  message: '请输入6-20位英文数字组合密码'
                }, {
                  validator: this.checkConfirm
                }],
                // validateTrigger: 'onBlur',
                validateFirst: true,
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  prefix={<Icon type='lock' style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,.25)'
                  }} />}
                  type='password'
                  placeholder='请输入新密码'
                  autoComplete={'off'}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true,
                  message: `请再次输入新密码`
                }, {
                  pattern: pwdreg,
                  message: '请输入6-20位英文数字组合密码'
                }, {
                  validator: this.checkPassword
                }],
                // validateTrigger: 'onBlur',
                validateFirst: true,
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  prefix={<Icon type='lock' style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,.25)'
                  }} />}
                  type='password'
                  placeholder='请再次输入新密码'
                  autoComplete={'off'}
                  onBlur={this.handleConfirmBlur}
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                size='large'
                type='primary'
                htmlType='submit'
                loading={loading}
                className='login-form-button'
              >修改密码</Button>
              <div className='account-notice'>
                <span>还未注册？<Link to='/register'>注册</Link></span>
                <span>已有账号？<Link to='/login'>登录</Link></span>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(ResetPwd)
