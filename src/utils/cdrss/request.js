import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { camelizeKeys, pascalizeKeys } from 'humps'
import cryptoJS from 'crypto-js'
import queryString from 'query-string'
import { message, Notification } from 'antd'
import $ from 'jquery'
import config from './config'

const { urlCryptoJSKey, YQL, CORS, baseURL } = config
axios.defaults.baseURL = baseURL

const encryptString = (plain = '') => {
  return cryptoJS.AES.encrypt(plain, urlCryptoJSKey)
}
const encrypt = (obj = {}) => {
  return encryptString(JSON.stringify(obj))
}
const decryptToString = (str) => {
  if (str) {
    try {
      let dbytes = cryptoJS.AES.decrypt(str, urlCryptoJSKey)
      return dbytes.toString(cryptoJS.enc.Utf8)
    } catch (error) {
      return ''
    }
  }
  return ''
}
const decrypt = (str) => {
  // //console.log(str)
  if (str) {
    try {
      return JSON.parse(decryptToString(str))
    } catch (error) {
      return {}
    }
  }
  return {}
}
const formatUrlPath = (url, data) => {
  const newData = camelizeKeys({
    ...data,
  })
  let newUrl = url
  try {
    let domin = ''
    if (newUrl.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = newUrl.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      newUrl = newUrl.slice(domin.length)
    }
    const match = pathToRegexp.parse(newUrl)
    if (match.length > 1) {
      for (let index = 1; index < match.length; index++) {
        let element = match[index]
        if (!newData[element.name]) {
          newUrl = newUrl.replace(`:${element.name}`, '')
        }
      }
      newUrl = pathToRegexp.compile(newUrl)(newData)
      const index = newUrl.indexOf('?')
      if (index >= 0) {
        const subUrl = newUrl.substring(index + 1)
        const para = queryString.parse(subUrl)
        newUrl = `${newUrl.substring(0, index + 1)}${encrypt(para)}`
      }
      // for (let item of match) {
      //   if (item instanceof Object && item.name in newData) {
      //     delete data[item.name]
      //   }
      // }
    }

    return domin + newUrl
  } catch (e) {
    message.error(e.message)
    return url
  }
}

const fetch = (options) => {
  let {
    data,
    fetchType,
    url,
    method = 'get',
    // suppressException = false,
    autoTransformation = true,
  } = options
  const cloneData = autoTransformation ? pascalizeKeys(lodash.cloneDeep(data)) : lodash.cloneDeep(data)

  url = formatUrlPath(url, cloneData)
  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  } else if (url.indexOf('http') < 0) {
    url = baseURL + url
  }

  const conf = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  switch (method.toLowerCase()) {
    // return axios.get(url, {
    //   params: cloneData,
    // }, config)
    case 'delete':
    case 'get':
    case 'post':
    case 'patch': {
      if (fetchType) {
        return axios.get(url, {
          params: cloneData,
        }, conf)
      }
      let otherConfig = {}
      let pdata = cloneData
      if (options.contentType) {
        otherConfig = { contentType: options.contentType }
        if (options.contentType === 'application/json') {
          pdata = JSON.stringify(cloneData)
        }
      }
      return $.when($.ajax({
        ...otherConfig,
        url,
        type: method,
        crossDomain: true,
        data: pdata,
        beforeSend: (xhr /* , settings */) => {
          if (localStorage.getItem('accessToken')) {
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
          }
        },
      }))
    }
    case 'put':
      return axios.put(url, cloneData)
    default:
      return axios(options)
  }
}

const request = async (options) => {
  // if (options.url && options.url.indexOf('//') > -1) {
  //   const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
  //   if (window.location.origin !== origin) {
  //     if (CORS && CORS.indexOf(origin) > -1) {
  //       options.fetchType = 'CORS'
  //     } else if (YQL && YQL.indexOf(origin) > -1) {
  //       options.fetchType = 'YQL'
  //     } else {
  //       options.fetchType = 'JSONP'
  //     }
  //   }
  // }
  // console.log(options)
  const r = await fetch(options)
    .then((response, status, xhr) => {
      const { options: opts = {} } = options
      // console.log(opts)
      // console.log(response, status, xhr)
      const { statusText } = xhr
      let data = {}
      if (response) {
        data = camelizeKeys(options.fetchType === 'YQL' ? response.data.query.results.json : response)
        if (data.message) {
          if (data.messageType === 4 && opts.error !== '') {
            message.error(opts.error || data.message)
          } else if (data.messageType === 3 && opts.warn !== '') {
            message.info(opts.warn || data.message)
          } else if (opts.success !== '') {
            message.success(opts.success || data.message)
          }
        }
        Notification.destroy()
      }
      return {
        success: true,
        message: statusText,
        status,
        data,
      }
    })
    .catch((response) => {
      let msg
      let status
      let payload = {}
      if (response) {
        try {
          const { data, statusText, responseText, responseJSON } = response
          // console.log(response)
          if (responseJSON) {
            payload = responseJSON
          } else if (responseText && responseText.startsWith('{')) {
            payload = camelizeKeys(data || JSON.parse(responseText))
          }
          status = response.status
          msg = payload.message || statusText
        } catch (error) {
          console.error(error)
          let errorMsg = 'Unknown System Error'
          const exception = { success: false, status, errorMsg, payload }
          throw exception
        }
      } else {
        status = 600
        msg = 'Network Error'
      }
      // //console.log(options)
      if (options.suppressException) {
        return { success: false, status, message: msg, payload }
      }
      const exception = { success: false, status, message: msg, payload }

      throw exception
    })
  // console.log(r)
  return r
}


module.exports = {
  formatUrlPath,
  request,
  encryptString,
  encrypt,
  decryptToString,
  decrypt,
}
