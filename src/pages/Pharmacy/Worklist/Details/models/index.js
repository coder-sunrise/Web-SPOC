import { createFormViewModel } from 'medisys-model'
import { useSelector } from 'dva'
import { subscribeNotification } from '@/utils/realtime'
import service from '../../services'

export default createFormViewModel({
  namespace: 'pharmacyDetails',
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history, searchField }) => {
      history.listen(loct => {
        const { pathname } = loct
      })

      subscribeNotification('PharmacyOrderUpdate', {
        callback: response => {
          dispatch({
            type: 'updateOrderUpdate',
            payload: response,
          })
        },
      })

      subscribeNotification('PharmacyOrderDiscard', {
        callback: response => {
          dispatch({
            type: 'updateOrderDiscard',
            payload: response,
          })
        },
      })
    },

    effects: {
      *queryDone({ payload }, { call, select, put, take }) {
        const pharmacyDetails = yield select(st => st.pharmacyDetails)

        if (pharmacyDetails.entity) {
          yield put({
            type: 'patient/query',
            payload: { id: pharmacyDetails.entity.patientProfileFK },
          })
          yield take('patient/query/@@end')
        }
      },
      *initState({ payload }, { call, select, put, take }) {},

      *updateOrderUpdate({ payload }, { put, select }) {
        const user = yield select(state => state.user)
        const pharmacyDetails = yield select(state => state.pharmacyDetails)
        const { visitID, senderId, message } = payload
        const { entity } = pharmacyDetails || {}
        if (entity && entity.visitFK === visitID && senderId !== user.data.id)
          yield put({
            type: 'updateState',
            payload: {
              entity: {
                ...entity,
                isPharmacyOrderUpdate: true,
                isPharmacyOrderDiscard:false,
                updateMessage: message,
              },
            },
          })
      },
      *updateOrderDiscard({ payload }, { put, select }) {
        const user = yield select(state => state.user)
        const pharmacyDetails = yield select(state => state.pharmacyDetails)
        const { visitID, senderId, message } = payload
        const { entity } = pharmacyDetails || {}
        if (entity && entity.visitFK === visitID && senderId !== user.data.id)
          yield put({
            type: 'updateState',
            payload: {
              entity: {
                ...entity,
                isPharmacyOrderUpdate: false,
                isPharmacyOrderDiscard: true,
                updateMessage: message,
              },
            },
          })
      },
    },
    reducers: {},
  },
})
