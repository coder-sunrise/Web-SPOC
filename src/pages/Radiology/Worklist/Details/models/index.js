import { createFormViewModel } from 'medisys-model'
import { useSelector } from 'dva'
import service from '../../services'

export default createFormViewModel({
  namespace: 'radiologyDetails',
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history, searchField }) => {
      history.listen(loct => {
        const { pathname } = loct
      })
    },

    effects: {
      *queryDone({ payload }, { call, select, put, take }) {
        yield put({
          type: 'patient/query',
          payload: { id: 22 },
        })

        yield take('patient/query/@@end')

        const patientInfo = yield select(st => st.patient)
        const radiologyDetails = yield select(st => st.radiologyDetails)
      },
      *initState({ payload }, { call, select, put, take }) {},
    },
    reducers: {},
  },
})
