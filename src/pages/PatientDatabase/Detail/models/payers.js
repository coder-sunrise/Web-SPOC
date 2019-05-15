import update from 'immutability-helper'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const namespace = 'payers'
export default createFormViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      entity: {
        items: [],
      },
    },
    subscriptions: {},
    effects: {
      *add ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        if (payload.length) {
          yield put({
            type: 'updateState',
            payload: update(st, {
              entity: {
                items: {
                  $unshift: payload.map((o) => {
                    return {
                      Id: getUniqueId(),
                      ...o,
                    }
                  }),
                },
              },
            }),
          })
        }
      },
      *change ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        let { items } = st.entity
        const newItems = items.map((row) => {
          const n = payload[row.Id] ? { ...row, ...payload[row.Id] } : row
          return n
        })
        yield put({
          type: 'updateState',
          payload: update(st, {
            entity: { items: { $set: newItems } },
          }),
        })
      },
      *delete ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        let { items } = st.entity

        const newItems = items.filter(
          (row) => !payload.find((o) => o === row.Id),
        )
        yield put({
          type: 'updateState',
          payload: update(st, {
            entity: { items: { $set: newItems } },
          }),
        })
      },
      *submit ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
    },
    reducers: {},
  },
})
