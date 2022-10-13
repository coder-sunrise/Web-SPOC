import { createFormViewModel } from 'medisys-model'
import service from '@/services/invoice'
import { INVOICE_VIEW_MODE } from '@/utils/constants'

const initialState = {
  currentId: undefined,
  entity: undefined,
  mode: INVOICE_VIEW_MODE.DEFAULT,
  default: {},
}

export default createFormViewModel({
  namespace: 'invoiceDetail',
  config: {},
  param: {
    service,
    state: { ...initialState },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/finance/invoice/details') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: Number(query.id),
            },
          })
        }
      })
    },
    effects: {
      *queryDone({ payload }, { call, put }) {
        const { data } = payload
        if (data && data.patientProfileFK) {
          yield put({
            type: 'patient/query',
            payload: {
              id: data.patientProfileFK,
            },
          })
        }
      },
      *saveEditInvoice({ payload }, { call, put, take }) {
        const response = yield call(service.saveEditInvoice, payload)
        if (response) {
          const { id } = response
          yield put({
            type: 'updateState',
            payload: {
              currentId: Number(id),
            },
          })
          yield put({
            type: 'invoiceDetail/query',
            payload: {
              id,
            },
          })
          yield take('invoiceDetail/query/@@end')

          yield put({
            type: 'invoicePayment/query',
            payload: {
              id,
            },
          })

          yield take('invoicePayment/query/@@end')
          yield put({
            type: 'invoiceDetail/updateState',
            payload: {
              mode: INVOICE_VIEW_MODE.DEFAULT,
            },
          })
        }
        return response
      },
    },
    reducers: {
      reset() {
        return { ...initialState }
      },
    },
  },
})
