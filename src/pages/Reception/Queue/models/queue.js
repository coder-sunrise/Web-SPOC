// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'

const MessageWrapper = ({ children }) => (
  <div>
    <h3>An error occured</h3>
    <h4>{children}</h4>
  </div>
)

export default createListViewModel({
  namespace: 'queueLog',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      patientList: [],
      visitPatientInfo: {},
    },
    subscriptions: {},
    effects: {
      *fetchPatientListByName ({ payload }, { call, put }) {
        try {
          const response = !payload
            ? yield call(service.fetchPatientList)
            : yield call(service.fetchPatientListByName, payload)
          const { data } = response
          return yield put({
            type: 'updatePatientList',
            payload: [
              ...data.data,
            ],
          })
        } catch (error) {
          notification.error({
            message: (
              <MessageWrapper>Failed to retrieve patient list</MessageWrapper>
            ),
            duration: 0,
          })
          return yield put({
            type: 'updatePatientList',
            payload: [],
          })
        }
      },
      *fetchPatientInfoByPatientID ({ payload }, { call, put }) {
        const response = yield call(
          service.fetchPatientInfoByPatientID,
          payload.patientID,
        )
        return yield put({
          type: 'updateVisitPatientInfo',
          payload: {
            ...response.data,
          },
        })
      },
      *registerVisitInfo ({ payload }, { call, put }) {
        const response = yield call(service.registerVisit, payload.visitInfo)
        return yield put({
          type: 'registerVisit',
          payload: {
            ...response.data.entities,
          },
        })
      },
    },
    reducers: {
      updateVisitPatientInfo (state, { payload }) {
        return {
          ...state,
          visitPatientInfo: { ...payload },
        }
      },
      updatePatientList (state, { payload }) {
        return {
          ...state,
          patientList: [
            ...payload,
          ],
        }
      },
      registerVisit (state, { payload }) {
        return { ...state }
      },
      showError (state, { payload }) {
        return { ...state, errorMessage: payload }
      },
    },
  },
})
