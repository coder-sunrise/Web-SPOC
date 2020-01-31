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
            effectiveStartDate: moment('2001-01-01'),
            effectiveEndDate: moment('2099-12-31'),
            ...o,
            id: o.isNew ? undefined : o.id,
          })),
        )
        // console.log(r)
        if (r) {
          // notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },
  },
})
