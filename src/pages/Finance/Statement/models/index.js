import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
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
        isAdminChargeIncludeGST: false,
        statementInvoice: [],
        statementDate: moment(),
        adminChargeValue: 0.0,
        adjustmentValueType: 'Percentage',
      },
      invoiceList: [],
      statementPaymentList: [],
      activeTab: '0',
      invoicePaymentList: [],
      statementNoList: undefined,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.startsWith('/finance/statement/details')) {
          dispatch({
            type: 'statement/setActiveTab',
            payload: {
              activeTab: query.t,
            },
          })
        }
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
      *refreshAll ({ payload }, { call, put }) {
        yield put({
          type: 'refreshStatement',
          payload,
        })
        yield put({
          type: 'queryPaymentHistory',
          payload,
        })
      },

      *refreshStatement ({ payload }, { call, put }) {
        const response = yield call(service.refresh, payload)
        if (response === 204) {
          const res = yield call(service.query, payload)
          yield put({
            type: 'queryOneDone',
            payload: res,
          })
          return true
        }
        return false
      },

      *extractAsSingle ({ payload }, { call, put }) {
        const response = yield call(service.extract, payload)
        if (response === 204) {
          const res = yield call(service.query, payload)
          yield put({
            type: 'queryOneDone',
            payload: res,
          })
          return true
        }
        return false
      },
      *bizSessionList ({ payload }, { call, put }) {
        const response = yield call(service.queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status === '200' ? response.data : {},
        })
      },

      *removeRow ({ payload }, { call, put }) {
        const result = yield call(service.remove, payload)
        if (result === 204) {
          notification.success({ message: 'Deleted' })
        }
      },
      *queryPaymentHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryPaymentHistory, payload)
        yield put({
          type: 'queryPaymentHistoryDone',
          payload: {
            statementPaymentList: response.data.statementPaymentList || [],
            invoicePaymentList: response.data.invoicePaymentList || [],
          },
        })
      },
      *queryRecentStatementNo ({ payload }, { call, put }) {
        const response = yield call(service.getLastStatementNo, payload)        
        yield put({
          type: 'getLastStatementNoDone',
          payload: response,
        })
      },
    },
    reducers: {
      setActiveTab (st, { payload }) {
        return { ...st, activeTab: payload.activeTab }
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
      queryPaymentHistoryDone (st, { payload }) {
        return {
          ...st,
          ...payload,
        }
      },
      refreshDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
      getLastStatementNoDone (st, { payload }) {
        const { data } = payload
        console.log(payload)
        return {
          ...st,
          statementNoList: data,
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
