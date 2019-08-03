import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { Form, Icon, Input, Button } from 'antd'
import logo from '../../../assets/logo.png'
import { tryLogin, loginSuccess } from '../../store/actions'
import storage from '../../utils/storage'
import { pwdreg } from '../../utils/reg'

const FormItem = Form.Item

@connect(
  state => ({
    auth: state.auth
  }),
  {
    tryLogin,
    loginSuccess
  }
)
class Login extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      loading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.source = axios.CancelToken.source()
  }

  componentDidMount() {
    // 登录成功
    storage.getToken() && this.props.loginSuccess({
      token: storage.getToken(),
      ...storage.getUserName()
    })
  }

  componentWillUnmount() {
    this.source.cancel('组件卸载，取消请求')
    this.setState = (state, callback) => null
  }

  handleSubmit(e) {
    e.preventDefault()
    const { form, tryLogin } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true }, () => {
          console.log(values)
          tryLogin({
            ...values,
            user_type: '2000'
          })
          this.setState({ loading: false })
        })
      }
    })
  }

  render() {
    const { auth, form } = this.props
    const { getFieldDecorator } = form
    const { loading } = this.state
    return auth.token ? <Redirect to='/' /> : (
      <div className='login'>
        <div className='login-main'>
          <div className='login-logo'>
            <img src={logo} width='100' />
          </div>
          <Form
            className='login-form'
            onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: '请正确输入用户名'
                }],
                // validateTrigger: 'onBlur',
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  prefix={<Icon type='user' style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,.25)'
                  }} />}
                  placeholder='用户名'
                  autoComplete={'off'}
                />
              )}
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
                validateFirst: true,
                // validateTrigger: 'onBlur',
                normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
              })(
                <Input
                  prefix={<Icon type='lock' style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,.25)'
                  }} />}
                  type='password'
                  placeholder='密码'
                  autoComplete={'off'}
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
              >登录</Button>
              <div className='account-notice'>
                <span>还未注册？<Link to='/register'>注册</Link></span>
                <span>忘记密码？<Link to='/resetpwd'>修改密码</Link></span>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Login)
