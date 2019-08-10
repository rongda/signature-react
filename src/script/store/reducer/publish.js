import { PUBLISH_SUCCESS, UN_PUBLISH } from '../type.js'

const publish = (state = false, action) => {
  switch (action.type) {
    case PUBLISH_SUCCESS:
      return true
    case UN_PUBLISH:
      return false
    default:
      return state
  }
}

export default publish
