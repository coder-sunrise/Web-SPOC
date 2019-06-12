import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import update from 'immutability-helper'
import lodash from 'lodash'
import * as diff from 'diff'
import pathToRegexp from 'path-to-regexp'
import { Modal, Input, Form, Select, Radio, Collapse, Tabs } from 'antd'
// import BaseComponent from '~/components/BaseComponent'
// import BaseEmptyWrapper from '~/routes/common/BaseEmptyWrapper'
import { color } from './theme'
import config from './config'
import {
  request,
  formatUrlPath,
  encrypt,
  decrypt,
  encryptString,
  decryptToString,
} from './request'

const { regex, format } = config
// const CollapsePanel = Collapse.Panel
const textarea = Input.TextArea
const RadioGroup = Radio.Group
Array.prototype.selectMany = function (fn) {
  return this.map(fn).reduce((x, y) => {
    return x.concat(y)
  }, [])
}
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * Array query
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter((_) => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * Array to Tree
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
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
    page,
    pagesize,
    sort,
    order,
    includeDeleted,
    includeParentDeleted,
    queryExcludeFields,
  } = query
  let customQuerys = { ...query }
  delete customQuerys.page
  delete customQuerys.pagesize
  delete customQuerys.sort
  delete customQuerys.order
  delete customQuerys.includeDeleted
  delete customQuerys.includeParentDeleted
  delete customQuerys.queryExcludeFields
  // //console.log(query)
  let newQuery = {}
  const refilter = /(.*?)_([^!_]*)!?([^_]*)_?([^_]*)\b/
  newQuery.searchConditions = []
  // //console.log('convert to query')
  const { valueType, filterType } = config
  for (let p in customQuerys) {
    if (Object.prototype.hasOwnProperty.call(customQuerys, p)) {
      if (customQuerys[p] !== undefined && customQuerys[p] !== '') {
        let val = customQuerys[p]
        if (typeof val === 'string') {
          val = val.trim()
        }
        const match = refilter.exec(p)
        if (!!match && match.length > 1) {
          let s = ''
          match[2].split('$').forEach((item) => {
            s += `${item}.`
          })
          match[2] = s.substring(0, s.length - 1)
          const key = match[3] || match[2]
          const combineKey = key.split('/')

          newQuery.searchConditions.push({
            key: combineKey.length > 1 ? combineKey : key,
            value: val,
            type: filterType[match[1]],
            property: match[3] ? s.substring(0, s.length - 1) : null,
            valueType: match[4] ? valueType[match[4]] : null,
          })
        } else if (convertExcludeFields.indexOf(p) < 0) {
          let valType = null
          if (typeof val === 'boolean') valType = valueType.b
          else if (typeof val === 'number') valType = valType.i
          newQuery.searchConditions.push({
            key: p,
            value: val,
            valueType: valType,
          })
        }
      }
    }
  }
  const returnVal = {
    ...newQuery,
    page,
    pagesize,
    sort,
    order,
    includeDeleted,
    includeParentDeleted,
    queryExcludeFields,
  }
  convertExcludeFields.forEach((p) => {
    if (customQuerys[p] !== undefined) returnVal[p] = customQuerys[p]
  })
  return returnVal
}

const convertToServerArray = (params, key = 'ids') => {
  let orgParams = { ...params }
  let newParams = []
  for (let i = 0; i < params[key].length; i++) {
    newParams.push({
      [i]: params[key][i],
    })
  }
  delete orgParams[key]
  return { ...orgParams, [key]: newParams }
}

