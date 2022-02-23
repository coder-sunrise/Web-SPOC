import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import * as service from '../AttachmentDocument/services/patientAttachment'

export default createListViewModel({
  namespace: 'patientAttachment',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    effects: {
      *removeRow({ payload }, { call, put }) {
        const result = yield call(service.remove, payload)
        if (result === 204) {
          notification.success({ message: 'Deleted' })
        }
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
            }
          }),
        }
      },
    },
  },
})
