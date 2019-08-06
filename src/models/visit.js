import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/visit'
import { getRemovedUrl } from '@/utils/utils'

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
      errorState: {},
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
            errorState: {},
          },
        })
        return yield put(closeModal)
      },
      *fetchVisitInfo ({ visitID }, { call, put }) {
        yield put({
          type: 'updateErrorState',
          errorKey: 'visitInfo',
          errorMessage: undefined,
        })
        try {
          const response = yield call(service.fetchVisitInfo, visitID)
          const { data = {} } = response

          const { visit: { patientProfileFK } } = data

          if (patientProfileFK) {
            // const { patientProfileFK } = visit
            const patientInfoResponse = patientProfileFK
              ? yield call(
                  service.fetchPatientInfoByPatientID,
                  patientProfileFK,
                )
              : {}

            const { data: patientInfo = {} } = patientInfoResponse

            yield put({
              type: 'updateState',
              payload: {
                visitInfo: data,
                attachmentOriList: [
                  ...data.visit.visitAttachment,
                ],
                patientInfo,
              },
            })
          }
        } catch (error) {
          console.log({ error })
          yield put({
            type: 'updateErrorState',

            errorKey: 'visitInfo',
            errorMessage: 'Failed to retrieve visit info...',
          })
        }
      },
      *fetchPatientInfoByPatientID ({ payload }, { call, put }) {
        try {
          const response = yield call(
            service.fetchPatientInfoByPatientID,
            payload.patientID,
          )
          const { data } = response

          yield put({
            type: 'updateState',
            payload: {
              patientInfo: { ...data },
            },
          })
        } catch (error) {
          yield put({
            type: 'updateErrorState',
            errorKey: 'patientInfo',
            errorMessage: 'Failed to retrieve patient info',
          })
        }
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
        // return true
      },
      *saveVisitInfo ({ payload }, { call }) {
        const response = yield call(service.saveVisit, payload)
        const { status = -1 } = response
        return status >= 200 || status < 300
        // return true
      },
    },
    reducers: {
      updateErrorState (state, { errorKey, errorMessage }) {
        return {
          ...state,
          errorState: { ...state.errorState, [errorKey]: errorMessage },
        }
      },
    },
  },
})
