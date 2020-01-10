import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services/setup'
import { getUniqueId } from '@/utils/utils'

export default createListViewModel({
  namespace: 'dentalChartSetup',
  config: {},
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *post ({ payload }, { call, put }) {
        const r = yield call(
          service.post,
          payload.map((o) => ({
            chartMethodColorBlock: '',
            chartMethodText: '',
            chartMethodColorText: '',
            ...o,
            id: o.isNew ? undefined : o.id,
            effectiveStartDate: moment(),
            effectiveEndDate: moment('2099-12-31'),
          })),
        )
        console.log(r)
        if (r) {
          // notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },
    // reducers: {
    //   queryDone (st, { payload }) {
    //     const { data } = payload
    //     return {
    //       ...st,
    //       list: _.orderBy(data.data, 'sortOrder'),
    //     }
    //   },
    // },
  },
})
