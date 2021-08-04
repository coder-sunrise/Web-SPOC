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
        const radiologyDetails = yield select(st => st.radiologyDetails)

        yield put({
          type: 'patient/query',
          payload: { id: radiologyDetails.entity.patientProfileFK },
        })

        yield take('patient/query/@@end')

        const patientInfo = yield select(st => st.patient)
      },
      *initState({ payload }, { call, select, put, take }) {},
    },
    reducers: {},
  },
})
