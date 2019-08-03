import { token } from '../config'

export default {
  get() {
    return localStorage.getItem(token)
  },
  getToken() {
    if (this.get()) {
      const { token } = JSON.parse(this.get())
      return token
    }
    return null
  },
  getIsDefaultPwd() {
    if (this.get()) {
      const isDefaultPwd = JSON.parse(this.get()).def_pwd
      return isDefaultPwd
    }
    return null
  },
  getUserName() {
    if (this.get()) {
      const { name, phone } = JSON.parse(this.get())
      return { name, phone }
    }
    return null
  },
  remove() {
    let value = this.get()
    localStorage.removeItem(token)
    return value
  },
  set(value) {
    localStorage.setItem(token, JSON.stringify(value))
  }
}
