import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import { rgType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import service from '../services'
import { getReceivingGoodsStatusFK, getInvoiceStatusFK } from '../variables'

export default createFormViewModel({
  namespace: 'receivingGoodsDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        receivingGoods: {
          receivingGoodsDate: moment(),
          receivingGoodsStatusFK: 1,
          isGSTEnabled: false,
          isGSTInclusive: false,
          gstAmount: 0,
          totalAmount: 0,
          isClosed: false,
        },
        rows: [],
        receivingGoodsMedicationItem: [],
        receivingGoodsVaccinationItem: [],
        receivingGoodsConsumableItem: [],
      },
      receivingGoods: {
        receivingGoodsDate: moment(),
        receivingGoodsStatusFK: 1,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, query = {} } = loct
        if (pathname.indexOf('/inventory/rg/rgdetails') === 0) {
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
          type: 'queryReceivingGoods',
          payload: { id: payload.id },
        })
      },
      *initializeReceivingGoods(_, { put, select }) {
        const user = yield select(state => state.user)
        const receivingGoods = {
          receivingGoodsDate: moment(),
          receivingGoodsStatusFK: 1,
          isGSTEnabled: false,
          isGSTInclusive: false,
          gstAmount: 0,
          totalAmount: 0,
          totalAftGST: 0,
          createByUser: user.data.clinicianProfile.name,
          createDate: moment(),
        }

        return yield put({
          type: 'setNewReceivingGoods',
          payload: { receivingGoods },
        })
      },
      *duplicateReceivingGoods({ payload }, { call, put, select }) {
        // Call API to query selected Receiving Goods
        const response = yield call(service.queryById, payload.id)
        const { data } = response
        const user = yield select(state => state.user)
        return yield put({
          type: 'setReceivingGoods',
          payload: {
            ...data,
            receivingGoodsNo: undefined,
            receivingGoodsDate: moment(),
            receivingGoodsStatusFK: 1,
            receivingGoodsStatus: getReceivingGoodsStatusFK(1).name,
            invoiceDate: undefined,
            invoiceNo: undefined,
            remark: undefined,
            invoiceStatusFK: undefined,
            inventoryTransactionFK: undefined,
            cancellationDate: undefined,
            writeOffReason: undefined,
            isClosed: false,
            invoiceStatus: '',
            closeByUserFK: undefined,
            closeDate: undefined,
            createDate: moment(),
            createByUser: user.data.clinicianProfile.name,
            receivingGoodsPayment: [],
            receivingGoodsItem: (data.receivingGoodsItem || []).map(o => {
              return {
                ...o,
                inventoryTransactionItemFK: undefined,
                isACPUpdated: false,
                acpAfterUpdate: 0,
                acpBeforeUpdate: 0,
              }
            }),
          },
        })
      },
      *queryReceivingGoods({ payload }, { call, put }) {
        const response = yield call(service.queryById, payload.id)
        const { data } = response
        if (data && data.id) {
          return yield put({
            type: 'setReceivingGoods',
            payload: { ...data },
          })
        }

        return null
      },
      *unlockReceivingGoods({ payload }, { call }) {
        const r = yield call(service.unlockReceivingGoods, payload)
        let message = r ? 'Unlocked' : ''
        if (r) {
          notification.success({
            message,
          })
        }
        return r
      },
      *saveRG({ payload }, { call }) {
        const r = yield call(service.upsert, payload)
        if (r) {
          return r
        }
        return false
      },
    },
    reducers: {
      setNewReceivingGoods(state, { payload }) {
        return {
          ...state,
          ...state.default,
          ...payload,
          rows: [],
          receivingGoodsMedicationItem: [],
          receivingGoodsVaccinationItem: [],
          receivingGoodsConsumableItem: [],
        }
      },

      setReceivingGoods(state, { payload }) {
        const { receivingGoodsItem, receivingGoodsPayment } = payload
        const itemRows = receivingGoodsItem.map(x => {
          const itemType = rgType.find(y => y.value === x.inventoryItemTypeFK)

          return {
            ...x,
            uid: getUniqueId(),
            type: x.inventoryItemTypeFK,
            [itemType.itemFKName]: x[itemType.prop][itemType.itemFKName],
            code: x[itemType.prop][itemType.itemFKName],
            name: x[itemType.prop][itemType.itemFKName],
            itemFK: x[itemType.prop][itemType.itemFKName],
            codeString: x[itemType.prop][itemType.itemCode],
            nameString: x[itemType.prop][itemType.itemName],
          }
        })

        return {
          ...state,
          receivingGoods: {
            ...payload,
            invoiceStatusFK: payload.invoiceStatus
              ? getInvoiceStatusFK(payload.invoiceStatus).id
              : null,
            receivingGoodsStatusFK: getReceivingGoodsStatusFK(
              payload.receivingGoodsStatus,
            ).id,
          },
          rows: itemRows || [],
          receivingGoodsPayment,
        }
      },
    },
  },
})
