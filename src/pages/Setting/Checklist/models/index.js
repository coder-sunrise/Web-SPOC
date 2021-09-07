import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'settingChecklist',
  // config: {
  //   codetable: {
  //     message: 'Checklist updated',
  //     code: 'ctchecklist',
  //   },
  // },
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
      checklist: [
        {
          name: 'Observation 1',
          isAllowMultipleNature: false,
          natures: [
            { id: 1, name: 'nature 1' },
            { id: 2, name: 'nature 2' },
            { id: 3, name: 'nature 3 nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1nature 1' },
            { id: 4, name: 'nature 4' },
            { id: 5, name: 'nature 5' },
            { id: 6, name: 'nature 6' },
          ],
        },
        {
          name: 'Observation 2',
          isAllowMultipleNature: false,
          natures: [{ name: 'nature 1' }],
        },
      ],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
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
