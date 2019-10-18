// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import { getRemovedUrl } from '@/utils/utils'
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
        payment: {
          paymentModes: [],
        },
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
        if (pathname === '/reception/queue/patientdashboard') {
          const { qid, vid, v, md2 } = query

          if (md2 === 'bill') {
            dispatch({
              type: 'initState',
              payload: { qid, visitID: vid, v },
            })
          }
        }
      })
    },
    effects: {
      *initState ({ payload }, { select, put }) {
        const patientInfo = yield select((st) => st.patient)
        yield put({
          type: 'query',
          payload: {
            id: payload.visitID,
          },
        })
        yield put({
          type: 'global/updateAppState',
          payload: {
            fullscreen: true,
            showBillingPanel: true,
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
      *closeModal ({ payload = { toDispensePage: false } }, { put }) {
        const { toDispensePage = false } = payload
        // router.push(
        //   getRemovedUrl([
        //     'md2',
        //     'cmt',
        //     'vid',
        //   ]),
        // )
        yield put({
          type: 'updateState',
          payload: {
            entity: undefined,
          },
        })
        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showBillingPanel: false,
            fullscreen: false,
          },
        })
        if (!toDispensePage) {
          yield put({
            type: 'patient/updateState',
            payload: { entity: null },
          })
          router.push('/reception/queue')
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
