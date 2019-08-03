/* eslint camelcase: 0 */
import { message } from 'antd'
import storage from '../utils/storage'
import encrypt from '../utils/encrypt'
import permission from '../api/permission'
import {
  LOGIN_SUCCESS, LOGOUT_SUCCESS
} from './type'

const { login, logout } = permission()

// action
// login
const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  payload: data
})

const tryLogin = (params, errorCallBack) => async dispatch => {
  try {
    params.password = encrypt.encryptFn(params.password)
    const resLogin = await login(params)
    message.success('登录成功', 1, () => {
      // storage && redux
      const token = resLogin.data
      storage.set(token)
      dispatch(loginSuccess(token))
    })
  } catch (error) {
    console.log('error', error)
    message.warning(error.err_msg, 1)
    errorCallBack && errorCallBack()
  }
}

// logout
const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
})

const tryLogout = () => async dispatch => {
  try {
    await logout()
    storage.remove()
    dispatch(logoutSuccess())
    window.location.href = '/login'
  } catch (error) {
    console.log(error)
  }
}

export {
  tryLogin,
  tryLogout,
  loginSuccess
}
