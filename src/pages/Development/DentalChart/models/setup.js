import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services/setup'
import { getUniqueId } from '@/utils/utils'
import { buttonConfigs } from '../variables'

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
export default createListViewModel({
  namespace: 'dentalChartSetup',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      rows:
        JSON.parse(localStorage.getItem('dentalChartSetup')) || buttonConfigs,

      treatments: [
        {
          id: '1',
          text: 'Filling',
          subItems: [
            {
              id: '2',
              text: 'Amalgam Filling',
            },
            {
              id: '7',
              text: 'XXXX',
            },
          ],
        },
        {
          id: '3',
          text: 'Tooth Extract',
          subItems: [
            {
              id: '4',
              text: 'Hello',
            },
          ],
        },
        {
          id: '5',
          text: 'Consult',
          subItems: [
            {
              id: '6',
              text: 'Hello',
            },
          ],
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
