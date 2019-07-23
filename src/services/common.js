import request from '@/utils/request'
import { getUniqueGUID, convertToQuery } from '@/utils/utils'

export async function queryList (url, params, convertExcludeFields) {
  // //console.log('querylist')
  // console.log(params)
  return request(url, {
    method: 'GET',
    data: convertToQuery(
      {
        pagesize: 10,
        current: 1,
        ...params,
      },
      convertExcludeFields,
    ),
  })
}

export async function remove (url, params) {
  return request(url, {
    method: 'delete',
    data: params,
  })
}

export async function query (url, params) {
  if (params.id) {
    return request(`${url}/${params.id}`, {
      method: 'GET',
    })
  }
  if (typeof params === 'number') {
    return request(`${url}/${params}`, {
      method: 'GET',
    })
  }
  return request(url, {
    method: 'GET',
    data: {
      ...params,
    },
  })
}

export async function upsert (url, params) {
  // console.log(url, params)

  let r
  if (params.id) {
    r = await request(`${url}/${params.id}`, {
      method: 'PUT',
      body: params,
    })
  } else {
    r = await request(`${url}`, {
      method: 'POST',
      body: {
        // id: getUniqueGUID(),
        ...params,
      },
    })
  }

  // console.log(r)
  return r
}

// export async function create (url, params, options) {
//   // config,
//   // console.log(url, params, config)
//   return request(url.replace('/:id', ''), {
//     method: 'post',
//     data: mapFormFieldsToPostValues(params),
//     // ...config,
//     options,
//   })
// }
// // export async function postJson (url, params) {
// //   return request({
// //     url,
// //     method: 'post',
// //     data: params,
// //     contentType: 'application/json',
// //   })
// // }

// export async function update (url, params, options) {
//   return request({
//     url,
//     method: 'patch',
//     data: mapFormFieldsToPostValues(params),
//     options,
//   })
// }

export async function lock (url, params, options) {
  return request({
    url: `${url}/lock/true`,
    method: 'patch',
    data: params,
    options,
  })
}

export async function unlock (url, params, options) {
  return request({
    url: `${url}/lock/false`,
    method: 'patch',
    data: params,
    options,
  })
}
