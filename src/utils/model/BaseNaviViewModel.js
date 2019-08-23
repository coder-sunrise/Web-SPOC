import lodash from 'lodash'
import BaseListViewModel from './BaseListViewModel'

const naviItem = (st, action) => {
  const { pagination, list } = st
  const { currentItemIndex } = pagination
  let newIndex = 0
  if (action === 0) {
    newIndex = 0
  } else if (action === '-') {
    newIndex = list.length - 1
  } else {
    newIndex = currentItemIndex + action
    if (newIndex < 0) {
      newIndex = list.length + newIndex
    } else if (newIndex >= list.length) {
      newIndex = 0
    }
  }
  return {
    ...st,
    pagination: {
      ...pagination,
      currentItemIndex: newIndex,
    },
    currentItem: list[newIndex],
  }
}
export default class BaseNaviViewModel extends BaseListViewModel {
  constructor (options) {
    super(options)
    this.options = options
  }

  create () {
    const { namespace, param, setting } = this.options
    const { service, state, subscriptions, effects, reducers } = param

    return {
      namespace,
      state: {
        ...super.state(),
        // data: {},
        ...state,
      },

      subscriptions: {
        ...super.subscriptions(),
        ...subscriptions,
      },

      effects: {
        ...super.effects(),
        *create ({ payload }, { call, put }) {
          const response = yield call(service.create, payload)
          const { data } = response
          const { data: obj } = data
          if (response.success) {
            yield put({ type: 'queryOne', payload: { id: obj.id } })
          } else {
            throw response
          }
        },

        *update ({ payload }, { select, call, put }) {
          const id = yield select((st) => st[namespace].currentItem.id)
          const newEntity = { ...payload, id }
          const response = yield call(service.update, newEntity)
          if (response.success) {
            yield put({ type: 'queryOne', payload: { id } })
          } else {
            throw response
          }
        },

        *queryOne ({ payload }, { select, call, put }) {
          const response = yield call(service.query, { id: payload.id })
          const { data: newObj } = response
          const list = yield select((st) => st[namespace].list)
          const id = newObj.id
          let index = lodash.findIndex(list, { id })
          list.splice(index, 1, newObj)
          if (response.success) {
            yield put({
              type: 'updateState',
              payload: {
                list,
                modalType: 'update',
                currentItem: newObj,
                editingNew: false,
              },
            })
          } else {
            throw response
          }
        },
        ...effects,
      },

      reducers: {
        ...super.reducers(),
        new (st) {
          const { pagination, list = [] } = st
          list.push({})
          pagination.total += 1
          return {
            ...st,
            list,
            pagination,
          }
        },
        cancel (st) {
          const { pagination, list = [] } = st
          let newList = list
          if (!list[list.length - 1].id) {
            newList = list.slice(0, list.length - 1)
            pagination.total -= 1
          }
          return {
            ...st,
            list: newList,
            pagination,
          }
        },
        firstItem (st) {
          return naviItem(st, 0)
        },
        prevItem (st) {
          return naviItem(st, -1)
        },
        nextItem (st) {
          return naviItem(st, 1)
        },
        lastItem (st) {
          return naviItem(st, '-')
        },
        ...reducers,
      },
    }
  }
}
