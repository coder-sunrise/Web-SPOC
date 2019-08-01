/* eslint-disable consistent-return */
import _ from 'lodash'

import {
  config as cfg,
  formatUrlPath,
  immutaeMerge,
  decrypt,
  cleanFieldValue,
} from 'medisys-util'
import update from 'immutability-helper'
import { notification } from '@/components'

import { getUniqueGUID } from '@/utils/utils'

const { prefix, openPages } = cfg

let lastLocation = null
export default class BaseCRUDViewModel {
  constructor (options) {
    this.options = options
  }

  create () {
    const { namespace, param, setting = {} } = this.options
    const { service, state, subscriptions, effects, reducers } = param
    return {
      state,
      subscriptions: {},
      effects: {
        ...this.effects({}),
        ...effects,
      },
      reducers: {
        ...this.reducers(),
        ...reducers,
      },
    }
  }

  subscriptions ({ dispatch, history }) {
    history.listen((location) => {
      // if (lastLocation && lastLocation.key === location.key) return
      // lastLocation = location
      // // console.log(location)
      // let bread
      // if (location.search) {
      //   const search = decrypt(location.search.substring(1))
      //   // console.log(search)
      //   if (search.resethistory) {
      //     dispatch({
      //       type: 'resetBreadHistory',
      //       payload: { location },
      //     })
      //   }
      //   bread = search.bread
      // }
      // // console.log(location)
      // const page = openPages.find((o) => location.pathname.toLowerCase() === o)
      // if (!localStorage.getItem('accessToken') && !page) {
      //   return
      // }
      // if (page) {
      //   return
      // }
      // dispatch({
      //   type: 'addBread',
      //   payload: {
      //     location,
      //     bread,
      //   },
      // })
    })
  }

  state () {
    return {
      // isTouched: false,
      // entity: null,
      // items: [],
      default: {},
    }
  }

