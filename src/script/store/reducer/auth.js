import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../type.js'

const auth = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return action.payload
    case LOGOUT_SUCCESS:
      return {}
    default:
      return state
  }
}

export default auth
