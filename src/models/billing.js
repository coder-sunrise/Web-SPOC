import { history } from 'umi'
import { createFormViewModel } from 'medisys-model'
import { subscribeNotification } from '@/utils/realtime'
import { getAppendUrl } from '@/utils/utils'
import * as service from '@/pages/Billing/services'
import dispenseService from '@/services/dispense'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const { unlock } = dispenseService
export default createFormViewModel({
  namespace: 'billing',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        payments: [],
        invoice: {
          invoiceNo: '',
          invoiceRemark: '',
          totalAftAdj: 0,
          gstValue: 0,
          gstAmount: 0,
          totalAftGst: 0,
          invoiceItems: [],
        },
        invoicePayer: [],
        applicableSchemes: [],
        claimableSchemes: [],
        invoicePayment: [],
      },
    },
    subscriptions: ({ dispatch }) => {
      history.listen(async location => {
        const { query, pathname } = location
        const { vid, v, pid, qid } = query

        if (pathname === '/reception/queue/billing' && Number(vid)) {
          dispatch({
            type: 'initState',
            payload: { visitID: Number(vid), pid: Number(pid), v, qid },
          })
        }
      })

      subscribeNotification('EditedConsultation', {
        callback: response => {
          const { visitID, senderId } = response
          dispatch({
            type: 'updateShouldRefreshOrder',
            payload: {
              visitID,
              senderId,
            },
          })
          dispatch({
            type: 'dispense/updateShouldRefreshOrder',
            payload: {
              visitID,
              senderId,
            },
          })
        },
      })
    },
    effects: {
      *initState({ payload }, { select, put, take }) {
        const queueLogState = yield select(st => st.queueLog)

        if (payload.visitID) {
          yield put({
            type: 'billing/query',
            payload: {
              id: payload.visitID,
            },
          })
        }
        
        if (payload.pid) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
              version: Date.now(), // to query to latest patient info
            },
          })
          yield take('patient/query/@@end')
        }

        if (!queueLogState.sessionInfo.id) {
          yield put({
            type: 'queueLog/getCurrentActiveSessionInfo',
          })

          yield take('queueLog/getCurrentActiveSessionInfo/@@end')
        }

        if (payload.qid)
          yield put({
            type: 'visitRegistration/query',
            payload: { id: payload.qid, version: payload.v },
          })

        yield put({
          type: 'updateState',
          payload: {
            visitID: payload.visitID,
            patientID: payload.pid,
          },
        })
      },
      *showDispenseDetails({ payload }, { select, put }) {
        return yield put({
          type: 'dispense/query',
          payload: {
            id: history.location.query.vid,
            version: Date.now(),
          },
        })
      },
      *submit({ payload }, { call, put }) {
        const { mode, ...restPayload } = payload
        return yield put({
          type: `${mode}`,
          payload: restPayload,
        })
      },
      *save({ payload }, { call, put, take, select }) {
        const response = yield call(service.save, payload)
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration
        const { visitStatus } = payload
        if (response) {
          yield put({
            type: 'query',
            payload: {
              id: payload.visitId,
            },
          })
          yield take('billing/query/@@end')

          if (visitStatus === VISIT_STATUS.COMPLETED) {
            sendQueueNotification({
              message: 'Visit completed.',
              queueNo: entity.queueNo,
              visitID: entity.id,
              isBillingSaved: true,
            })
          } else {
            sendQueueNotification({
              message: 'Billing updated.',
              queueNo: entity.queueNo,
              visitID: entity.id,
              isBillingSaved: true,
            })
          }
          return response
        }
        return false
      },

      *refresh({ payload }, { put }) {
        yield put({
          type: 'query',
          payload: { id: payload.visitID },
        })
      },
      *backToDispense({ payload }, { call, put, select, take }) {
        const billingState = yield select(state => state.billing)
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const parameters = {
          v: Date.now(),
          vid: billingState.visitID,
          pid: billingState.patientID,
        }

        const destinationUrl = getAppendUrl(
          parameters,
          '/reception/queue/dispense',
        )

        const response = yield call(unlock, { id: billingState.visitID })
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: null,
              visitID: undefined,
              patientID: undefined,
            },
          })

          sendQueueNotification({
            message: 'Invoice unlocked. Ready for dispensing.',
            queueNo: entity.queueNo,
            visitID: entity.id,
            isBillingSaved: false,
          })
          history.push(destinationUrl)
        }
      },
      *updateShouldRefreshOrder({ payload }, { put, select }) {
        const user = yield select(state => state.user)
        const billing = yield select(state => state.billing)
        const { visitID, senderId } = payload
        const { entity } = billing || {}
        if (entity && entity.id === visitID && senderId !== user.data.id)
          yield put({
            type: 'updateState',
            payload: {
              shouldRefreshOrder: true,
            },
          })
      },
      *savePackageAcknowledge({ payload }, { call, put, take }) {
        const response = yield call(service.savePackageAcknowledge, payload)
        if (response) {
          yield put({
            type: 'query',
            payload: {
              id: payload.visitId,
            },
          })
          yield take('billing/query/@@end')

          return response
        }
        return false
      },
    },
    reducers: {
      addItems(state, { payload }) {
        return {
          ...state,
          invoiceItems: [...state.invoiceItems, payload],
        }
      },
    },
  },
})
