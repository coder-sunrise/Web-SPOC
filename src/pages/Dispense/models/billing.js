// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import router from 'umi/router'
import { createListViewModel } from 'medisys-model'
import { getRemovedUrl } from '@/utils/utils'
import * as service from '../services'
import { query as queryPatient } from '@/services/patient'

export default createListViewModel({
  namespace: 'billing',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query, pathname } = location
        if (pathname === '/reception/queue') {
          const { pid, vis, md2 } = query

          if (md2 === 'bill') {
            dispatch({
              type: 'fetchPatientInfo',
              payload: { id: pid },
            })
          }
        }
      })
    },
    effects: {
      *closeBillingModal (_, { put }) {
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
            showBillingPanel: false,
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
