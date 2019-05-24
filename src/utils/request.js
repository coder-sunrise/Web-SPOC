import fetch from 'dva/fetch'
import { notification } from '@/components'
import router from 'umi/router'
import hash from 'hash.js'
import queryString from 'query-string'
import $ from 'jquery'
import { isAntdPro } from './utils'

// const baseUrl = 'http://localhost:55314'
// export const baseUrl = 'http://localhost:55314'
export const baseUrl = 'https://semr2dev2010.emr.com.sg'
let dynamicURL=baseUrl

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

export function updateAPIType (type) {
  if(type==='PROD'){
    dynamicURL=baseUrl
  }else{
    dynamicURL='localhost:8000'
  }
  }

const checkStatus = async (response) => {
  // console.log(response)

  if (response.status >= 200 && response.status < 300) {
    return response
  }
  let returnObj = {
    title: codeMessage[response.status],
  }

  let isJson = false
  try {
    returnObj = await response.json()
    isJson = true
  } catch (error) {}
  const errortext = returnObj.title || returnObj.message
  notification.destroy()
  notification.error({
    message: (
      <div>
        <h4>
          {errortext}: {response.url}
        </h4>
        {JSON.stringify(returnObj.errors)}
      </div>
    ),
    duration: 0,
  })

  const error = new Error(errortext)
  error.isJson = isJson
  error.name = response.status
  error.response = response
  throw error
}

