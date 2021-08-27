import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import service from '../services'

const defaultFilterValues = {
  invoiceStartDate: moment()
    .add(-1, 'month')
    .formatUTC(),
  invoiceEndDate: moment()
    .set({ hour: 23, minute: 59, second: 59 })
    .formatUTC(false),
  outstandingBalanceStatus: 'yes',
  pagesize: 9999,
}

export default createListViewModel({
  namespace: 'billingDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
      filterValues: { ...defaultFilterValues },
      company: {},
      invoiceList: [],
      selectedRows: [],
      totalPaidAmount: 0,
    },
    effects: {
      *bizSessionList({ payload }, { call, put }) {
        const response = yield call(service.queryBizSession, payload)
        yield put({
          type: 'updateBizSessionList',
          payload: response.status === '200' ? response.data : {},
        })
      },
      *queryCompany({ payload }, { call, put }) {
        const response = yield call(service.queryCompany, payload)
        yield put({
          type: 'queryCompanyDone',
          payload: response.status === '200' ? response.data : {},
        })
        return true
      },
      *queryCoPayerInvoice({ payload }, { call, put }) {
        const response = yield call(service.queryCoPayerInvoice, payload)
        yield put({
          type: 'queryCoPayerInvoiceDone',
          payload: response.status === '200' ? response.data : [],
        })
      },
      // *addPayment({ payload }, { call, put }) {
      //   const response = yield call(service.queryCoPayerInvoice, payload)
      //   yield put({
      //     type: 'queryCoPayerInvoiceDone',
      //     payload: response.status === '200' ? response.data : [],
      //   })
      // },
    },
    reducers: {
      queryCompanyDone(state, { payload }) {
        return {
          ...state,
          company: payload,
        }
      },
      queryCoPayerInvoiceDone(state, { payload }) {
        return {
          ...state,
          invoiceList: payload.map(item => {
            return { ...item, payAmount: 0 }
          }),
          selectedRows: [],
          totalPaidAmount: 0,
        }
      },
      updateFilterValues(state, { payload }) {
        return {
          ...state,
          filterValues: payload,
        }
      },
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },
      updateBizSessionList(state, { payload }) {
        const { data } = payload
        return {
          ...state,
          bizSessionList: data.map(x => {
            return {
              value: x.id,
              name: x.sessionNo,
            }
          }),
        }
      },
      resetFilterValues(state, { payload }) {
        return {
          ...state,
          filterValues: { ...defaultFilterValues },
        }
      },
    },
  },
})
