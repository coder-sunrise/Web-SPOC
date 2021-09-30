import { createFormViewModel } from 'medisys-model'
import { useSelector } from 'dva'
import service from '../../services'

export default createFormViewModel({
  namespace: 'pharmacyDetails',
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
        const pharmacyDetails = yield select(st => st.pharmacyDetails)

        if (pharmacyDetails.entity) {
          yield put({
            type: 'patient/query',
            payload: { id: pharmacyDetails.entity.patientProfileFK },
          })
          yield take('patient/query/@@end')
        }
      },
      *initState({ payload }, { call, select, put, take }) {},
    },
    reducers: {},
  },
})