const _constructVal = (value, prefix = '', fields = []) => {
  let newVal = {}
  // console.log(value)
  for (let field in value) {
    if (
      Object.prototype.hasOwnProperty.call(value, field) &&
      (fields.length === 0 || fields.find((o) => o === field))
    ) {
      const newField = prefix + field
      if (Array.isArray(value[field])) {
        const ary = value[field]
        let newAry = []
        for (let i = 0; i < ary.length; i++) {
          if (regex.date.test(ary[i])) {
            newAry.push(moment(ary[i]))
          } else if (moment.isMoment(ary[i])) {
            newAry.push(ary[i])
          } else if (typeof ary[i] === 'object') {
            newVal = {
              ...newVal,
              ..._constructVal(ary[i], `${prefix}${field}[${i}]`),
            }
          } else {
            newAry.push(ary[i])
          }
        }
        if (newAry.length > 0) {
          newVal[`${prefix}${field}`] = Form.createFormField({ value: newAry })
        }
      } else {
        const propValue = value[field]
        if (propValue) {
          // console.log(typeof propValue)
          if (typeof propValue !== 'symbol') {
            if (moment.isMoment(propValue)) {
              newVal[newField] = Form.createFormField({ value: propValue })
            } else if (typeof propValue === 'object') {
              newVal[newField] = Form.createFormField({
                value: _constructVal(propValue),
              })
            } else if (regex.date.test(propValue)) {
              newVal[newField] = Form.createFormField({
                value: moment(propValue),
              })
            } else {
              newVal[newField] = Form.createFormField({ value: propValue })
            }
          }
        } else {
          newVal[newField] = Form.createFormField({ value: propValue })
        }
      }
    }
  }

  return newVal
}

const reArrayProp = /(.*?)\[(\d+)\](.*)/

const reassignVal = (str, value, actualVal) => {
  // console.log(str, value, actualVal)
  let match = reArrayProp.exec(str)
  if (!!match && match.length > 1) {
    const arrayName = match[1]
    const objIndex = match[2]
    const prop = match[3]
    if (!value[arrayName]) value[arrayName] = []
    if (!value[arrayName][objIndex]) value[arrayName][objIndex] = {}
    reassignVal(prop, value[arrayName][objIndex], actualVal)
    delete value[str]
  } else {
    value[str] = actualVal
  }
  return value
}

const convertToObject = (value) => {
  for (let field in value) {
    if (Object.prototype.hasOwnProperty.call(value, field)) {
      value = reassignVal(field, value, value[field])
    }
  }
  // //console.log(value)
  return value
}

let ovcTimer = null
const onValuesChange = (props, values) => {
  // //console.log(props)
  // console.log(values)
  // //console.log(dispatchCallback)
  // console.log(values)
  const { dispatch, type, propName = 'currentItem' } = props
  const payload = {
    isTouched: true,
    [propName]: convertToObject(values),
  }
  // console.log(payload)
  clearTimeout(ovcTimer)
  ovcTimer = setTimeout(() => {
    // console.log(payload)
    dispatch({
      type: `${type}/mergeState`,
      payload,
    })
  }, 200)

  // //console.log(values)
  // //console.log(convertToObject(values))
}

const mapPropsToFields = (props, fields) => {
  // //console.log(props)
  const { value } = props
  // //console.log(value)
  const newValue = _constructVal(value, '', fields)
  // //console.log(newValue)
  return newValue
}

const mapFormFieldsToPostValues = (values) => {
  let val = {}
  if (typeof values !== 'object') return values
  for (let field in values) {
    if (Object.prototype.hasOwnProperty.call(values, field)) {
      if (moment.isMoment(values[field])) {
        val[field] = values[field].format(format.standardDatetime)
      } else if (Array.isArray(values[field])) {
        const ary = []
        values[field].forEach((v) => {
          ary.push(mapFormFieldsToPostValues(v))
        })
        val[field] = ary
      } else {
        val[field] = values[field]
      }
    }
  }
  // //console.log(values)
  // //console.log(val)
  return val
}

let runningId = 0
const getUniqueId = (prefix = 'sys-gen-') => {
  runningId += 1
  return `${prefix}${runningId}`
}

