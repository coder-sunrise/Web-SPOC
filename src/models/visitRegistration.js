import router from 'umi/router'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/visit'
import { query as queryPatient } from '@/services/patient'
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
      entity: {},
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
                payload: { id: query.vis },
              })
            : dispatch({
                type: 'fetchPatientInfoByPatientID',
                payload: { id: query.pid },
              })
          // if (query.type !== undefined) {
          //   dispatch({
          //     type: 'setRegisterType',
          //   })
          // }
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
            'type',
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
      *fetchVisitInfo ({ payload }, { call, put, take }) {
        yield put({
          type: 'updateErrorState',
          errorKey: 'visitInfo',
          errorMessage: undefined,
        })
        try {
          const response = yield call(service.query, payload)
          const { data = {} } = response
          const { visit: { patientProfileFK } } = data

          if (patientProfileFK) {
            // const { patientProfileFK } = visit
            if (patientProfileFK) {
              const patientPayload = {
                id: patientProfileFK,
              }
              yield put({
                type: 'fetchPatientInfoByPatientID',
                payload: patientPayload,
              })
            }
            yield take('fetchPatientInfoByPatientID/@@end')
            yield put({
              type: 'updateState',
              payload: {
                visitInfo: data,
                attachmentOriList: [
                  ...data.visit.visitAttachment,
                ],
              },
            })
          }
        } catch (error) {
          console.log({ error })
          yield put({
            type: 'updateErrorState',
            payload: {
              visitInfo: 'Failed to retrieve visit info...',
            },
          })
        }
      },
      *fetchPatientInfoByPatientID ({ payload }, { call, put }) {
        try {
          const response = yield call(queryPatient, payload)
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
            payload: {
              patientInfo: 'Failed to retrieve patient info',
            },
          })
        }
      },
    },
    reducers: {
      updateErrorState (state, { payload }) {
        return {
          ...state,
          errorState: { ...state.errorState, ...payload },
        }
      },
    },
  },
})
