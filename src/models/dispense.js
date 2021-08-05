import { history } from 'umi'
import { createFormViewModel } from 'medisys-model'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { notification } from '@/components'
import service from '../services/dispense'

export default createFormViewModel({
  namespace: 'dispense',
  config: {},
  param: {
    service,
    state: {
      loadCount: 0,
      totalWithGST: 0,
      visitID: undefined,
      servingPersons: [],
      default: {
        corAttachment: [],
        corPatientNoteVitalSign: [],
        invoice: {
          isGSTInclusive: false,
          invoiceAdjustment: [],
          invoiceItem: [],
        },
      },
      selectedWidgets: ['1'],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        if (pathname === '/reception/queue/dispense' && Number(query.vid)) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              visitID: Number(query.vid),
              pid: Number(query.pid),
              qid: Number(query.qid),
            },
          })
        }
      })
    },
    effects: {
      *initState({ payload }, { all, put, select, take }) {
        const { version, visitID, md2, qid } = payload
        const patientState = yield select(st => st.patient)

        yield put({
          type: 'updateState',
          payload: {
            visitID,
            patientID: payload.pid,
          },
        })

        if (
          payload.pid &&
          (!patientState.entity || patientState.entity.id !== payload.pid)
        ) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
            },
          })
          yield take('patient/query/@@end')
        }

        if (qid)
          yield put({
            type: 'visitRegistration/query',
            payload: { id: payload.qid, version: payload.v },
          })

        yield put({
          type: 'query',
          payload: {
            id: visitID,
            version,
          },
        })
        yield take('query/@@end')

        yield put({
          type: 'getServingPersons',
          payload: { visitFK: visitID },
        })
      },

      *addActualize({payload},{call,put}){
        const response = yield call(service.addActualize, payload)
        return response
      },

      *getActualize({payload},{call,put}){
        const response = yield call(service.getActualize, payload)
        return response
      },

      *cancelActualize({payload},{call,put}){
        const response = yield call(service.cancelActualize, payload)
        return response
      },

      *getServingPersons({payload},{call,put}){
        const response = yield call(service.getServingPersons, payload)
        if (response)
          yield put({
            type: 'updateState',
            payload: {
              servingPersons: response.data,
            },
          })
      },

      *setServingPerson({payload},{call,put}){
        const response = yield call(service.setServingPerson, payload)
        if (response)
          yield put({
            type: 'getServingPersons',
            payload: payload,
          })
      },

      *start({ payload }, { call, put }) {
        const response = yield call(service.create, payload.id)
        const { id } = response
        if (id) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })

          sendQueueNotification({
            message: 'Ready for dispensing.',
            queueNo: payload.queueNo,
          })
        }
        return response
      },
      *refresh({ payload }, { call, put }) {
        const response = yield call(service.refresh, payload)
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: Date.now(),
            },
          })
        }
        return response
      },

      *save({ payload }, { call }) {
        const response = yield call(service.save, payload)
        return response
      },
      *discard({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.remove, payload)
        if (response) {
          sendQueueNotification({
            message: 'Dispense discarded',
            queueNo: entity.queueNo,
          })
        }
        return response
      },
      *finalize({ payload }, { call, put, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.finalize, payload)
        if (response)
          yield put({
            type: 'closeModal',
            payload: {
              toBillingPage: true,
            },
          })
        sendQueueNotification({
          message: 'Dispense finalized. Waiting for payment.',
          queueNo: entity.queueNo,
        })
        return response
      },
      *unlock({ payload }, { call }) {
        const response = yield call(service.unlock, payload)
        return response
      },
      *closeModal({ payload = { toBillingPage: false } }, { call, put }) {
        const { toBillingPage = false } = payload

        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showDispensePanel: false,
            fullscreen: false,
          },
        })
        if (!toBillingPage) {
          yield put({
            type: 'updateState',
            payload: {
              entity: undefined,
            },
          })
          history.push('/reception/queue')
        }
      },

      *queryAddOrderDetails({ payload }, { call, put }) {
        const response = yield call(service.queryAddOrderDetails, {
          invoiceId: payload.invoiceId,
          isInitialLoading: payload.isInitialLoading,
        })

        if (response.status === '200') {
          yield put({
            type: 'getAddOrderDetails',
            payload: response,
          })
          return response.data
        }
        return false
      },

      *saveAddOrderDetails({ payload }, { call }) {
        const response = yield call(service.saveAddOrderDetails, payload)
        if (response === 204) {
          notification.success({ message: 'Saved' })
          return true
        }
        return false
      },

      *removeAddOrderDetails({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.removeAddOrderDetails, payload)
        if (response === 204) {
          notification.success({ message: 'Retail visit discarded' })
          sendQueueNotification({
            message: 'Retail visit discarded.',
            queueNo: entity.queueNo,
          })
          return true
        }
        return false
      },
      *discardBillOrder({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.removeBillFirstVisit, payload)
        if (response === 204) {
          notification.success({ message: 'Bill-First visit discarded' })
          sendQueueNotification({
            message: 'Bill-First visit discarded.',
            queueNo: entity.queueNo,
          })
          return true
        }
        return false
      },

      *updateShouldRefreshOrder({ payload }, { put, select }) {
        const user = yield select(state => state.user)
        const dispense = yield select(state => state.dispense)
        const { visitID, senderId } = payload
        const { entity = {} } = dispense || {}
        if (entity && entity.id === visitID && senderId !== user.data.id) {
          yield put({
            type: 'updateState',
            payload: {
              shouldRefreshOrder: true,
            },
          })
        }
      },
    },
    reducers: {
      incrementLoadCount(state) {
        return { ...state, loadCount: state.loadCount + 1 }
      },
      getAddOrderDetails(state, { payload }) {
        const { data } = payload
        return {
          ...state,
          addOrderDetails: data,
        }
      },
    },
  },
})