const cachedSave = (response, hashcode) => {
  console.log('cachedSave', response)
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response.clone().text().then((content) => {
      sessionStorage.setItem(hashcode, content)
      sessionStorage.setItem(`${hashcode}:timestamp`, Date.now())
    })
  }
  return response
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, option) {
  const options = {
    expirys: true,
    ...option,
  }
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '')
  const hashcode = hash.sha256().update(fingerprint).digest('hex')
  let newUrl = url

  // const token = 'CfDJ8NIVLAbYTRpOk2IDmBBb9nQ09BNeoyGSs_wHHE4tfcY_d_w5lgvxw6gKmNhohjJ3vpZohASGm5XG997uWe1fXzuzLYtRzoDTmq7d40T-VSaQkUc2beqjFQNqL4D2xhgJC5-cPIGRGpuCXu1BbmEYThuk89P4aHiKA5WoZy4TNUVaUchuNHfi69qaqgCqWPhi1AMYpRf2isqFAt-dIkk0Z-yXcdFLNoylnQSVPjMtF5ahmWD0_ix-qkM3U15klptxPENvmB9-7gVCp5n-bS9YibPT-rWgudAmgVv5_LzG8OKtUKWHY_CNvoGeqgEKq4GojzGMFzHTl5DHeIlq6bb6YLple9unPtWJylgOgq9SdmiIzHAa5zkNCVaXTpEvNVrA0rFdB4zgWJOy-uDwb6qTGAhG_qqmICwITsTKe6DA7KYcZUP1kUERGoPAK3AtzsUl30aRaVzUo1VtfRy1hWe7lBE0K_7EQxrga7I871jO8s2vmdWIdUEw807vjxvuf7s0km5xbmEn-Watlpqbuken-ZzMGkXJju65mYB2_jm6NfqHDvSRmUB6Sc3SLWTukH3xsC8xIFw71bwT8KLy8UyAVCC7KGI1lhPg3MnIXVeeyhL2AT_-CWsg26h7IKfUmw_HP591Tr046-sDNukuqJwmjUpky2eU8kF6AeHxBm9fPtWQ79WFvO4vi2bxrmz29e-9NmbRd3WwLzivRIFSYRNIJhGyY5EPlJ01Cn2WbWr-hAKhqmucB66KxTtDcnMuxFeJ2EnxQhLtUEgGprgQ8LSqoJGV9BPEbkDcn_4XyYqWoqLAILE1Z2jNCo5rU-e0o9ya9Pwwhq0sgrQkiXAMAVsCvBiNPSBkSq-AJbejB3YXB3EY3Z_FmdFwO_1fgpJeoWkTKD4dYBEDHHgxHBOEGJRc9-chkYJfeFSX93iqD2VG6K68'
  const token = sessionStorage.getItem('token')
  const defaultOptions = {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const newOptions = { ...defaultOptions, ...options }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      //   newOptions.headers = {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json; charset=utf-8',
      //     ...newOptions.headers,
      //   }
      newOptions.body = JSON.stringify(newOptions.body)
      // } else {
      //   // newOptions.body is FormData
      //   newOptions.headers = {
      //     Accept: 'application/json',
      //     ...newOptions.headers,
      //   }
    }
  } else if (newOptions.method === 'GET' || !newOptions.method) {
    // const search = queryString.stringify(newOptions.data)
    // if (search) {
    //   newUrl += `?${queryString.stringify(newOptions.data)}`
    // }
  }

  // const expirys = options.expirys && 60
  // // options.expirys !== false, return the cache,
  // if (options.expirys !== false) {
  //   console.log('options.expirys', options)
  //   const cached = sessionStorage.getItem(hashcode)
  //   const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`)
  //   if (cached !== null && whenCached !== null) {
  //     const age = (Date.now() - whenCached) / 1000
  //     if (age < expirys) {
  //       const response = new Response(
  //         new Blob([
  //           cached,
  //         ]),
  //       )
  //       return response.json()
  //     }
  //     sessionStorage.removeItem(hashcode)
  //     sessionStorage.removeItem(`${hashcode}:timestamp`)
  //   }
  // }
  // const isProd = process.env.NODE_ENV === 'production'
  // if (isProd) url = `/prod${url}`
  if (options.uat) console.log(url)
  if (
    [
      '/api/fake_chart_data',
      '/api/fake_list?',
      '/api/currentUser',
    ].indexOf(url) < 0
  ) {
    newUrl = dynamicURL + newUrl
  }
  // console.log(newOptions)
  try {
    caches.open('test').then((cache) => {})

    let r = $.when(
      $.ajax({
        ...newOptions,
        url: newUrl,
        type: newOptions.method,
        crossDomain: true,
        cache: true,
        data: newOptions.data || newOptions.body,
        beforeSend: (xhr /* , settings */) => {
          // if (localStorage.getItem('accessToken')) {

          // }
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          xhr.setRequestHeader('Accept', 'application/json')
          xhr.setRequestHeader(
            'Content-Type',
            'application/json; charset=utf-8',
          )
        },
      }),
    )
      // fetch(newUrl, newOptions)
      // .then(checkStatus)
      // .then((response) => cachedSave(response, hashcode))
      // .then((response) => {
      //   // DELETE and 204 do not return data by default
      //   // using .json will report an error.
      //   if (newOptions.method === 'DELETE' || response.status === 204) {
      //     return response.text()
      //   }
      //   console.log(response)
      //   return response.json()
      // })
      .then((response, s, xhr) => {
        const { options: opts = {} } = options
        // console.log(response, s, xhr)
        // console.log(response, status, xhr)
        const { statusText, status } = xhr
        if (status >= 200 && status < 300) {
          return response || status
        }
        let data = {}
        if (response) {
          data =
            options.fetchType === 'YQL'
              ? response.data.query.results.json
              : response.data
          if (data.message) {
            if (data.messageType === 4 && opts.error !== '') {
              notification.error(opts.error || data.message)
            } else if (data.messageType === 3 && opts.warn !== '') {
              notification.info(opts.warn || data.message)
            } else if (opts.success !== '') {
              notification.success(opts.success || data.message)
            }
          }
          notification.destroy()
        }
        return data
      })
      .catch((response, s, xhr) => {
        console.log(response, s, xhr)
        let msg
        let status
        let payload = {}
        if (response) {
          try {
            let returnObj = {
              title: codeMessage[response.status],
            }

            let isJson = false
            try {
              returnObj = response
              isJson = true
            } catch (error) {}
            const errortext =
              returnObj.title || returnObj.message || returnObj.statusText
            notification.destroy()
            notification.error({
              message: (
                <div>
                  <h4>
                    {errortext}: {response.url}
                  </h4>

                  {JSON.stringify(returnObj.errors || returnObj.responseJSON)}
                </div>
              ),
              duration: 0,
            })

            // const error = new Error(errortext)
            // error.isJson = isJson
            // error.name = response.status
            // error.response = response
            // throw error

            // const { data, statusText, responseText, responseJSON } = response
            // // console.log(response)
            // if (responseJSON) {
            //   payload = responseJSON
            // } else if (responseText && responseText.startsWith('{')) {
            //   payload = data || JSON.parse(responseText)
            // }
            // status = response.status
            // msg = payload.message || statusText
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
        return false
        // const exception = { success: false, status, message: msg, payload }

        // throw exception
      })

    // .catch((e) => {
    //   console.log(e)
    //   const status = e.name
    //   if (!e.isJson) {
    //     if (status === 401) {
    //       // @HACK
    //       /* eslint-disable no-underscore-dangle */
    //       window.g_app._store.dispatch({
    //         type: 'login/logout',
    //       })
    //       return
    //     }
    //     // environment should not be used
    //     if (status === 403) {
    //       router.push('/exception/403')
    //       return
    //     }
    //     if (status <= 504 && status >= 500) {
    //       router.push('/exception/500')
    //       return
    //     }
    //     if (status >= 404 && status < 422) {
    //       router.push('/exception/404')
    //     }
    //   }
    // })

    return r
  } catch (error) {
    console.log(error)
  }
}
