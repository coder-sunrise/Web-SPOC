import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/referralPerson'

export default createListViewModel({
  namespace: 'settingReferralPerson',
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
      *getReferralSourceList ({ payload }, { call, put }) {
        try {
          const response = yield call(service.queryReferralSourceList, payload)
          const { data } = response
          return data
        } catch (error) {
          yield put({
            type: 'updateErrorState',
            payload: {
              referralSourceInfo: 'Failed to retrieve referral person list',
            },
          })
          return false
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
