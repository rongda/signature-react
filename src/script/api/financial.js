import instance from './instance'

export default () => ({
  // 充值记录
  getPayHistory(params) {
    return instance.post('/app/statistics/payHistory', params)
  },
  // 消费记录
  getPurchaseHistory(params) {
    return instance.post('/app/statistics/purchaseHistory', params)
  },
  // 账务余额
  getBalance() {
    return instance.post('/app/wallet/balance')
  }
})