  effects ({ queryFnName = '' }) {
    const { namespace, param, setting = {}, config = {} } = this.options
    const { service } = param
    const { detailPath = '' } = setting

    return {
      *query (
        { payload = { keepFilter: true, defaultQuery: false }, history },
        { call, put, select },
      ) {
        // console.log(namespace, queryFnName, payload, service)
        if (!service || !service[queryFnName]) return
        let filter = yield select((st) => st[namespace].filter)
        let exclude = yield select((st) => st[namespace].exclude)
        // const disableAutoQuery = yield select(st => st[namespace].disableAutoQuery)
        // if (!disableAutoQuery) {
        if (!payload.keepFilter) {
          filter = payload
          // yield put({
          //   type: 'queryBegin',
          //   payload: {
          //     filter,
          //   },
          // })
        }
        // console.log(filter)

        const { list = {} } = config
        filter = {
          ...filter,
          // queryExcludeFields: list.exclude || exclude,
        }
        console.log({ filter })
        const response = yield call(service[queryFnName], filter)
        // console.log(response)
        const { data, status, message } = response
        if (status === '200' || data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
              filter,
            },
          })
          yield put({
            type: 'queryDone',
            payload: {
              data,
            },
            history,
          })
        }
        return data
        // }
      },
      *upsert ({ payload, history }, { select, call, put }) {
        console.log('upsert', payload)
        const { cfg = {} } = payload
        const newPayload = cleanFieldValue(_.cloneDeep(payload))
        const r = yield call(service.upsert, newPayload)
        if (r) {
          let message = r.id ? 'Created' : 'Saved'
          if (cfg.message) {
            message = cfg.message
          }
          notification.success({
            // duration:0,`
            message,
          })
        }

        return r
      },
      *lock ({ payload, history }, { call, put, select, take }) {
        const s = yield select((st) => st[namespace])
        const { currentItem, newDetailPath } = s
        let data = currentItem
        if (data) {
          if (data.id === '00000000-0000-0000-0000-000000000000') {
            yield put({ type: 'create', payload })
            yield take('create/@@end')
            data = yield select((st) => st[namespace].currentItem)
            // console.log(data)
          } else {
            yield put({ type: 'update', payload })
            yield take('update/@@end')
          }
          const lockResponse = yield call(service.lock, { id: data.id })
          if (lockResponse.success) {
            // if (data.id === '00000000-0000-0000-0000-000000000000') {

            // } else {
            //   yield put({ type: 'query', payload: { keepFilter: true } })
            // }
            let path = detailPath
            // console.log(path)
            if (newDetailPath) {
              path = newDetailPath
            }
            // console.log(path)
            const handled = yield put({
              type: 'lockDone',
              payload: {
                response: lockResponse,
              },
              history,
            })
            if (!handled) history.push(formatUrlPath(path, { id: data.id }))
          } else {
            throw lockResponse
          }
        }
      },

      *unlock ({ payload, history }, { call, put }) {
        const response = yield call(service.unlock, payload)
        const { data, success } = response
        if (success) {
          yield put({ type: 'reset' })
          history.push(formatUrlPath(detailPath, { id: data.data }))
          yield put({
            type: 'updateState',
            payload: { shouldCompareListUpdate: true },
          })
        } else {
          throw response
        }
      },

      *updateAppState ({ payload }, { call, put }) {
        yield put({ type: 'updateState', payload })
      },

      *localAdd ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        if (payload.length) {
          yield put({
            type: 'updateState',
            payload: update(st, {
              items: {
                $unshift: payload.map((o) => {
                  return {
                    id: getUniqueGUID(),
                    ...o,
                  }
                }),
              },
            }),
          })
        }
        st = yield select((s) => s[namespace])
        return st.items
      },
      *localChange ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        let { items } = st
        const newItems = items.map((row) => {
          const n = payload[row.id] ? { ...row, ...payload[row.id] } : row
          return n
        })
        yield put({
          type: 'updateState',
          payload: update(st, {
            items: { $set: newItems },
          }),
        })
        st = yield select((s) => s[namespace])
        return st.items
      },
      *localDelete ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        let { items } = st
        // console.log(items)
        const newItems = items.filter(
          (row) => !payload.find((o) => o === row.id),
        )
        yield put({
          type: 'updateState',
          payload: update(st, {
            items: { $set: newItems },
          }),
        })
        st = yield select((s) => s[namespace])
        return st.items
      },
    }
  }

  reducers () {
    // update.extend('$auto', (value, object) => {
    //   return object ?
    //     update(object, value) :
    //     update({}, value)
    // })
    // update.extend('$autoArray', (value, object) => {
    //   return object ?
    //     update(object, value) :
    //     update([], value)
    // })
    const { namespace, param, setting = {}, config = {} } = this.options
    const { state } = param

    return {
      // Used for simple state update
      updateState (st, { payload }) {
        // console.log(payload)
        // const newVal = updateInner(payload, st)
        // return newVal
        return {
          ...st,
          ...payload,
        }
      },
      updateFilter (st, { payload }) {
        return {
          ...st,
          filter: {
            ...payload,
            timestamp: new Date().getTime(),
          },
        }
      },
      replaceState (st, { payload }) {
        return payload
      },
      // Used for complex state update, nested object update
      mergeState (st, { payload }) {
        // console.log(payload)
        // console.log('--------------------------------------------------------')
        // console.time('t')
        const newSt = immutaeMerge(payload, st)
        // console.timeEnd('t')

        // //console.log(newSt)
        // //console.log(st === newSt)
        return newSt
      },

      mergeStateWithImmutateData (st, { payload }) {
        return update(st, payload)
      },

      switchIsMotion (st) {
        return { ...st, isMotion: !st.isMotion }
      },

      queryBegin (st, { payload }) {
        const { filter } = payload
        return {
          ...st,
          filter,
        }
      },
      save (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          data,
        }
      },

      reset (st, { payload }) {
        return {
          ...st,
          entity: undefined,
        }
      },

      showModal (st, { payload }) {
        return { ...st, ...payload, modalVisible: true }
      },

      hideModal (st) {
        return { ...st, modalVisible: false }
      },

      created (st, { payload }) {
        // //console.log(payload)
        return {
          ...st,
          created: true,
          newCreatedId: payload.id,
        }
      },
    }
  }
}
