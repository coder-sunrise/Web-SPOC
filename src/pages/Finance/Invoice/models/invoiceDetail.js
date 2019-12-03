import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { fakeInvoiceDetailData } from '../sampleData'

const initialState = {
  currentId: undefined,
  entity: undefined,
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
        if (
          pathname.indexOf('/finance/invoice/details') === 0 ||
          pathname.indexOf('/claim-submission/chas/invoice/details') === 0
        ) {
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
      *queryDone ({ payload }, { call, put }) {
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
    },
    reducers: {
      reset () {
        return { ...initialState }
      },
    },
  },
})
