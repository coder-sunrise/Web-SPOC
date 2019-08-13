import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'
import { StatusIndicator } from '../variables'

const MessageWrapper = ({ children }) => (
  <div>
    <h3>An error occured</h3>
    <h4>{children}</h4>
  </div>
)

const InitialSessionInfo = {
  isClinicSessionClosed: true,
  id: '',
  // sessionNo: `${moment().format('YYMMDD')}-01`,
  sessionNo: 'N/A',
  sessionNoPrefix: '',
  sessionStartDate: '',
  sessionCloseDate: '',
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
      // queueListing: generateRowData().reduce(mergeGenderAndAge, [])
      queueListing: [],
      currentFilter: StatusIndicator.ALL,
      error: {
        hasError: false,
        message: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      // console.log('queueLog subscriptions')
      dispatch({
        type: 'global/subscribeNotification',
        payload: {
          type: 'Consultation',
          callback: () => {
            dispatch({
              type: 'fetchQueueListing',
            })
          },
        },
      })
      history.listen((location) => {
        console.log({ location })
      })
    },
    effects: {
      *startSession (_, { call, put }) {
        const response = yield call(service.startSession)
        const { data } = response
        if (data && data.id) {
          // start session successfully
          return yield put({
            type: 'updateSessionInfo',
            payload: { ...data },
          })
        }
        return yield put({
          type: 'toggleError',
          error: {
            hasError: true,
            message: 'Failed to start session.',
          },
        })
      },
      *endSession ({ sessionID }, { call, put }) {
        const response = yield call(service.endSession, sessionID)
        const { status } = response
        console.log({ response })
        if (status >= 204 && status < 400)
          // end session successfully, reset session info
          yield put({
            type: 'updateSessionInfo',
            payload: { ...InitialSessionInfo },
          })

        return status >= 204
      },
      *getSessionInfo (_, { call, put }) {
        const response = yield call(service.getActiveSession)
        const { status, data } = response
        // data = null when get session failed

        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data

          yield put({
            type: 'fetchQueueListing',
            sessionID: sessionData[0].id,
          })

          yield put({
            type: 'toggleError',
            error: { hasError: false, message: '' },
          })

          return yield put({
            type: 'updateSessionInfo',
            payload: { ...sessionData[0] },
          })
        }
        if (status >= 400)
          return yield put({
            type: 'toggleError',
            error: {
              hasError: true,
              message:
                'Failed to get session info. Please contact system Administrator',
            },
          })
        return true
      },
      *fetchQueueListing ({ visitStatus }, { select, call, put }) {
        const { sessionInfo } = yield select((state) => state.queueLog)

        if (sessionInfo) {
          const { id: sessionID } = sessionInfo

          const filterByStatus = visitStatus
            ? {
                prop: 'visitFkNavigation.visitStatus',
                val: visitStatus,
                opr: 'eql',
              }
            : {}
          const response = yield call(
            service.getQueueListing,
            sessionID,
            filterByStatus,
          )
          const { data: { data = [] } } = response

          return yield put({
            type: 'updateQueueListing',
            queueListing: data,
          })
        }
        return false
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
      *deleteQueueByQueueID ({ queueID }, { call }) {
        yield call(service.deleteQueue, queueID)
        return true
      },
    },
    reducers: {
      toggleError (state, { error = {} }) {
        return { ...state, error: { ...error } }
      },
      updateSessionInfo (state, { payload }) {
        return { ...state, sessionInfo: { ...payload } }
      },
      updatePatientList (state, { payload }) {
        return {
          ...state,
          patientList: [
            ...payload,
          ],
        }
      },
      updateQueueListing (state, { queueListing }) {
        return {
          ...state,
          queueListing,
        }
      },
      showError (state, { payload }) {
        return { ...state, errorMessage: payload }
      },
      updateFilter (state, { status }) {
        return { ...state, currentFilter: status }
      },
    },
  },
})
