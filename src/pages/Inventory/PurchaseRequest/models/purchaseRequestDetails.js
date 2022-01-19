import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import { notification } from '@/components'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import service from '../services'
import { PURCHASE_REQUEST_STATUS } from '../variables'

export default createFormViewModel({
  namespace: 'purchaseRequestDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        purchaseRequest: {
          purchaseRequestDate: moment(),
          purchaseRequestStatusFK: PURCHASE_REQUEST_STATUS.DRAFT,
        },
        rows: [],
      },
      purchaseRequest: {
        purchaseRequestDate: moment(),
        purchaseRequestStatusFK: PURCHASE_REQUEST_STATUS.DRAFT,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/inventory/purchaserequest/details') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              type: query.type,
              id: Number(query.id),
            },
          })
        }
      })
    },

    effects: {
      *refresh({ payload }, { put }) {
        yield put({
          type: 'queryPurchaseRequest',
          payload: { id: payload.id },
        })
      },
      *initializePurchaseRequest(_, { call, put, select }) {
        const purchaseRequest = {
          purchaseRequestDate: moment(),
          purchaseRequestStatusFK: PURCHASE_REQUEST_STATUS.DRAFT,
        }

        return yield put({
          type: 'setNewPurchaseRequest',
          payload: { purchaseRequest },
        })
      },
      *queryPurchaseRequest({ payload }, { call, put }) {
        const response = yield call(service.queryById, { id: payload.id })
        const { data } = response
        if (data && data.id) {
          return yield put({
            type: 'setPurchaseRequest',
            payload: { ...data },
          })
        }
      },
      *savePR({ payload }, { call }) {
        const r = yield call(service.upsert, payload)
        if (r) {
          return r
        }
        return false
      },
    },
    reducers: {
      setNewPurchaseRequest(state, { payload }) {
        return {
          ...state,
          ...state.default,
          ...payload,
          rows: [],
        }
      },

      setPurchaseRequest(state, { payload }) {
        const { purchaseRequestItem = [] } = payload
        const itemRows = purchaseRequestItem.map(x => {
          return {
            ...x,
            type: x.itemTypeFK,
            code: x.itemFK,
            name: x.itemFK,
            uom: x.itemFK,
            uomString: x.uom,
            uid: getUniqueId(),
          }
        })
        return {
          ...state,
          purchaseRequest: {
            ...payload,
          },
          rows: itemRows || [],
        }
      },

      upsertRow(state, { payload }) {
        const { purchaseRequest, rows } = payload
        const newRows = rows.map((o, i) => {
          return {
            uid: getUniqueId(),
            ...o,
            sortOrder: i + 1,
          }
        })

        const returnValue = {
          ...state,
          purchaseRequest,
          rows: newRows,
        }

        return { ...returnValue }
      },

      deleteRow(state, { payload }) {
        const { rows } = state
        rows.find(v => v.uid === payload).isDeleted = true
        return { ...state, rows }
      },
    },
  },
})
