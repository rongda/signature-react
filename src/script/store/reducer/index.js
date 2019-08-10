import { combineReducers } from 'redux'
import auth from './auth'
import appItem from './appItem'
import publish from './publish'

const reducer = combineReducers({
  auth,
  appItem,
  publish
})

export default reducer
