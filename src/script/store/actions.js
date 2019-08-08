/* eslint camelcase: 0 */
import { message } from 'antd'
import storage from '../utils/storage'
import encrypt from '../utils/encrypt'
import permission from '../api/permission'
import apps from '../api/apps'
import {
  LOGIN_SUCCESS, LOGOUT_SUCCESS,
  APPITEM_SUCCESS, APPITEM_FILTER_SUCCESS
} from './type'

const { getAppList } = apps()
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
      // window.location.href = '/index'
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

// app item
const getAppItemSuccess = data => ({
  type: APPITEM_SUCCESS,
  payload: data
})

// app item filter
const getAppItemFilterSuccess = data => ({
  type: APPITEM_FILTER_SUCCESS,
  payload: data
})

const getAppItem = () => async dispatch => {
  try {
    const { data } = await getAppList()
    data && dispatch(getAppItemSuccess({
      keys: '',
      filter: data,
      source: data
    }))
  } catch (error) {
    console.log('error', error)
    message.warning(error.err_msg, 1)
  }
}

const getAppItemFilter = value => async(dispatch, getState) => {
  const { source } = getState().appItem
  dispatch(getAppItemFilterSuccess({
    source,
    keys: value,
    filter: source.filter(item => item.name.indexOf(value) > -1)
  }))
}

export {
  tryLogin,
  tryLogout,
  loginSuccess,
  getAppItem,
  getAppItemFilter
}
