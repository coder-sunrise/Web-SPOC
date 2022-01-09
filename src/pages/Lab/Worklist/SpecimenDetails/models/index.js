import { createFormViewModel } from 'medisys-model'
import service from '../../services'

export default createFormViewModel({
  namespace: 'worklistSpecimenDetails',
  config: {},
  param: {
    service,
    state: { entity: { specimenOrders: [] } },
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {
      *queryDone({ payload }, { call, select, put, take }) {
        const { entity: specimenDetails } = yield select(
          st => st.worklistSpecimenDetails,
        )
        console.log('query done', specimenDetails)
        yield put({
          type: 'patient/query',
          payload: { id: specimenDetails.patientProfileFK },
        })

        yield take('patient/query/@@end')
      },
    },
    reducers: {},
  },
})
