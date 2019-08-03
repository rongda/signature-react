import Home from '../container/Home/Index'
import Login from '../container/Login/Index'
import Register from '../container/Register/Index'
import ResetPwd from '../container/ResetPwd/Index'
import UserInfo from '../container/UserInfo/Index'
import Statistics from '../container/Statistics/Index'
import AppInfo from '../container/AppInfo/Index'
import BaseInfo from '../container/BaseInfo/Index'
import UserPass from '../container/UserPass/Index'
import FinancialInfo from '../container/FinancialInfo/Index'
import Notification from '../container/Notification/Index'

// base routers
const base = [
  {
    path: '/index',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/resetpwd',
    component: ResetPwd
  },
  {
    path: '/userInfo',
    component: UserInfo
  },
  {
    path: '/statistics',
    component: Statistics
  },
  {
    path: '/appinfo',
    component: AppInfo
  },
  {
    path: '/baseinfo',
    component: BaseInfo
  },
  {
    path: '/userpass',
    component: UserPass
  },
  {
    path: '/financialinfo',
    component: FinancialInfo
  },
  {
    path: '/notification',
    component: Notification
  }
]
export default base
