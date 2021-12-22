import { createFormViewModel } from 'medisys-model'
import service from '../../services'

export default createFormViewModel({
  namespace: 'specimentDetails',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {
      *queryDone({ payload }, { call, select, put, take }) {
        // const radiologyDetails = yield select(st => st.radiologyDetails)
        console.log('query done')
        yield put({
          type: 'patient/query',
          payload: { id: 12 }, //TODO::Replace with actual patient id
        })

        yield take('patient/query/@@end')
      },
    },
    reducers: {},
  },
})
