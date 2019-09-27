// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createListViewModel } from 'medisys-model'
import { getRemovedUrl } from '@/utils/utils'
import * as service from '../services/dispense'
import { query as queryPatient } from '@/services/patient'
import { sendNotification } from '@/utils/realtime'

export default createListViewModel({
  namespace: 'dispense',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      patientInfo: {},
      invoiceItems: [
        {
          PRN: false,
          amount: 9,
          batchNo: '',
          category: 'Drug',
          consumptionMethod: '',
          discount: 0,
          discountType: '',
          dosage: '',
          dosageUnit: '',
          expireDate: '',
          frequency: '',
          instruction: '',
          itemCode: 'drug01',
          period: '',
          periodAmount: undefined,
          precautionOne: '',
          precautionThree: '',
          precautionTwo: '',
          quantity: 3,
          remark: '',
          scheme: 0,
          stock: '44',
          subTotal: 9,
          unitPrice: 3,
        },
        {
          PRN: false,
          amount: 6,
          batchNo: '',
          category: 'Drug',
          consumptionMethod: '',
          discount: 0,
          discountType: '',
          dosage: '',
          dosageUnit: '',
          expireDate: '',
          frequency: '',
          instruction: '',
          itemCode: 'drug02',
          period: '',
          periodAmount: undefined,
          precautionOne: '',
          precautionThree: '',
          precautionTwo: '',
          quantity: 4,
          remark: '',
          scheme: 0,
          stock: '44',
          subTotal: 8,
          unitPrice: 2,
        },
      ],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query, pathname } = location
        if (pathname === '/reception/queue') {
          const { pid, vis, md2 } = query
          if (md2 === 'disp') {
            dispatch({
              type: 'fetchPatientInfo',
              payload: { id: pid },
            })
          }
        }
      })
    },
    effects: {
      *startDispense ({ payload }, { call, put }) {
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
          yield put({
            type: 'queryDone',
            payload: {
              data: response,
            },
          })
          sendNotification('QueueListing', {
            message: `Dispense started`,
          })
        }
        return response
      },

      *closeDispenseModal (_, { put }) {
        router.push(
          getRemovedUrl([
            'md2',
            'cmt',
            // 'pid',
            'new',
          ]),
        )
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
            showDispensePanel: false,
            fullscreen: false,
          },
        })
        router.push('/reception/queue')
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
