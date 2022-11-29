import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'settingCaseType',
  codetable: {
    message: 'Case Type updated',
    code: 'ctcasetype',
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
    effects: {},
    reducers: {
      queryDone(state, { payload }) {
        const { data } = payload

        return {
          ...state,
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
