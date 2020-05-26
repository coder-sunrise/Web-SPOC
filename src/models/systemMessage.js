import { createListViewModel } from 'medisys-model'

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
      *queryList ({ payload }, { call, put, select }) {
        const { typeId, sorting = [], pagesize = 10, current = 1 } = payload
        const stMessage = yield select((st) => st.systemMessage)
        let filter = {}
        // let pagination = {}
        delete payload.typeId

        filter = stMessage[`filter${typeId}`]

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
              [`filter${typeId}`]: filter,
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

      *read ({ payload }, { call, put }) {
        const response = yield call(service.upsertRead, payload)
        if (response) {
          yield put({
            type: 'queryOneDone',
            payload: { data: response },
          })
          return true
        }
        return null
      },

      *dismiss ({ payload }, { call, put }) {
        const response = yield call(service.upsertDismiss, payload)
        if (response === 200) {
          // const res = yield call(service.query, payload)
          yield put({
            type: 'dismissDone',
            payload,
          })
          return true
        }
        return false
      },
    },
    reducers: {
      dismissDone (st, { payload }) {
        const { id } = payload
        const { list } = st

        for (let i in list) {
          if (list[i].id === id) {
            list[i].isDismissed = true
            break
          }
        }
        return {
          ...st,
          list,
        }
      },
      queryDone (st, { payload }) {
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

      queryOneDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },

      querySuccess (st, { payload = {} }) {
        const { data, typeId, version, keepFilter = true } = payload
        const datas = data.entities ? data.entities : data.data
        const list = [
          ...(st.list || []),
          ...datas,
        ]
        const filter = payload[`filter${typeId}`]
        const { sorting } = filter

        const cfg = {}
        if (version) {
          cfg.version = Number(version)
        }
        return {
          ...st,
          list,
          [`filter${typeId}`]: keepFilter ? filter : {},
          [`pagination${typeId}`]: {
            ...st[`pagination${typeId}`],
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
