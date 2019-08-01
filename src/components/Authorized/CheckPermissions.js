import React from 'react'
import PromiseRender from './PromiseRender'
import { CURRENT } from './renderAuthorize'

function isPromise (obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 * @param { caller type } type 
 */
const checkPermissions = (
  authority,
  currentAuthority,
  target,
  Exception,
  type,
) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target
  }
  // 数组处理
  let match = null
  if (Array.isArray(authority)) {
    // console.log(authority, currentAuthority)
    match = authority.filter((o) =>
      currentAuthority.find((m) => o.name === m.name && o.rights === m.rights),
    )
    if (match.length > 0) {
      return typeof target === 'function' && type !== 'decorator'
        ? target(match)
        : target
    }
    // if (Array.isArray(currentAuthority)) {
    //   for (let i = 0; i < currentAuthority.length; i += 1) {
    //     const element = currentAuthority[i]
    //     if (authority.indexOf(element) >= 0) {
    //       return target
    //     }
    //   }
    // }
    return typeof Exception === 'function' && type !== 'decorator'
      ? Exception()
      : Exception
  }

  // string 处理
  if (typeof authority === 'string') {
    const r = currentAuthority.filter((o) => o.name === authority)
    if (r.length > 0) {
      match = r.find(
        (o) =>
          [
            'enable',
          ].indexOf(o.rights) >= 0,
      )
      if (match)
        return typeof type === 'function' && type !== 'decorator'
          ? target(match)
          : target

      match = r.find(
        (o) =>
          [
            'hidden',
          ].indexOf(o.rights) >= 0,
      )
      if (match) {
        return null
      }
      match = r.find(
        (o) =>
          [
            'disable',
          ].indexOf(o.rights) >= 0,
      )
      if (match) {
        return typeof type === 'function' && type !== 'decorator'
          ? target(match)
          : React.cloneElement(target, {
              disabled: true,
            })
      }

      return null
    }
    // if (Array.isArray(currentAuthority)) {
    //   for (let i = 0; i < currentAuthority.length; i += 1) {
    //     const element = currentAuthority[i]
    //     if (authority === element) {
    //       return target
    //     }
    //   }
    // }
    return typeof Exception === 'function' && type !== 'decorator'
      ? Exception()
      : Exception
  }

  // Promise 处理
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority)
      // 函数执行后返回值是 Promise
      if (isPromise(bool)) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />
      }
      if (bool) {
        return target
      }
      return typeof Exception === 'function' && type !== 'decorator'
        ? Exception()
        : Exception
    } catch (error) {
      throw error
    }
  }
  console.log(
    'checkPermissions',
    authority,
    currentAuthority,
    target,
    Exception,
  )
  throw new Error('unsupported parameters')
}

export { checkPermissions }

const check = (authority, target, Exception) => {
  // console.log(authority, CURRENT, target, Exception)
  return checkPermissions(authority, CURRENT, target, Exception)
}

export default check
