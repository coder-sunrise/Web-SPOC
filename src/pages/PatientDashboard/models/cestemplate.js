import { createListViewModel } from 'medisys-model'
import router from 'umi/router'
import _ from 'lodash'
import * as service from '../services/cestemplate'
import { sleep, removeFields } from '@/utils/utils'

export default createListViewModel({
  namespace: 'cestemplate',
  config: {},
  param: {
    service,
    state: {
      // currentId: '1',
    },
    subscriptions: ({ dispatch, history, ...restProps }) => {},
    effects: {
      *query ({ payload }, { call, put, select, take }) {
        const user = yield select((st) => st.user)
        const response = yield call(service.queryList, user.data.id)
        if (response.data) {
          yield put({
            type: 'updateState',
            payload: {
              list: response.data,
            },
          })
        }
      },

      *queryOne ({ payload }, { call, put, select, take }) {
        const response = yield call(service.queryOne, Number(payload))
        if (response.data) {
          const entity = response.data
          removeFields(entity, [
            'id',
            'clinicalObjectRecordFK',
            'concurrencyToken',
          ])
          return entity
        }
        return null
      },

      *create ({ payload }, { call, put, select, take }) {
        const { name } = payload
        const consultation = yield select((st) => st.consultation)
        const { entity } = consultation
        const cloneEntity = _.cloneDeep(entity)
        delete cloneEntity.corPatientNoteVitalSign
        delete cloneEntity.visitConsultationTemplate
        delete cloneEntity.concurrencyToken

        removeFields(cloneEntity, [
          'id',
          'clinicalObjectRecordFK',
          'concurrencyToken',
        ])

        return yield call(service.create, name, cloneEntity)
      },
      *update ({ payload }, { call, put, select, take }) {
        const consultation = yield select((st) => st.consultation)
        const { entity } = consultation
        const cloneEntity = _.cloneDeep(entity)
        delete cloneEntity.corPatientNoteVitalSign
        delete cloneEntity.visitConsultationTemplate
        delete cloneEntity.concurrencyToken

        removeFields(cloneEntity, [
          'id',
          'clinicalObjectRecordFK',
          'concurrencyToken',
        ])

        return yield call(service.update, Number(payload), cloneEntity)
      },
      *delete ({ payload }, { call, put, select, take }) {
        return yield call(service.delete, payload)
      },
    },
    reducers: {},
  },
})
