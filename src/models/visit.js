import router from 'umi/router'
import { createFormViewModel, createListViewModel } from 'medisys-model'
import * as service from '../services/visit'
import { getRemovedUrl, convertToQuery } from '@/utils/utils'

const openModal = {
  type: 'global/updateAppState',
  payload: {
    showVisitRegistration: true,
  },
}

const closeModal = {
  type: 'global/updateAppState',
  payload: {
    showVisitRegistration: false,
  },
}

export default createFormViewModel({
  namespace: 'visitRegistration',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      patientInfo: {},
      visitInfo: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (location) => {
        const { query } = location
        if (query.md === 'visreg') {
          query.vis
            ? dispatch({
                type: 'fetchVisitInfo',
                visitID: query.vis,
              })
            : dispatch({
                type: 'fetchPatientInfoByPatientID',
                payload: { patientID: query.pid },
              })

          dispatch(openModal)
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
            'vis',
            'acc',
            'refno',
            'new',
          ]),
        )
        yield put({
          type: 'updateState',
          payload: {
            visitInfo: {},
            patientInfo: {},
          },
        })
        return yield put(closeModal)
      },
      *fetchVisitInfo ({ visitID }, { call, put }) {
        const response = yield call(service.fetchVisitInfo, visitID)
        const { data = {} } = response
        console.log({ data })
        const { visit: { patientProfileFK = undefined } } = data

        const patientInfoResponse = patientProfileFK
          ? yield call(service.fetchPatientInfoByPatientID, patientProfileFK)
          : {}

        const { data: patientInfo = {} } = patientInfoResponse

        return yield put({
          type: 'updateState',
          payload: {
            visitInfo: data,
            patientInfo,
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
        const { status, data: { visit = {} } } = response
        if (status >= 200 && status < 300) {
          const { bizSessionFK } = visit
          return yield put({
            type: 'queueLog/fetchQueueListing',
            sessionID: bizSessionFK,
          })
        }
        return false
      },
      *saveVisitInfo ({ payload }, { call }) {
        const response = yield call(service.saveVisit, payload)
        const { status = -1 } = response
        return status >= 200 || status < 300
      },
      reducers: {},
    },
  },
})
