import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import service from '../services'

export default createListViewModel({
  namespace: 'queueProcessor',
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        description: '',
      },
    },
    effects: {
      *cancelQueue({ payload }, { call, put }) {
        const result = yield call(service.remove, payload)
        if (result === 204) {
          notification.success({ message: 'Queue item has been canceled.' })
        }
      },
    },
    reducers: {
      queryDone(queuelisting, { payload }) {
        const { data } = payload
        return {
          ...queuelisting,
          list: data.data.map(o => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
