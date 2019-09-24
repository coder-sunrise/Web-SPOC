import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingMedicationGroup',
  config: {},
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().toUTC().set({ hour: 0, minute: 0, second: 0 }),
          moment('2099-12-31')
            .toUTC()
            .set({ hour: 23, minute: 59, second: 59 }),
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              description:
                o.description === null || o.description === ''
                  ? '-'
                  : o.description,
              sortOrder:
                o.sortOrder === null || o.sortOrder === '' ? '-' : o.sortOrder,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
            }
          }),
        }
      },
    },
  },
})
