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
        invoicePaymentModes: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query, pathname } = location
        if (pathname === '/reception/queue/patientdashboard') {
          const { pid, vis, md2 } = query

          if (md2 === 'bill') {
            dispatch({
              type: 'initState',
              payload: { pid, vis },
            })
          }
        }
      })
    },
    effects: {
      *initState ({ payload }, { put }) {
        // yield put({
        //   type: 'query',
        // })
        yield put({
          type: 'global/updateAppState',
          payload: {
            fullscreen: true,
            showBillingPanel: true,
          },
        })
      },
      *closeModal ({ payload }, { put }) {
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
      *fetchPatientInfo ({ payload }, { call, put }) {
        const response = yield call(queryPatient, payload)
        const { data } = response

        yield put({
          type: 'updateState',
          payload: {
            patientInfo: { ...data },
          },
        })
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
