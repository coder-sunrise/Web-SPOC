// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import { notification } from '@/components'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import * as service from '@/pages/Billing/services'
import { unlock } from '@/services/dispense'
import { query as queryPatient } from '@/services/patient'
import { sendNotification } from '@/utils/realtime'

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
        const { vid, v, pid } = query

        if (pathname === '/reception/queue/billing' && Number(vid)) {
          dispatch({
            type: 'initState',
            payload: { visitID: Number(vid), pid: Number(pid), v },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { select, put, take }) {
        const queueLogState = yield select((st) => st.queueLog)
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
      *save ({ payload }, { call, put, take }) {
        const response = yield call(service.save, payload)
        if (response) {
          yield put({
            type: 'query',
            payload: {
              id: payload.visitId,
            },
          })
          yield take('billing/query/@@end')
          sendNotification('QueueListing', {
            message: `Billing Updated`,
          })
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
          sendNotification('QueueListing', {
            message: 'Back To Dispense',
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
