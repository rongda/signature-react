import { AES, mode, pad } from 'crypto-js'
import { parse } from 'crypto-js/enc-latin1'
import { encryptKey, encryptIv } from '../config'

export default {
  encryptFn(plainText) {
    return AES.encrypt(plainText, parse(encryptKey), {
      iv: parse(encryptIv),
      mode: mode.CBC,
      padding: pad.Pkcs7
    }).toString()
  }
}
