import update from 'immutability-helper'
import { fakeSubmitForm } from '@/services/api'
import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const namespace = 'addCreditNote'
const model = createFormViewModel({
  namespace,
  config: {
    queryOnLoad: true,
  },
  param: {
    service,
    state: {
      entity: {
        StockInOut: true,
        NetInvoiceAmount: 124.12,
        Date: moment(),
        Remarks: '',
        Items: [
          {
            Id: 1,
            Index: 0,
            Type: 'Service',
            Code: 'SVC001',
            Description: 'Sample Service 1',
            UnitPrice: 50,
            Qty: 1,
            Amount: 50,
          },
        ],
        EditingItems: [],
      },
    },
    subscriptions: {},
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
        // message.success('提交成功');
      },
      *add ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        payload = payload.map((row) => {
          return {
            ...row,
            ...{ Amount: row.UnitPrice * row.Qty },
          }
        })
        if (payload.length) {
          yield put({
            type: 'updateState',
            payload: update(st, {
              entity: { Items: { $unshift: payload } },
            }),
          })
        }
      },
      *change ({ payload }, { put, select }) {
        let st = yield select((s) => s[namespace])
        let { Items } = st.entity
        const newItems = Items.map((row) => {
          const n = payload[row.Id] ? { ...row, ...payload[row.Id] } : row
          n.Amount = n.UnitPrice * n.Qty
          return n
        })
        yield put({
          type: 'updateState',
          payload: update(st, {
            entity: { Items: { $set: newItems } },
          }),
        })
      },
      *delete ({ payload }, { put, select }) {
        // console.log(payload)
        let st = yield select((s) => s[namespace])
        let { Items } = st.entity
        const newItems = Items.filter(
          (row) => !payload.find((o) => o === row.Id),
        )
        yield put({
          type: 'updateState',
          payload: update(st, {
            entity: { Items: { $set: newItems } },
          }),
        })
      },
    },
    reducers: {},
  },
})

// console.log(model)

export default model
