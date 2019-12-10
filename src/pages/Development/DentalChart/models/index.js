import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services'
import { getUniqueId } from '@/utils/utils'

const updateData = (data, payload) => {
  const { toothIndex, value, target, forceSelect } = payload
  const exist = data.find(
    (o) =>
      o.toothIndex === toothIndex && o.value === value && target === o.target,
  )
  if (value === 'clear')
    return _.reject(data, (o) => o.toothIndex === toothIndex)
  if (exist && !forceSelect) {
    data = _.reject(
      data,
      (o) =>
        o.toothIndex === toothIndex && o.value === value && target === o.target,
    )
  } else {
    data = _.reject(
      data,
      (o) =>
        o.value !== value && o.toothIndex === toothIndex && target === o.target,
    )
    data.push({
      ...payload,
      // id: getUniqueId(),
    })
  }

  return data
}
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
        {
          value: 'onlayveneer',
          toothIndex: 17,
          id: 'sys-gen--231',
        },
      ],
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      clean (state, { payload }) {
        let data = _.cloneDeep(state.data)

        return {
          ...state,
          data: _.reject(data, (o) => o.toothIndex === payload.toothIndex),
        }
      },

      toggleMultiSelect (state, { payload = [] }) {
        let data = _.cloneDeep(state.data)
        payload.map((o) => {
          data = updateData(data, o)
        })

        return {
          ...state,
          data,
        }
      },
      toggleSelect (state, { payload }) {
        return {
          ...state,
          data: updateData(_.cloneDeep(state.data), payload),
        }
      },
    },
  },
})
