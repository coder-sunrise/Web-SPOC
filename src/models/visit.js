import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/visit'
import { getRemovedUrl } from '@/utils/utils'

export default createFormViewModel({
  namespace: 'visitRegistration',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      patientInfo: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query } = location
        if (query.md === 'visreg' && query.cmt) {
          dispatch({
            type: 'fetchPatientInfoByPatientID',
            payload: { patientID: query.cmt },
          })
          dispatch({
            type: 'global/updateAppState',
            payload: {
              showVisitRegistration: true,
            },
          })
        }
      })
    },
    effects: {
      *closeModal (_, { put }) {
        router.push(
          getRemovedUrl([
            'md',
            'cmt',
            'pid',
            'new',
          ]),
        )
        return yield put({
          type: 'global/updateAppState',
          payload: {
            showVisitRegistration: false,
          },
        })
      },
      *fetchPatientInfoByPatientID ({ payload }, { call, put }) {
        const response = yield call(
          service.fetchPatientInfoByPatientID,
          payload.patientID,
        )

        return yield put({
          type: 'updateState',
          payload: {
            patientInfo: { ...response.data },
          },
        })
      },
      *registerVisitInfo ({ payload }, { call, put }) {
        const response = yield call(service.registerVisit, payload)

        return yield put({
          type: 'registerVisit',
          payload: {},
        })
      },
      reducers: {},
    },
  },
})