const getUniqueGUID = () => {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = ((d + Math.random() * 16) % 16) | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
const formatDatetime = (text /* , record --remove */) => {
  if (!text) return ''
  return moment(text).format(format.datetime)
}
const formatDatetimeInTimeZone = (text /* , record --remove */) => {
  // console.log(text)
  if (!text) return ''
  return moment.utc(text).tz('Asia/Singapore').format(format.datetime)
}

const confirm = Modal.confirm
const confirmAction = ({
  onOk = () => {},
  onCancel = () => {},
  onDone = () => {},
  title = 'Confirm',
  okText = 'Yes',
  cancelText = 'No',
  content = 'Are you sure delete this record?',
}) => {
  confirm({
    maskClosable: true,
    title,
    okText,
    cancelText,
    content,
    onOk: () => {
      onOk()
      onDone()
    },
    onCancel: () => {
      onCancel()
      onDone()
    },
  })
}
const deepDiffMapper = {
  VALUE_CREATED: 'created',
  VALUE_UPDATED: 'updated',
  VALUE_DELETED: 'deleted',
  VALUE_UNCHANGED: 'unchanged',
  map (obj1, obj2, changesOnly = false, k) {
    if (this.isFunction(obj1) || this.isFunction(obj2)) {
      throw new {
        error: 'Invalid argument. Function given, object expected.',
      }()
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      return {
        type: this.compareValues(obj1, obj2, k),
        data: obj1 === undefined ? obj2 : obj1,
      }
    }

    let diffObj = {}
    for (const key in obj1) {
      if (this.isFunction(obj1[key])) {
        continue
      }

      let value2
      if (typeof obj2[key] !== 'undefined') {
        value2 = obj2[key]
      }
      const r = this.map(obj1[key], value2, changesOnly, key)
      if (r.type !== this.VALUE_UNCHANGED || !changesOnly) {
        diffObj[key] = r
      }
    }
    for (let key in obj2) {
      if (this.isFunction(obj2[key]) || typeof diffObj[key] !== 'undefined') {
        continue
      }
      const r = this.map(undefined, obj2[key], changesOnly, key)
      if (r.type !== this.VALUE_UNCHANGED || !changesOnly) {
        diffObj[key] = r
      }
    }

    return diffObj
  },
  compareValues (value1, value2, k) {
    if (value1 === value2) {
      return this.VALUE_UNCHANGED
    }
    if (
      this.isDate(value1) &&
      this.isDate(value2) &&
      value1.getTime() === value2.getTime()
    ) {
      return this.VALUE_UNCHANGED
    }
    if (typeof value1 === 'undefined' && typeof value2 !== 'undefined') {
      // console.log(value1, value2, k)

      return this.VALUE_CREATED
    }
    if (typeof value2 === 'undefined' && typeof value1 !== 'undefined') {
      return this.VALUE_DELETED
    }
    return this.VALUE_UPDATED
  },
  isFunction (obj) {
    return {}.toString.apply(obj) === '[object Function]'
  },
  isArray (obj) {
    return {}.toString.apply(obj) === '[object Array]'
  },
  isDate (obj) {
    return {}.toString.apply(obj) === '[object Date]'
  },
  isObject (obj) {
    return {}.toString.apply(obj) === '[object Object]'
  },
  isValue (obj) {
    return !this.isObject(obj) && !this.isArray(obj)
  },
}

const addPropToChild = (reactEl, matches) => {
  if (reactEl === undefined || reactEl === null) return null
  if (!matches || matches.length === 0 || typeof reactEl === 'string') {
    return reactEl
  }
  let element = reactEl
  let list = null
  let isArray = false
  if (reactEl && reactEl.length > 0) {
    isArray = true
    list = reactEl
  } else {
    if (
      element &&
      (element.length === 0 ||
        !element.props ||
        !!element.props.ignoreAutoBinding)
    ) {
      return element
    }
    if (element.props && element.props.children) {
      list = element.props.children
    }
  }
  if (list && list.length > 0) {
    matches.forEach((cfg) => {
      const { classType, props, calculate, ignore } = cfg
      // //console.log(element.type, classType)
      if (element.type === classType || classType === '*') {
        // //console.log(ignore)
        if (
          !ignore ||
          (!!element.type && !ignore.find((o) => o === element.type))
        ) {
          // //console.log(props)
          element = React.cloneElement(element, {
            ...(props || calculate(element)),
          })
        }
      }
      element = React.cloneElement(element, {
        children: React.Children.map(list, (child) => {
          return addPropToChild(child, matches)
        }),
      })
    })
  } else {
    // if (element.type === BaseEmptyWrapper) {
    //   return element
    // }
    matches.forEach((cfg) => {
      const { classType, props, calculate, ignore } = cfg
      // //console.log(element.type, classType)

      if (element.type === classType || classType === '*') {
        // //console.log(ignore)
        // //console.log(element.type, classType)
        if (
          !ignore ||
          (!!element.type && !ignore.find((o) => o === element.type))
        ) {
          // //console.log(element)

          element = React.cloneElement(element, {
            ...(props || calculate(element)),
          })
        }
      }
      if (list) {
        element = React.cloneElement(element, {
          children: addPropToChild(list, matches),
        })
      }
    })
  }
  if (isArray) {
    return element.props.children
  }
  return element
}

const getDiffString = (objPrev = '', objNew = '', fn = 'diffChars') => {
  const aryDiff = diff[fn](objPrev, objNew)
  if (aryDiff.length === 1 && aryDiff[0].count === 0) return null
  return aryDiff.map((item) => {
    if (item.added) {
      return <ins>{item.value}</ins>
    }
    if (item.removed) {
      return <del>{item.value}</del>
    }
    return item.value
  })
}
const FormItem = Form.Item
const disableFormRule = (disabled, rules) => {
  if (disabled) {
    rules.push({
      classType: '*',
      // ignore: ['Tabs', 'Content', 'Adapter', 'TabPane'],
      ignore: [
        Collapse.Panel,
        Tabs.TabPane,
      ],
      props: {
        disabled: true,
      },
    })
  }
}
const defaultContainerBehavior = (elements, { val = {}, disabled = false }) => {
  const { isLocked } = val
  const rules = []
  // //console.log(disabled)
  disableFormRule(isLocked || disabled, rules)
  const returnVal = addPropToChild(elements, rules)

  return returnVal
}

const defaultFormBehavior = (
  elements,
  { mode = 'normal', value = {}, previous, disabled = false },
) => {
  const { isLocked } = value
  const rules = [
    {
      classType: Input,
      ignore: [
        textarea,
      ],
      props: {
        onPressEnter: () => {
          if (window.actionBarEnterElement) {
            window.actionBarEnterElement.handleClick()
          }
        },
      },
    },
  ]
  disableFormRule(isLocked || disabled, rules)

  // //console.log(rules)
  if (mode === 'compare') {
    const diffs = deepDiffMapper.map(previous, value)
    rules.push({
      classType: FormItem,
      calculate: (node) => {
        // //console.log(node)
        const { props: nodeProps } = node
        const { children } = nodeProps
        if (!children) return null
        const { type, props: elementProps } = children
        const { id, children: itemChildren } = elementProps
        let field = id
        if (field.indexOf(']') > 0) {
          field = id.replace(/.*](.*)/g, '$1')
        }
        // //console.log(field)
        let items = []
        let orgVal = null
        let newVal = value[field]
        let compareMode
        if (diffs.type === 'created') {
          orgVal = undefined
        } else if (diffs.type === 'deleted') {
          newVal = undefined
        } else {
          if (!diffs[field] || diffs[field].type === 'unchanged') return null
          // //console.log(d[field])
          // //console.log(previous[field], value[field])
          if (!!previous && (!!previous[field] || previous[field] === 0)) {
            orgVal = previous[field]
          }
          if (type === Select) {
            const options = itemChildren.map((o) => ({
              value: o.props.value,
              text: o.props.children[0],
            }))
            orgVal = options.find((o) => o.value === orgVal).text
            newVal = options.find((o) => o.value === newVal).text
            compareMode = 'diffLines'
          }

          if (typeof newVal === 'string') {
            items = getDiffString(orgVal, newVal, compareMode)
          }
        }

        const cls = !newVal ? 'deleted' : 'updated'
        return {
          help: <p>{items}</p>,
          className: !orgVal ? 'new' : cls,
        }
      },
    })

    rules.push({
      classType: '*',
      ignore: [
        FormItem,
      ],
      calculate: (node) => {
        // //console.log(node)
        const { props: nodeProps, type } = node
        const { value: val, form } = nodeProps
        if (!form) return null
        // //console.log(value)
        // //console.log(val)
        // //console.log(previous)

        if (typeof val === 'string') {
          // //console.log(diffs)
          return {
            value: value[val],
            previous: previous ? previous[val] : null,
          }
        }
        if (typeof val === 'number' && Array.isArray(value)) {
          // console.log(val)
        }
        return null
      },
    })
  }

  const returnVal = addPropToChild(elements, rules)

  // console.timeEnd('test form binding')
  return returnVal
}

