import instance from './instance'

export default () => ({
  // 常用应用
  getOverviewApps(params) {
    return instance.post('/app/overview/apps', params)
  },
  // 账号信息
  getAccountInfo() {
    return instance.post('/app/overview/accountInfo')
  }
})
