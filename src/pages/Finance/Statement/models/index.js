import { createListViewModel } from 'medisys-model'
import { queryFakeList } from '@/services/api'

import * as service from '../services'

export default createListViewModel({
  namespace: 'statement',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        paymentTerms: 0,
        adminChargeValueType: 'Percentage',
        statementInvoice: [],
      },
      invoiceList: [],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *queryInvoiceList ({ payload }, { call, put }) {
        const response = yield call(service.queryInvoiceList, payload)
        return response
        // yield put({
        //   type: 'queryInvoiceDone',
        //   payload: response,
        // })
      },

      *refreshStatement ({ payload }, { call, put }) {
        const response = yield call(service.refresh, payload)
        if (response === 204) {
          const res = yield call(service.query, payload)
          yield put({
            type: 'querySingleDone',
            payload: res,
          })
        }
      },

      *extractAsSingle ({ payload }, { call, put }) {
        const response = yield call(service.extract, payload)
        if (response === 204) {
          const res = yield call(service.query, payload)
          yield put({
            type: 'querySingleDone',
            payload: res,
          })
        }
      },
      *bizSessionList ({ payload }, { call, put }) {
        const response = yield call(service.queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status === '200' ? response.data : {},
        })
      },
    },
    reducers: {
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

      querySingleDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },

      queryInvoiceDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          invoiceList: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
      refreshDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
      updateBizSessionList (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          bizSessionList: data.map((x) => {
            return {
              value: x.id,
              name: x.sessionNo,
            }
          }),
        }
      },
    },
  },
})
