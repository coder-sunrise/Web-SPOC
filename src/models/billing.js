// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import { getAppendUrl } from '@/utils/utils'
import * as service from '@/pages/Billing/services'
import { unlock } from '@/services/dispense'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'

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
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query, pathname } = location
        const { vid, v, pid, qid } = query

        if (pathname === '/reception/queue/billing' && Number(vid)) {
          dispatch({
            type: 'initState',
            payload: { visitID: Number(vid), pid: Number(pid), v, qid },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { select, put, take }) {
        const patientState = yield select((st) => st.patient)
        const queueLogState = yield select((st) => st.queueLog)
        if (!patientState.entity || patientState.entity.id !== payload.pid) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
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
      *showDispenseDetails ({ payload }, { select, put }) {
        const routing = yield select((st) => st.routing)

        return yield put({
          type: 'dispense/query',
          payload: {
            id: routing.location.query.vid,
            version: Date.now(),
          },
        })
      },
      *submit ({ payload }, { call, put }) {
        const { mode, ...restPayload } = payload
        return yield put({
          type: `${mode}`,
          payload: restPayload,
        })
      },
      *save ({ payload }, { call, put, take, select }) {
        const response = yield call(service.save, payload)
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
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

          if (visitStatus === 'COMPLETED') {
            sendQueueNotification({
              message: 'Visit completed.',
              queueNo: entity.queueNo,
            })
          } else {
            sendQueueNotification({
              message: 'Billing updated.',
              queueNo: entity.queueNo,
            })
          }
          return response
        }
        return false
      },
      // *complete ({ payload }, { call, put }) {
      //   const response = yield call(service.complete, payload)
      //   if (response) {
      //     yield put({ type: 'formik/clean', payload: 'BillingForm' })
      //     yield put({
      //       type: 'updateState',
      //       payload: {
      //         entity: null,
      //       },
      //     })
      //     notification.success({
      //       message: 'Billing completed',
      //     })
      //     router.push('/reception/queue')
      //   }
      // },
      *refresh ({ payload }, { put }) {
        yield put({
          type: 'query',
          payload: { id: payload.visitID },
        })
      },
      *backToDispense ({ payload }, { call, put, select, take }) {
        const billingState = yield select((state) => state.billing)
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
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
        // const response = yield put({
        //   type: 'dispense/unlock',
        //   payload: {
        //     id: billingState.visitID,
        //   },
        // })
        // yield take('dispense/unlock/@@end')

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
          })
          router.push(destinationUrl)
        }
      },
    },
    reducers: {
      addItems (state, { payload }) {
        return {
          ...state,
          invoiceItems: [
            ...state.invoiceItems,
            payload,
          ],
        }
      },
    },
  },
})
