import { AES, mode, pad, MD5 } from 'crypto-js'
import { parse } from 'crypto-js/enc-latin1'
import { encryptKey, encryptIv } from '../config'
import storage from './storage'
import _ from 'lodash'

export default {
  encryptFn(plainText) {
    return AES.encrypt(plainText, parse(encryptKey), {
      iv: parse(encryptIv),
      mode: mode.CBC,
      padding: pad.Pkcs7
    }).toString()
  },
  urlEncode(url, companyType = 1) {
    return url + '?token=' + encodeURIComponent(storage.getToken()) + '&company_type=' + companyType
  },
  // 将请求参数构造加密 返回object
  paramsEncrypt(params = {}) {
    let keys = Object.keys(params).sort()
    let newObj = {}
    for (let i = 0; i < keys.length; i++) {
      newObj[keys[i]] = params[keys[i]]
    }
    // 将newObj进行拼接组合
    params = _.join(_.map(newObj, (v, i) => i + '=' + (_.isArray(v) ? JSON.stringify(v) : v)), '&')
    return MD5(params).toString()
  }
}
