import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'claimHistory',
  param: {
    service,
    state: {
      default: {},
      list: [],
    },
    subscriptions: {},
    effects: {},
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              balanceDays: o.dueDate
                ? Math.floor(
                    (moment(o.dueDate).startOf('day') -
                      moment().startOf('day')) /
                      (24 * 3600 * 1000),
                  )
                : undefined,
            }
          }),
        }
      },

      queryOneDone(st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            ...data,
            balanceDays: data.dueDate
              ? Math.floor(
                  (moment(data.dueDate).startOf('day') -
                    moment().startOf('day')) /
                    (24 * 3600 * 1000),
                )
              : undefined,
          },
        }
      },
    },
  },
})
