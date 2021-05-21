import { createListViewModel } from 'medisys-model'
import { subscribeNotification } from '@/utils/realtime'
import service from '../services/roomAssignment'

export default createListViewModel({
  namespace: 'settingRoomAssignment',
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        description: '',
        list: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      subscribeNotification('ModelUpdated', {
        callback: () => {
          dispatch({
            type: 'settingRoomAssignment/query',
            payload: { pagesize: 9999 },
          })
        },
      })
    },
    effects: {},
    reducers: {
      queryOneDone(st, { payload }) {
        const { data } = payload
        data.effectiveDates = [data.effectiveStartDate, data.effectiveEndDate]
        return {
          ...st,
          entity: data,
        }
      },
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
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
