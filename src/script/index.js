import 'babel-polyfill'
import React from 'react'
import thunk from 'redux-thunk'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import reducer from './store/reducer/'
import RouterConfig from './router'

const store = process.env.NODE_ENV !== 'development' ? createStore(
  reducer,
  compose(applyMiddleware(thunk))
) : createStore(reducer, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
))

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <RouterConfig />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
)
