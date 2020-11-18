import { createListViewModel } from 'medisys-model'
import * as service from '../services'
import { notification } from '@/components'

export default createListViewModel({
  namespace: 'patientPackageDrawdown',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
      })
    },
    effects: {
      *getPatientPackageDrawdown ({ payload }, { put, call }) {
        const { patientId } = payload
        const response = yield call(service.getPatientPackageDrawdown, patientId)

        const { data, status } = response
        if (status === '200') {
          yield put({
            type: 'setPatientPackageDrawdown',
            payload: data,
          })
          return data
        }
        return false
      },
      *savePatientPackage ({ payload }, { call, put, take }) {
        const response = yield call(service.savePatientPackage, payload)
        if (response) {
          notification.success({ message: 'Patient package saved' })
          yield put({
            type: 'getPatientPackageDrawdown',
            payload: {
              patientId: payload.patientId,
            },
          })
          yield take('patientPackageDrawdown/getPatientPackageDrawdown/@@end')
          
          return response
        }
        return false
      },
      *transferPatientPackage ({ payload }, { call }) {
        const response = yield call(service.transferPatientPackage, payload)
        return response
      },
    },
    reducers: {
      setPatientPackageDrawdown (state, { payload }) {
        return {
          ...state,
          list: payload.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
