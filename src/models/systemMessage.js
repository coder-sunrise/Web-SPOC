import { createListViewModel } from 'medisys-model'
import moment from 'moment'

import * as service from '../services/systemMessage.js'

export default createListViewModel({
  namespace: 'systemMessage',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *queryList({ payload }, { call, put, select }) {
        const { typeId, sorting = [], pagesize = 10, current = 1 } = payload
        const stMessage = yield select((st) => st.systemMessage)
        let filter = {}
        delete payload.typeId

        filter = stMessage[ `filter${typeId}` ]

        filter = {
          sorting,
          pagesize,
          ...payload,
          current,
        }

        const response = yield call(service.queryList, filter)
        const { data, status } = response

        if (status === '200' || data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
              typeId,
              [ `filter${typeId}` ]: filter,
            },
          })
          yield put({
            type: 'queryDone',
            payload: {
              data,
            },
          })
        }

        return data
      },
      *received({ payload }, { call, put }) {
        const { id, isDeleted = false } = payload
        const filter = {
          id,
          pagesize: 1,
          group: [
            {
              lst_EffectiveStartDate: moment().formatUTC(false),
              isAlertAfterLogin: false,
              combineCondition: 'or',
            },
          ],
        }
        if (isDeleted) {
          yield put({
            type: 'receivedDone',
            payload: {
              id,
              isDeleted,
            },
          })
          return null
        }

        const response = yield call(service.queryList, filter)
        const { data, status } = response
        if (status === '200' || data) {
          yield put({
            type: 'receivedDone',
            payload: {
              id,
              isDeleted,
              data,
            },
          })
        }
        return data
      },

      *read({ payload }, { call, put }) {
        const response = yield call(service.upsertRead, payload)
        if (response) {
          yield put({ type: 'received', payload })
          yield put({
            type: 'queryOneDone',
            payload: { data: response },
          })
          return true
        }
        return null
      },

      *dismiss({ payload }, { call, put }) {
        const response = yield call(service.upsertDismiss, payload)
        if (response === 200) {
          yield put({ type: 'received', payload })
          yield put({
            type: 'dismissDone',
            payload: {
              ids: [
                payload.id,
              ],
            },
          })
          return true
        }
        return false
      },
      *dismissAll({ payload }, { call, put }) {
        const response = yield call(service.upsertDismissAll, payload)
        const { data = [], status } = response
        if (status === '200' && data.length > 0) {
          yield put({ type: 'received', payload: { id: data[ 0 ] } })
          yield put({
            type: 'dismissDone',
            payload: {
              ids: [
                ...data,
              ],
            },
          })
          return true
        }
        return false
      },
    },
    reducers: {
      dismissDone(st, { payload }) {
        const { ids } = payload
        const { list } = st
        for (let i in list) {
          if (ids.includes(list[ i ].id)) {
            list[ i ].isDismissed = true
          }
        }
        return {
          ...st,
          list,
        }
      },
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            list: data.data.map((o) => {
              return {
                ...o,
              }
            }),
          },
        }
      },

      queryOneDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
      receivedDone(st, { payload = {} }) {
        const { list, totalUnReadCount } = st
        const { isDeleted = false, id, data } = payload
        let newST = st
        if (isDeleted) {
          let deletedIsUnRead = false
          let systemMessageTypeFK
          const newList = list.reduce((pre, cur) => {
            if (cur.id === id) {
              deletedIsUnRead = !cur.isRead && !cur.isDismissed
              systemMessageTypeFK = cur.systemMessageTypeFK
              return pre
            }
            return [
              ...pre,
              cur,
            ]
          }, [])

          const pagination = st[ `pagination${systemMessageTypeFK}` ]
          newST = {
            ...st,
            list: newList,
            [ `pagination${systemMessageTypeFK}` ]: {
              ...pagination,
              totalRecords: pagination.totalRecords - 1,
            },
            totalUnReadCount: deletedIsUnRead
              ? totalUnReadCount - 1
              : totalUnReadCount,
          }
        } else {
          const datas = data.data
          if (datas && datas.length === 1) {
            const [
              entity,
            ] = datas
            const { systemMessageTypeFK } = entity
            const pagination = st[ `pagination${systemMessageTypeFK}` ]
            if (!list.some((f) => f.id === entity.id)) {
              newST = {
                ...st,
                list: [
                  entity,
                  ...list,
                ],
                [ `pagination${systemMessageTypeFK}` ]: {
                  ...pagination,
                  totalRecords: pagination.totalRecords + 1,
                },
                totalUnReadCount: entity.totalUnReadCount,
              }
            } else {
              const newList = list.reduce((pre, cur) => {
                if (cur.id === entity.id) {
                  return [
                    ...pre,
                    entity,
                  ]
                }
                return [
                  ...pre,
                  cur,
                ]
              }, [])

              newST = {
                ...st,
                list: newList,
                totalUnReadCount: entity.totalUnReadCount,
              }
            }
          }
        }
        return newST
      },
      querySuccess(st, { payload = {} }) {
        const { data, typeId, version, keepFilter = true } = payload
        const datas = data.entities ? data.entities : data.data
        const list = [
          ...(st.list || []),
          ...datas,
        ]
        const filter = payload[ `filter${typeId}` ]
        const { sorting } = filter

        const cfg = {}
        if (version) {
          cfg.version = Number(version)
        }
        return {
          ...st,
          list,
          totalUnReadCount:
            datas.length > 0 ? datas[ 0 ].totalUnReadCount : st.totalUnReadCount,
          [ `filter${typeId}` ]: keepFilter ? filter : {},
          [ `pagination${typeId}` ]: {
            ...st[ `pagination${typeId}` ],
            current: data.currentPage || 1,
            pageSize: data.pageSize || 10,
            totalRecords: data.totalRecords,
            sorting,
          },
          ...cfg,
        }
      },
    },
  },
})
