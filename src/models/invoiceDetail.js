import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '@/services/invoice'
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