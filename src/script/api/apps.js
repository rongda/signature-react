import instance from './instance'

export default () => ({
  // 应用列表
  getAppList() {
    return instance.post('/app/list')
  },
  // 版本记录
  getAppVersionlog(params) {
    return instance.post('/app/statis/versionlog', params)
  },
  // 下载记录
  getDownlog(params) {
    console.log('instance', instance)
    return instance.post('/app/statis/downlog', params)
  },
  // 应用类型
  getAppCategory() {
    return instance.post('/app/category')
  }
})
