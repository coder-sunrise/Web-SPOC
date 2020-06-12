import cryptoJS from 'crypto-js'

const defaultEncryptKey = 'eed*62H*%l$4ksfHyOJGLJG)JH6%$~fd'
const defaultEncryptIV = 'ieu(4f5%fj9kG14K'
export const AESEncryptor = {
  encrypt: (str, encryptKey) => {
    let key = cryptoJS.enc.Utf8.parse(encryptKey || defaultEncryptKey)
    let iv = cryptoJS.enc.Utf8.parse(defaultEncryptIV)

    let encrypted = ''

    let srcs = cryptoJS.enc.Utf8.parse(str)
    encrypted = cryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: cryptoJS.mode.CBC,
      padding: cryptoJS.pad.Pkcs7,
    })

    return encrypted.ciphertext.toString()
  },

  decrypt: (str, encryptKey) => {
    let key = cryptoJS.enc.Utf8.parse(encryptKey || defaultEncryptKey)
    let iv = cryptoJS.enc.Utf8.parse(defaultEncryptIV)
    let encryptedHexStr = cryptoJS.enc.Hex.parse(str)
    let srcs = cryptoJS.enc.Base64.stringify(encryptedHexStr)
    let decrypt = cryptoJS.AES.decrypt(srcs, key, {
      iv,
      mode: cryptoJS.mode.CBC,
      padding: cryptoJS.pad.Pkcs7,
    })
    let decryptedStr = decrypt.toString(cryptoJS.enc.Utf8)
    return decryptedStr.toString()
  },
}