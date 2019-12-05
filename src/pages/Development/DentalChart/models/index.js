import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services'
import { getUniqueId } from '@/utils/utils'

export default createFormViewModel({
  namespace: 'dentalChartComponent',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      data: [
        {
          id: 'system-id-1',
          toothIndex: 11,
          value: 'topcell',
        },
      ],
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      toggleSelect (state, { payload }) {
        let data = _.cloneDeep(state.data)
        console.log(payload)
        if (payload.id) {
          data = _.reject(data, (o) => o.id === payload.id)
        } else {
          data.push({
            ...payload,
            id: getUniqueId(),
          })
        }

        return {
          ...state,
          data,
        }
      },
    },
  },
})
