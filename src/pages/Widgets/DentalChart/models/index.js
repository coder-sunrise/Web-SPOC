import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import * as service from '../services'
import { getUniqueId } from '@/utils/utils'
import { dateFormatLong } from '@/components'

const updateData = (data, payload) => {
  const {
    toothNo,
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
      o.toothNo === toothNo &&
      o.id === id &&
      target === o.target &&
      o.subTarget === subTarget &&
      o.name === name,
  )
  if (action.code === 'SYS01')
    return _.reject(data, (o) => o.toothNo === toothNo)

  if (deleted) {
    return _.reject(data, (o) => o.toothNo === toothNo && o.id === id)
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
          o.toothNo === toothNo &&
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
          o.toothNo === toothNo &&
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
    //     o.id !== id && o.toothNo === toothNo && target === o.target,
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
      mode: 'diagnosis',
      data: [],
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      clean (state, { payload }) {
        let data = _.cloneDeep(state.data)

        return {
          ...state,
          data: _.reject(data, (o) => o.toothNo === payload.toothNo),
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
      deleteTreatment (state, { payload }) {
        return {
          ...state,
          data: state.data.filter(
            (o) => o.action && o.action.dentalTreatmentFK !== payload.id,
          ),
        }
      },
    },
  },
})
