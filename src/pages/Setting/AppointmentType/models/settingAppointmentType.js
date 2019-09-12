import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingAppointmentType',
  config: {},
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment(),
          moment('2099-12-31'),
        ],
      },
    },
    subscriptions: {},
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
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
