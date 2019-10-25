// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import * as service from '../services'
import { query as queryPatient } from '@/services/patient'

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
        invoicePayers: [],
        applicableSchemes: [],
        claimableSchemes: [],
        invoicePaymentModes: [],
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
        const patientState = yield select((st) => st.patient)
        if (!patientState.entity) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
            },
          })
          yield take('patient/query/@@end')
        }
        yield put({
          type: 'query',
          payload: {
            id: payload.visitID,
          },
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
        const dispense = yield select((st) => st.dispense)

        if (dispense && !dispense.entity) {
          yield put({
            type: 'dispense/initState',
            payload: {
              visitID: routing.location.query.vid,
              version: routing.location.query.v,
            },
          })
        }
      },
      *refresh ({ payload }, { put }) {
        yield put({
          type: 'query',
          payload: { id: payload.visitID },
        })
      },
      *backToDispense ({ payload }, { put, select }) {
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

        const response = yield put({
          type: 'dispense/unlock',
          payload: {
            id: billingState.visitID,
          },
        })

        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: null,
              visitID: undefined,
              patientID: undefined,
            },
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
