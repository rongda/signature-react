import { APPITEM_SUCCESS, APPITEM_FILTER_SUCCESS } from '../type.js'

const appItem = (state = {
  keys: '',
  filter: [],
  source: []
}, action) => {
  switch (action.type) {
    case APPITEM_SUCCESS:
      return {
        ...action.payload
      }
    case APPITEM_FILTER_SUCCESS:
      return {
        ...action.payload
      }
    default:
      return state
  }
}

export default appItem
