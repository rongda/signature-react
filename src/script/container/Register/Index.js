import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Row, Col, message, Icon, Checkbox } from 'antd'
import logo from '../../../assets/logo.png'
import permission from '../../api/permission'
import { tryLogout } from '../../store/actions'
import { mobilereg, pwdreg } from '../../utils/reg'
import ProtocolItem from '../../component/ProtocolItem'
import content from '../../static/content'

const FormItem = Form.Item
const { captchaSendSms, userRegister } = permission()
const second = 60

// 正确修改完密码后，退出原有的登录（如果有的话），跳转到登录页面
@connect(
  null,
  {
    tryLogout
  }
)
class Register extends React.PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      loading: false,
      disabled: false, // 验证码按钮
      buttonValue: '获取验证码',
      currentSecond: second,
      type: null // ['server', 'privacy', null]
    }
    this.getCode = this.getCode.bind(this)
    this.validateCodeBtn = this.validateCodeBtn.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  scanProtocol(e, type) {
    e.preventDefault()
    this.setState({ type })
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
          await userRegister(param)
          message.success('成功注册，请登录', 1, () => {
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

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, disabled, buttonValue, type } = this.state
    return (
      <div className='login'>
        <div className='login-main'>
          <div className='login-logo'>
            <img src={logo} width='100' />
          </div>
          <Form
            className='login-form resetpwd-form'
            onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入手机号码'
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
                  placeholder='手机号码'
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
                  message: `请输入密码`
                }, {
                  pattern: pwdreg,
                  message: '请输入6-20位英文数字组合密码'
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
                  placeholder='请输入密码'
                  autoComplete={'off'}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('protocol', {
                initialValue: false,
                valuePropName: 'checked',
                rules: [{
                  required: true,
                  transform: value => (value || undefined),
                  type: 'boolean',
                  message: '请阅读并同意'
                }]
              })(
                <Checkbox className='protocol'>
                  已同意并愿意接受
                  <span
                    className='protocol-item'
                    onClick={e => this.scanProtocol(e, 'server')}
                  >《超级签名服务条款》</span>和
                  <span
                    className='protocol-item'
                    onClick={e => this.scanProtocol(e, 'privacy')}
                  >《超级签名隐私声明》</span>
                </Checkbox>
              )}
            </FormItem>
            <FormItem>
              <Button
                size='large'
                type='primary'
                htmlType='submit'
                loading={loading}
                className='login-form-button'
              >注册</Button>
              <div className='account-notice'>
                <span>忘记密码？<Link to='/resetpwd'>修改密码</Link></span>
                <span>已有账号？<Link to='/login'>登录</Link></span>
              </div>
            </FormItem>
          </Form>
          <ProtocolItem
            type={type}
            onCloseModal={e => this.scanProtocol(e, null)}
            content={content.find(item => item.type === type)}
          />
        </div>
      </div>
    )
  }
}
export default Form.create()(Register)
