import CryptoJS from 'crypto-js'

export const AESEncryptor = (encryptKey = 'eed*62H*%l$4ksfHyOJGLJG)JH6%$~fd', encryptIV = 'ieu(4f5%fj9kG14K') => {
  this._KEY = encryptKey
  this._IV = encryptIV
  this.encrypt = (str) => {
    let key = CryptoJS.enc.Utf8.parse(this._KEY)
    let iv = CryptoJS.enc.Utf8.parse(this._IV)

    let encrypted = ''

    let srcs = CryptoJS.enc.Utf8.parse(str)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    return encrypted.ciphertext.toString()
  }

  this.decrypt = (str) => {
    let key = CryptoJS.enc.Utf8.parse(this._KEY)
    let iv = CryptoJS.enc.Utf8.parse(this._IV)
    let encryptedHexStr = CryptoJS.enc.Hex.parse(str)
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }
}