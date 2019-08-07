import instance from './instance'

export default () => ({
  // 获取进度，并解析
  getUploadProcess(id) {
    return instance.post('/app/upload/process', { id })
  },
  // 获取解析后的app详情
  getUploadInfo(code) {
    return instance.post('/app/upload/getinfo', { code })
  },
  // 提交应用/更新应用
  uploadSubmit(params) {
    return instance.post('/app/upload/submit', params)
  }
})