const sortAll = (data, fieldName = 'sortOrder') => {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      data = data.sort((a, b) => a[fieldName] - b[fieldName])
      data.forEach((element) => {
        sortAll(element)
      })
    } else {
      for (let field in data) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
          if (Array.isArray(data[field])) {
            data[field] = lodash.sortBy(data[field], [
              (o) => o[fieldName],
            ])
            for (let subfield in data[field]) {
              if (Object.prototype.hasOwnProperty.call(data[field], subfield)) {
                sortAll(data[field][subfield])
              }
            }
          }
          if (typeof data[field] === 'object') {
            sortAll(data[field])
          }
        }
      }
    }
  }
  return data
}

// TODO: There is issue with Momoent type set, need to be come out a better version
update.extend('$auto', (value, object) => {
  return object ? update(object, value) : update({}, value)
})
update.extend('$autoArray', (value, object) => {
  return object ? update(object, value) : update([], value)
})
const immutaeMerge = (fields, st, deep = 0) => {
  // console.log(fields, st)
  // console.log(deep)
  // if (deep >= 9) {
  //   console.log('watch')
  // }
  const returnVal = {}
  if (moment.isMoment(fields)) {
    return { $set: fields }
  }
  for (let field in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, field)) {
      if (st) {
        if (
          fields[field] !== undefined &&
          !lodash.isEqual(fields[field], st[field])
        ) {
          if (typeof fields[field] === 'object' && !!st[field]) {
            const newVal = immutaeMerge(fields[field], st[field], deep + 1)
            if (newVal) returnVal[field] = newVal
          } else {
            // returnVal[field] = { $set: fields[field] }
            if (Array.isArray(fields)) {
              // if (st[field]) {
              returnVal[field] = { $set: fields[field] }
              // } else {
              //   returnVal[field] = { $add: fields[field] }
              // }
            } else if (typeof fields[field] === 'function') {
              returnVal[field] = { $apply: fields[field] }
              // return { [field]: { $apply: fields[field] } }
            } else {
              returnVal[field] = { $set: fields[field] }
            }
          }
        }
      } else if (Array.isArray(fields)) {
        if (parseInt(field, 10) > 0) {
          return { [field]: immutaeMerge(fields[field]) }
        }
        if (fields.length > 0) {
          if (moment.isMoment(fields[0]) || typeof fields[0] === 'string') {
            return { $set: fields }
          }
          for (let index = 0; index < fields.length; index++) {
            let element = fields[index]
            fields[index] = immutaeMerge(element)
          }
        }

        return fields
      } else if (typeof fields[field] === 'object') {
        returnVal[field] = immutaeMerge(fields[field])
        // return { [field]: immutaeMerge(fields[field]) }
      } else if (typeof fields[field] === 'function') {
        returnVal[field] = { $apply: fields[field] }
        // return { [field]: { $apply: fields[field] } }
      } else if (Object.keys(fields).length > 1) {
        return { $set: fields }
      } else {
        return { $auto: { [field]: { $set: fields[field] } } }
      }
    }
  }
  if (deep === 0) {
    // console.log(returnVal)

    if (Object.keys(returnVal).length > 0) {
      return update(st, returnVal)
    }
    return st
  }
  if (Object.keys(returnVal).length > 0) {
    return returnVal
  } else if (Array.isArray(fields)) {
    // console.log(fields, st)
    return { $set: fields }
  }
  return {
    $set: {
      ...st,
      ...fields,
    },
  }
}
let timer

