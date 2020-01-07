import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services'
import { getUniqueId } from '@/utils/utils'
import { dateFormatLong } from '@/components'

const updateData = (data, payload) => {
  const {
    toothIndex,
    id,
    action,
    target,
    forceSelect,
    name,
    subTarget,
    deleted,
    remark,
  } = payload
  // console.log(payload)
  // if (!name) return data
  // console.log(action)
  const exist = data.find(
    (o) =>
      o.toothIndex === toothIndex &&
      o.id === id &&
      target === o.target &&
      o.subTarget === subTarget &&
      o.name === name,
  )
  if (id === 'clear') return _.reject(data, (o) => o.toothIndex === toothIndex)

  if (deleted) {
    return _.reject(data, (o) => o.toothIndex === toothIndex && o.id === id)
  }
  // if (others.length > 0) {
  //   others.map((o) => (o.hide = true))
  // }
  if (exist) {
    if (remark) {
      exist.remark = payload.remark
    } else if (
      data.find(
        (o) =>
          o.toothIndex === toothIndex &&
          o.target === target &&
          o.subTarget === subTarget &&
          o.timestamp > exist.timestamp,
      ) ||
      forceSelect
    ) {
      exist.timestamp = Date.now()
    } else {
      data = _.reject(
        data,
        (o) =>
          o.toothIndex === toothIndex &&
          o.id === id &&
          target === o.target &&
          o.subTarget === subTarget &&
          o.name === name,
      )
    }
    // exist.timestamp = Date.now()
    // exist.hide = !exist.hide
  } else {
    // data = _.reject(
    //   data,
    //   (o) =>
    //     o.id !== id && o.toothIndex === toothIndex && target === o.target,
    // )
    data.push({
      remark: '',
      ...payload,
      timestamp: Date.now(),
      date: moment().format(dateFormatLong),
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
      showPedo: false,
      mode: 'diagnosis',
      // mode: 'treatment',

      data: [
        // {
        //   id: 'system-id-1',
        //   toothIndex: 11,
        //   id: 'topcell',
        // },
        // {
        //   id: 'onlayveneer',
        //   toothIndex: 17,
        //   id: 'sys-gen--231',
        // },
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
