import moment from 'moment'
import React from 'react'
import nzh from 'nzh/cn'
import router from 'umi/router'
import { formatMessage, setLocale, getLocale } from 'umi/locale'
import { parse, stringify } from 'qs'
import $ from 'jquery'
import numeral from 'numeral'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import lodash from 'lodash'
import * as cdrssUtil from 'medisys-util'
import {
  NumberInput,
  CustomInput,
  serverDateTimeFormatFull,
} from '@/components'
import config from './config'

document.addEventListener('click', () => {
  window.alreadyFocused = false
})

Object.byString = function (o, s) {
  if (o === undefined || o === null) return ''
  // console.log(o, s)
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  let a = s.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i]
    if (o === undefined || o === null) continue
    try {
      if (k in o) {
        o = o[k]
        if (o === undefined) return ''
      } else {
        return ''
      }
    } catch (error) {
      console.log(error)
      return ''
    }
  }
  return o
}

String.prototype.replaceAll = function (search, replacement) {
  let target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

// function toLocal (m) {
//   // console.log(m, m.formatUTC(), moment(m.formatUTC()).add(8, 'hours'))
//   return m.add(8, 'hours')
// }

// function toUTC (m) {
//   return moment(m.formatUTC()).add(-8, 'hours')
// }

moment.prototype.formatUTC = function () {
  return this.format(serverDateTimeFormatFull)
}

// moment.prototype.toUTC = function () {
//   return this.clone().add(-8, 'hours')
// }

export function fixedZero (val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function getTimeDistance (type) {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [
      moment(now),
      moment(now.getTime() + (oneDay - 1000)),
    ]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - day * oneDay

    return [
      moment(beginTime),
      moment(beginTime + (7 * oneDay - 1000)),
    ]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`,
        ).valueOf() - 1000,
      ),
    ]
  }

  const year = now.getFullYear()
  return [
    moment(`${year}-01-01 00:00:00`),
    moment(`${year}-12-31 23:59:59`),
  ]
}

export function getPlainNode (nodeList, parentPath = '') {
  const arr = []
  nodeList.forEach((node) => {
    const item = node
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
    item.exact = true
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path))
    } else {
      if (item.children && item.component) {
        item.exact = false
      }
      arr.push(item)
    }
  })
  return arr
}

export function digitUppercase (n) {
  return nzh.toMoney(n)
}

function getRelation (str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!') // eslint-disable-line
  }
  const arr1 = str1.split('/')
  const arr2 = str2.split('/')
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2
  }
  return 3
}

function getRenderArr (routes) {
  let renderArr = []
  renderArr.push(routes[0])
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter((item) => getRelation(item, routes[i]) !== 1)
    // 是否包含
    const isAdd = renderArr.every((item) => getRelation(item, routes[i]) === 3)
    if (isAdd) {
      renderArr.push(routes[i])
    }
  }
  return renderArr
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes (path, routerData) {
  let routes = Object.keys(routerData).filter(
    (routePath) => routePath.indexOf(path) === 0 && routePath !== path,
  )
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map((item) => item.replace(path, ''))
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes)
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(
      (route) => route !== item && getRelation(route, item) === 1,
    )
    return {
      exact,
      ...routerData[`${path}${item}`],
      prop: `${path}${item}`,
      path: `${path}${item}`,
    }
  })
  return renderRoutes
}

export function getPageQuery (url) {
  return parse((url || window.location.href).split('?')[1])
}

export function getQueryPath (path = '', query = {}) {
  const search = stringify(query)
  if (search.length) {
    return `${path}?${search}`
  }
  return path
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export function isUrl (path) {
  return reg.test(path)
}

export function formatWan (val) {
  const v = val * 1
  if (!v || Number.isNaN(v)) return ''

  let result = val
  if (val > 10000) {
    result = Math.floor(val / 10000)
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    )
  }
  return result
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro () {
  return window.location.hostname === 'preview.pro.ant.design'
}

export function extendFunc (...args) {
  const funcNew = function () {
    for (let i = 0; i < args.length; i++) {
      if (args[i]) args[i].apply(this, arguments)
    }
  }
  return funcNew
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const sumReducer = (p, n) => {
  return p + n
}
const maxReducer = (p, n) => {
  return p >= n ? p : n
}

export function difference (object, base) {
  function changes (o, b = {}) {
    return lodash.transform(o, (result, value, key) => {
      // console.log(value, b, key)
      if (!lodash.isEqual(value, b[key])) {
        result[key] =
          lodash.isObject(value) && lodash.isObject(b[key])
            ? changes(value, b[key])
            : value
      }
    })
  }
  return changes(object, base)
}

const searchToObject = () => {
  const pairs = window.location.search.substring(1).split('&')
  const obj = {}

  for (const i in pairs) {
    if (Object.prototype.hasOwnProperty.call(pairs, i)) {
      if (!pairs[i]) continue
      const pair = pairs[i].split('=')
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
    }
  }

  return obj
}

const getAppendUrl = (param, targetUrl) => {
  let url = targetUrl || window.location.pathname
  // let existP = {}

  let newPs = ''
  if (typeof param === 'object') {
    const n = {
      ...(searchToObject() || {}),
      ...param,
    }
    Object.keys(n).forEach((k) => {
      newPs += `&${k}=${n[k]}`
    })
  } else if (typeof param === 'string') {
    url += window.location.search + param
  }
  if (newPs) {
    url = `${url}?${newPs.substring(1)}`
  }

  return url
}
const getRemovedUrl = (ary = [], targetUrl) => {
  let url = targetUrl || window.location.pathname

  const p = getPageQuery(targetUrl)
  // let existP = {}
  // console.debug(p)
  if (Array.isArray(ary)) {
    ary.forEach((a) => {
      delete p[a]
    })
    // const n = {
    //   ...(searchToObject() || {}),
    // }
    // Object.keys(n).forEach((k) => {
    //   if (!ary.find((o) => o === k)) {
    //     newPs += `&${k}=${n[k]}`
    //   }
    // })
  }
  // console.debug(p)

  return getQueryPath(window.location.pathname, p)
}

const findGetParameter = (parameterName) => {
  let result = null
  let tmp = []
  // eslint-disable-next-line no-restricted-globals
  location.search.substr(1).split('&').forEach((item) => {
    tmp = item.split('=')
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
  })
  return result
}

const convertToQuery = (
  query = {},
  convertExcludeFields = [
    'create',
  ],
) => {
  // //console.log(query)
  const {
    current,
    pagesize,
    combineCondition,
    includeDeleted,
    includeParentDeleted,
    // queryExcludeFields,
    sorting = [],
  } = query
  let customQuerys = { ...query }
  delete customQuerys.keepFilter
  delete customQuerys.current
  delete customQuerys.pagesize
  delete customQuerys.sorting
  delete customQuerys.includeDeleted
  delete customQuerys.includeParentDeleted
  // delete customQuerys.queryExcludeFields
  delete customQuerys.totalRecords
  delete customQuerys.combineCondition
  delete customQuerys.version

  // console.log(query)
  let newQuery = {}
  const refilter = /(.*?)_([^!_]*)!?([^_]*)_?([^_]*)\b/
  newQuery.criteria = []
  newQuery.conditionGroups = []
  // //console.log('convert to query')
  // sort[0][sortby]=patientaccountno&sort[0][order]=desc
  // sorting.forEach((s) => {
  //   // sort[0][sortby]=patientaccountno&sort[0][order]=desc
  // })
  // console.log(query)
  const { valueType, filterType } = config
  for (let p in customQuerys) {
    if (Object.prototype.hasOwnProperty.call(customQuerys, p)) {
      // console.log(customQuerys[p])
      if (customQuerys[p] !== undefined && customQuerys[p] !== '') {
        let val = customQuerys[p]
        if (typeof val === 'string') {
          val = val.trim()
          const match = refilter.exec(p)
          if (!!match && match.length > 1) {
            let s = ''
            match[2].split('$').forEach((item) => {
              s += `${item}.`
            })
            match[2] = s.substring(0, s.length - 1)
            const prop = match[3] || match[2]
            const combineKey = prop.split('/')
            // console.log(match)
            newQuery.criteria.push({
              prop: combineKey.length > 1 ? combineKey : prop,
              val,
              opr: filterType[match[1]],
              // property: match[3] ? s.substring(0, s.length - 1) : null,
              // valueType: match[4] ? valueType[match[4]] : null,
            })
          } else {
            newQuery.criteria.push({
              prop: p,
              val,
              opr: filterType.like,
            })
          }
        } else if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const obj = convertToQuery(val[i])
            // console.log(val[i], obj, JSON.stringify(obj))
            // newQuery.conditionGroups.push(obj)
            if (obj.criteria && obj.criteria.length > 0) {
              obj.criteria.forEach((c, j) => {
                newQuery[`conditionGroups[${i}].criteria[${j}][prop]`] = c.prop
                newQuery[`conditionGroups[${i}].criteria[${j}][val]`] = c.val
                newQuery[`conditionGroups[${i}].criteria[${j}][opr]`] = c.opr
              })
              newQuery[`conditionGroups[${i}].combineCondition`] =
                obj.combineCondition
            }
          }
          // console.log({ newQuery })
        } else if (typeof val === 'object' && Object.keys(val).length === 1) {
          const v = val[Object.keys(val)[0]]
          if (v !== undefined) {
            newQuery.criteria.push({
              prop: `${p}.${Object.keys(val)[0]}`,
              val: v,
              opr:
                [
                  'boolean',
                  'number',
                ].indexOf(typeof v) >= 0
                  ? filterType.eql
                  : filterType.like,
            })
          }
        } else if (convertExcludeFields.indexOf(p) < 0) {
          // let valType = null
          // if (typeof val === 'boolean') valType = valueType.b
          // else if (typeof val === 'number') valType = valType.i
          newQuery.criteria.push({
            prop: p,
            val,
            // valueType: valType,
            opr:
              [
                'boolean',
                'number',
              ].indexOf(typeof val) >= 0
                ? filterType.eql
                : filterType.like,
          })
        }
      }
    }
  }

  const returnVal = {
    ...newQuery,
    sort: sorting.map((o) => ({
      sortby: o.sortBy || o.columnName,
      order: o.direction,
    })),
    current,
    pagesize,
    combineCondition,
    includeDeleted,
    includeParentDeleted,
    // queryExcludeFields,
  }
  convertExcludeFields.forEach((p) => {
    if (customQuerys[p] !== undefined) returnVal[p] = customQuerys[p]
  })
  // if (returnVal.criteria && returnVal.criteria.length > 0) {
  //   returnVal.criteria = JSON.stringify(returnVal.criteria)
  // }
  return returnVal
}

export const updateGlobalVariable = (key, value) => {
  if (!window.medisys) {
    window.medisys = {}
  }
  window.medisys[key] = value
}

export const getGlobalVariable = (key) => {
  if (!window.medisys) {
    window.medisys = {}
  }
  return window.medisys[key]
}

export const updateLoadingState = (type = '@@DVA_LOADING/HIDE') => {
  const { dispatch, getState } = window.g_app._store
  const { loading } = getState()
  if (loading) {
    Object.keys(loading.effects).forEach((o) => {
      if (loading.effects[o]) {
        dispatch({
          type,
          payload: {
            namespace: o.substr(0, o.indexOf('/')),
            actionType: o,
          },
        })
      }
    })
  }
}

let errorCount = 0

export const updateCellValue = (
  {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
    classes,
    config = {},
    row,
  },
  element,
  val,
  col,
) => {
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const { validationSchema, gridId, getRowId, ...restConfig } = cfg
  // console.log({ columnName, val },getRowId,'dsad')
  if (!window.$tempGridRow[gridId]) {
    window.$tempGridRow[gridId] = {}
  }
  if (!window.$tempGridRow[gridId][getRowId(row)]) {
    // console.log('1312323', row, getRowId(row))
    window.$tempGridRow[gridId][getRowId(row)] = row
  }
  // console.log(columnName, val)
  // console.log({ row, val })
  window.$tempGridRow[gridId][getRowId(row)][columnName] = val
  // console.log(val, columnName)
  // console.log({ t1: window.$tempGridRow })
  if (validationSchema) {
    try {
      if (value !== val) {
        onValueChange(val)
      }
      const r = validationSchema.validateSync(
        window.$tempGridRow[gridId][getRowId(row)],
        {
          abortEarly: false,
        },
      )
      // console.log({ t2: window.$tempGridRow })
      // console.log({ r })
      $(element).parents('tr').find('.grid-commit').removeAttr('disabled')

      return ''
      // row._$error = false
    } catch (er) {
      // console.log(er)
      // window.g_app._store.dispatch({
      //   type: 'global/updateState',
      //   payload: {
      //     errorCount: errorCount++,
      //   },
      // })
      // const { inner } = er
      // if (inner) {
      //   if (!inner.find((o) => o.path === columnName)) {
      //     return
      //   }
      // }
      // $(element).parents('tr').find('.grid-commit').attr('disabled', true)
      // console.log(er)
      const actualError = (er.inner || []).find((o) => o.path === columnName)
      return actualError ? actualError.message : ''
      // row._$error = true
    }
  } else if (value !== val) {
    onValueChange(val)
  }
}

const observers = {}
export const watchForElementChange = (e) => {
  let t = e.selector

  let n = e.ongoing

  let a = e.callback

  let i = e.config

  let r =
    undefined === i
      ? {
          childList: true,
          characterData: true,
          subtree: true,
          attributes: true,
        }
      : i
  ;(observers[t] = new MutationObserver((e1) => {
    e1.forEach((e2) => {
      a(e2)
    }),
      n || observers[t].disconnect()
  })),
    observers[t].observe(e.container || document, r)
}

const confirmBeforeReload = (e) => {
  e.preventDefault()
  // Chrome requires returnValue to be set
  e.returnValue = ''
}

const navigateDirtyCheck = (itemPath) => (e) => {
  // console.log({ itemPath, e, handler: window.beforeReloadHandlerAdded })
  if (window.beforeReloadHandlerAdded) {
    window.g_app._store.dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: formatMessage({
          id: 'app.general.leave-without-save',
        }),
        onOpenConfirm: () => {
          window.g_app._store.dispatch({
            type: 'formik/updateState',
            payload: {},
          })
          window.beforeReloadHandlerAdded = false
          window.removeEventListener('beforeunload', confirmBeforeReload)

          router.push(itemPath)
        },
      },
    })
    e.preventDefault()
  } else {
    router.push(itemPath)
  }
}

const calculateAdjustAmount = (
  isExactAmount = true,
  initialAmout = 0,
  adj = 0,
) => {
  let amount = initialAmout
  let adjAmount
  if (isExactAmount) {
    adjAmount = adj
  } else {
    adjAmount = initialAmout * adj * 0.01
  }
  amount += adjAmount
  return {
    amount,
    adjAmount,
  }
}

const errMsgForOutOfRange = (field) => `${field} must between 0 and 999,999.99`
const calculateItemLevelAdjustment = (
  adjType = 'ExactAmount',
  adjValue = 0,
  tempSubTotal = 0,
  tempInvoiceTotal = 0,
  isClinicGSTEnabled = false,
  gstPercentage = 0,
  gstEnabled = false,
  gstIncluded = false,
) => {
  let itemLevelAdjustmentAmount = 0
  let itemLevelGSTAmount = 0

  if (adjType === 'Percentage') {
    itemLevelAdjustmentAmount = tempSubTotal * (adjValue / 100)
    tempSubTotal += itemLevelAdjustmentAmount
  } else {
    itemLevelAdjustmentAmount = tempSubTotal / tempInvoiceTotal * adjValue
    tempSubTotal += itemLevelAdjustmentAmount
  }

  if (isClinicGSTEnabled) {
    if (!gstEnabled) {
      itemLevelGSTAmount = 0
    } else if (gstIncluded) {
      itemLevelGSTAmount = tempSubTotal * (gstPercentage / 107)
    } else {
      itemLevelGSTAmount = tempSubTotal * (gstPercentage / 100)
    }
  } else {
    itemLevelGSTAmount = 0
  }

  return {
    itemLevelAdjustmentAmount,
    itemLevelGSTAmount,
  }
}

module.exports = {
  ...cdrssUtil,
  ...module.exports,
  sleep,
  sumReducer,
  maxReducer,
  getAppendUrl,
  getRemovedUrl,
  convertToQuery,
  updateLoadingState,
  updateGlobalVariable,
  getGlobalVariable,
  updateCellValue,
  watchForElementChange,
  confirmBeforeReload,
  navigateDirtyCheck,
  calculateAdjustAmount,
  errMsgForOutOfRange,
  calculateItemLevelAdjustment,
  findGetParameter,
  // toUTC,
  // toLocal,
}