const duplicateCheck = ({
  query,
  message = 'This value already being used',
  logicCompare = (length) => {
    return length > 0
  },
}) => {
  return {
    validator: (rule, value, callback, source, options) => {
      clearTimeout(timer)
      if (!value) {
        callback()
        return
      }
      timer = setTimeout(() => {
        if (!value) {
          callback()
        } else {
          query(value)
            .then((response) => {
              const { success, data = {} } = response
              const { entities } = data
              if (success) {
                if (logicCompare(entities.length)) {
                  callback([
                    new Error(message),
                  ])
                } else {
                  callback()
                }
              }
              callback()
            })
            .catch(() => {
              callback()
            })
        }
      }, 500)
    },
  }
}

const getCurrentMenu = (menu) => {
  let path = location.pathname
  if (path === '/') {
    path = '/dashboard'
  }
  let current
  for (let index in menu) {
    if (menu[index].router && pathToRegexp(menu[index].router).exec(path)) {
      current = menu[index]
      break
    }
  }
  return current
}
function searchToObject () {
  let pairs = window.location.search.substring(1).split('&')

  let obj = {}

  let pair

  let i

  for (i in pairs) {
    if (Object.prototype.hasOwnProperty.call(pairs, i)) {
      if (pairs[i] === '') continue

      pair = pairs[i].split('=')
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
    }
  }

  return obj
}
function getFinalValue (obj) {
  if (Array.isArray(obj)) {
    return getFinalValue(obj[0])
  }
  if (typeof obj === 'object') {
    return getFinalValue(obj[Object.keys(obj)[0]])
  }
  return obj
}

