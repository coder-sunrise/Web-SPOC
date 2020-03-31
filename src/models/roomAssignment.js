import { createListViewModel } from 'medisys-model'
import * as service from '../services/roomAssignment'
import { subscribeNotification } from '@/utils/realtime'

export default createListViewModel({
  namespace: 'settingRoomAssignment',
  config: {
    refreshModel: true,
  },
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
        callback: ({ modelName }) => {
          dispatch({
            type: `${modelName}/query`,
            payload: { pagesize: 9999 },
          })
        },
      })
    },
    effects: {},
    reducers: {
      queryOneDone (st, { payload }) {
        const { data } = payload
        data.effectiveDates = [
          data.effectiveStartDate,
          data.effectiveEndDate,
        ]
        return {
          ...st,
          entity: data,
        }
      },
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },
    },
  },
})
