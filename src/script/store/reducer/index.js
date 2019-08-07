import { combineReducers } from 'redux'
import auth from './auth'
import appItem from './appItem'

const reducer = combineReducers({
  auth,
  appItem
})

export default reducer