function appendJSResource (targets = []) {
  targets.forEach((t) => {
    if (t.id && document.querySelector(`#${t.id}`)) {
      if (t.onload) t.onload(false)
      return true
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = t.src
    script.id = t.id
    // script.async = true
    script.onload = () => {
      if (t.onload) t.onload(true)
    }
    document.body.appendChild(script)
    return true
  })
}
function appendStyleResource (targets = []) {
  for (let index = 0; index < targets.length; index++) {
    const t = targets[index]
    if (t.id && document.querySelector(`#${t.id}`)) {
      if (t.onload) t.onload(false)
      continue
    }
    const style = document.createElement('link')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    style.href = t.href
    style.id = t.id
    // script.async = true
    style.onload = () => {
      if (t.onload) t.onload(true)
    }
    document.head.appendChild(style)
  }
}

const mobileAndTabletcheck = () => {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

const copyToClipboard = (str) => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
module.exports = {
  config,
  formatUrlPath,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  convertToQuery,
  convertToServerArray,
  mapFormFieldsToPostValues,
  mapPropsToFields,
  onValuesChange,
  formatDatetime,
  formatDatetimeInTimeZone,
  confirmAction,
  getDiffString,
  addPropToChild,
  deepDiffMapper,
  defaultFormBehavior,
  defaultContainerBehavior,
  sortAll,
  immutaeMerge,
  getUniqueId,
  getUniqueGUID,
  duplicateCheck,
  encryptString,
  decryptToString,
  encrypt,
  decrypt,
  getCurrentMenu,
  searchToObject,
  getFinalValue,
  appendJSResource,
  appendStyleResource,
  mobileAndTabletcheck,
  copyToClipboard,
}
