import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import * as service from '../services/referralSource'

export default createListViewModel({
  namespace: 'settingReferralSource',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        description: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *deleteReferralSource ({ payload }, { call, put }) {
        const result = yield call(service.delete, payload)
        if (result === 204) {
          notification.success({ message: 'Deleted' })
        }
      },
    },
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
