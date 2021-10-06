import { createFormViewModel } from 'medisys-model'
import { useSelector } from 'dva'
import { notification } from '@/components'
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
      *updateRadiologyWorkitem({ payload }, { put, select, call }) {
        const radiologyDetails = yield select(state => state.radiologyDetails)

        const response = yield call(service.upsert, payload)
        if (response === 204) {
          notification.success({ message: 'Saved successfully.' })
          return true
        }
        return false
      },

      *cancelRadiologyWorkitem({ payload }, { put, select, call }) {
        const radiologyDetails = yield select(state => state.radiologyDetails)

        const response = yield call(service.cancel, payload)
        if (response === 204) {
          notification.success({ message: 'Saved successfully.' })
          return true
        }
        return false
      },
    },
    reducers: {},
  },
})
