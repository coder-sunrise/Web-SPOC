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
        const payload = {
          eql_IsClinicSessionClosed: false,
        }
        const response = yield call(service.getActiveSession, payload)

        const { status, data } = response
        // data = null when get session failed
        if (data && data.totalRecords === 1) {
          const { data: sessionData } = data
          yield put({
            type: 'query',
            payload: {
              pagesize: 999999,
              'eql_VisitFKNavigation.BizSessionFK': sessionData[0].id,
            },
          })

          yield put({
            type: 'toggleError',
            error: { hasError: false, message: '' },
          })

          yield put({
            type: 'updateSessionInfo',
            payload: { ...sessionData[0] },
          })
        }
        if (status >= 400)
          yield put({
            type: 'toggleError',
            error: {
              hasError: true,
              message:
                'Failed to get session info. Please contact system Administrator',
            },
          })
      },
      *deleteQueueByQueueID ({ queueID }, { call, put }) {
        const response = yield call(service.deleteQueue, queueID)
        console.log({ response })
        yield put({
          type: 'refresh',
        })
        return true
      },
      *refresh (_, { select, put }) {
        const queueLogState = yield select((state) => state.queueLog)
        const { currentFilter, sessionInfo } = queueLogState
        const filter =
          currentFilter !== StatusIndicator.ALL
            ? {
                'visitFkNavigation.visitStatus': currentFilter,
              }
            : {}
        yield put({
          type: 'query',
          payload: {
            pagesize: 999999,
            'eql_VisitFKNavigation.BizSessionFK': sessionInfo.id,
            ...filter,
          },
        })
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
      showError (state, { payload }) {
        return { ...state, errorMessage: payload }
      },
      updateFilter (state, { status }) {
        return { ...state, currentFilter: status }
      },
    },
  },
})
