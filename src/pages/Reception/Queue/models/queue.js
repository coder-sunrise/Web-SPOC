// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'
import Error, { showErrorNotification } from '@/utils/error'

const MessageWrapper = ({ children }) => (
  <div>
    <h3>An error occured</h3>
    <h4>{children}</h4>
  </div>
)

const InitialSessionInfo = {
  isClinicSessionClosed: true,
  id: '',
  sessionNo: '',
  sessionNoPrefix: '',
  sessionStartDate: '',
  sessionCloseDate: '',
}

const _saveSessionID = (sessionID) => {
  localStorage.setItem('_sessionID', sessionID)
}

export default createListViewModel({
  namespace: 'queueLog',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      sessionInfo: { ...InitialSessionInfo },
      patientList: [],
      queueListing: [],
      visitPatientInfo: {},
    },
    subscriptions: {},
    effects: {
      *startSession (_, { call, put }) {
        const response = yield call(service.startSession)
        const { data } = response
        if (data && data.id) {
          // start session successfully
          _saveSessionID(data.id)
          return yield put({
            type: 'updateSessionInfo',
            payload: { ...data },
          })
        }
        return yield put({
          type: 'updateSessionInfo',
          payload: { ...InitialSessionInfo },
        })
      },
      *endSession (_, { call, put }) {
        const sessionID = localStorage.getItem('_sessionID')
        const response = yield call(service.endSession, sessionID)
        const { status } = response
        if (status === 204)
          // end session successfully, reset session info
          yield put({
            type: 'updateSessionInfo',
            payload: { ...InitialSessionInfo },
          })
        return status === 204
      },
      *getSessionInfo (_, { call, put }) {
        try {
          const sessionID = localStorage.getItem('_sessionID')
          const response = yield call(service.getSessionInfo, sessionID)
          // data = null when get session failed
          const { data } = response

          if (data)
            return yield put({
              type: 'updateSessionInfo',
              payload: { ...data },
            })
          throw Error('Failed to get session info', 400)
        } catch (error) {
          console.log('error', error)
          error.message && showErrorNotification(error.message, '')
          return false
        }
      },
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
      updateSessionInfo (state, { payload }) {
        return { ...state, sessionInfo: { ...payload } }
      },
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
