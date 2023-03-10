import React from 'react'
import PromiseRender from './PromiseRender'
import { CURRENT } from './renderAuthorize'
import Authorized, { HiddenWhenDisable } from '@/utils/Authorized'

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

const checkSinglePermission = (
  currentAuthority,
  authority,
  target,
  type,
  Exception,
) => {
  let match = null

  const r = currentAuthority.filter(o => o.name === authority)
  if (r.length > 0) {
    match = r.find(
      o => ['enable', 'enabled', 'readwrite'].indexOf(o.rights) >= 0,
    )
    if (match) {
      match.rights = 'enable'
      if (type === 'decorator') return match
      if (React.isValidElement(target))
        return (
          <Authorized.Context.Provider value={match}>
            {React.cloneElement(target, {
              rights: match.rights,
            })}
          </Authorized.Context.Provider>
        )
      return typeof target === 'function' && type !== 'decorator'
        ? target(match)
        : target
    }

    match = r.find(o => ['hidden'].indexOf(o.rights) >= 0)
    if (match) {
      if (type === 'decorator') return match

      return typeof target === 'function' && type !== 'decorator'
        ? target(match)
        : null
    }

    match = r.find(o => ['readonly', 'disable'].indexOf(o.rights) >= 0)
    if (match) {
      match.rights = HiddenWhenDisable.some(a => a === match.name)
        ? 'hidden'
        : 'disable'

      if (type === 'decorator') return match

      // match.rights
      // console.log(match)
      if (typeof target === 'object' && !React.isValidElement(target))
        return target
      // eslint-disable-next-line no-nested-ternary
      return typeof target === 'function' && type !== 'decorator' ? (
        target(match)
      ) : type !== 'decorator' ? (
        <Authorized.Context.Provider value={match}>
          {React.cloneElement(target, {
            disabled: true,
            rights: match.rights,
          })}
        </Authorized.Context.Provider>
      ) : (
        'disabled'
      )
    }

    // match = r.find(
    //   (o) =>
    //     [
    //       'disable',
    //     ].indexOf(o.rights) >= 0,
    // )
    // if (match) {
    //   // eslint-disable-next-line no-nested-ternary
    //   return typeof target === 'function' && type !== 'decorator'
    //     ? target(match)
    //     : type !== 'decorator'
    //       ? React.cloneElement(target, {
    //           disabled: true,
    //         })
    //       : 'disabled'
    // }

    // return null
  }
  // console.log(authority)
  return typeof Exception === 'function' && type !== 'decorator'
    ? Exception()
    : Exception
}

/**
 * ????????????????????????
 * Common check permissions method
 * @param { ???????????? Permission judgment type string |array | Promise | Function } authority
 * @param { ???????????? Your permission description  type:string} currentAuthority
 * @param { ??????????????? Passing components } target
 * @param { ?????????????????? no pass components } Exception
 * @param { caller type } type
 */
const checkPermissions = (
  authority,
  currentAuthority,
  target,
  Exception,
  type,
) => {
  // console.log(
  //   'checkPermissions',
  //   authority,
  //   currentAuthority,
  //   target,
  //   Exception,
  // )
  // ??????????????????.??????????????????
  // Retirement authority, return target;
  if (!authority || (Array.isArray(authority) && !authority.join(' ').trim())) {
    return typeof target === 'function' && type !== 'decorator'
      ? target({
          name: 'full.edit',
          rights: 'enable',
        })
      : target
  }
  // ????????????
  let match = null
  if (Array.isArray(authority)) {
    for (let index = 0; index < authority.length; index++) {
      const a = authority[index]
      const r = currentAuthority.filter(o => o.name === a)
      if (r.length > 0) {
        match = r.find(
          o => ['enable', 'enabled', 'readwrite'].indexOf(o.rights) >= 0,
        )
        if (match) {
          return checkSinglePermission(
            currentAuthority,
            a,
            target,
            type,
            Exception,
          )
        }
      }
    }

    return checkSinglePermission(
      currentAuthority,
      authority[0],
      target,
      type,
      Exception,
    )
  }
  // string ??????
  if (typeof authority === 'string') {
    return checkSinglePermission(
      currentAuthority,
      authority,
      target,
      type,
      Exception,
    )
  }

  // Promise ??????
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />
  }

  // Function ??????
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority)
      // ??????????????????????????? Promise
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

  throw new Error('unsupported parameters')
}

export { checkPermissions }

const CheckPermissions = (authority, target = f => f, Exception, type) => {
  return checkPermissions(authority, CURRENT, target, Exception, type)
}

export default CheckPermissions
