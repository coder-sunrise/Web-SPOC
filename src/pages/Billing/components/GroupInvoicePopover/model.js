import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import { fetchVisitGroupStatusDetails } from '@/pages/Billing/services'

export default createListViewModel({
  namespace: 'groupInvoice',
  param: {
    state: {
      visitGroupStatusDetails: [],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *fetchVisitGroupStatusDetails({ payload }, { call, put, select, take }) {
        const response = yield call(fetchVisitGroupStatusDetails, payload)
        if (response) {
          const { entity } = yield select(st=> st.billing)
          yield put({
            type: 'updateState',
            payload: {
              visitGroupStatusDetails: response.data,
            },
          })
          yield put({
            type: 'billing/updateState',
            payload: {
              entity:{...entity,visitGroupStatusDetails:response.data},
            },
          })
          return response.data
        }
        return false
      },
    },
    reducers: {},
  },
})
