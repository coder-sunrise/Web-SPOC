import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { fakeQueryDoneData } from '../variables'

export default createListViewModel({
  namespace: 'purchaseOrderDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        purchaseOrder: {
          poNo: 'PO/000001',
          poDate: moment(),
          status: 'Draft',
          gstEnabled: false,
          gstIncluded: false,
          invoiceGST: 0,
          invoiceTotal: 0,
        },
        rows: [],
        purchaseOrderMedicationItem: [],
        purchaseOrderVaccinationItem: [],
        purchaseOrderConsumableItem: [],
        purchaseOrderAdjustment: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/inventory/pr/pdodetails') === 0) {
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

    effects: {},

    reducers: {
      initState (state, { payload }) {
        const data = state.default
        return {
          ...state,
          entity: {
            ...data,
            rows: [],
          },
        }
      },

      fakeQueryDone (state, { payload }) {
        const { type } = payload
        const data = fakeQueryDoneData

        let itemRows = []
        podoOrderType.forEach((x) => {
          itemRows = itemRows.concat(
            (data[x.prop] || []).map((y) => {
              const d = {
                uid: getUniqueId(),
                type: x.value,
                code: y[x.itemFKName],
                name: y[x.itemFKName],
                isDeleted: false,
                ...y,
              }
              return x.convert ? x.convert(d) : d
            }),
          )
        })

        return {
          ...state,
          entity: {
            ...data,
            purchaseOrder: {
              ...data.purchaseOrder,
              status: type === 'dup' ? 'Draft' : data.purchaseOrder.status,
            },
            rows: itemRows,
          },
        }
      },

      upsertRow (state, { payload }) {
        let { rows } = state.entity
        if (payload.uid) {
          rows = rows.map((row) => {
            const n =
              row.uid === payload.uid
                ? {
                    ...row,
                    ...payload,
                  }
                : row
            return n
          })
        } else {
          const itemFK = podoOrderType.filter(
            (x) => x.value === payload.type,
          )[0].itemFKName
          rows.push({
            ...payload,
            [itemFK]: payload.itemFK,
            name: payload.itemFK,
            uom: payload.itemFK,
            uid: getUniqueId(),
            isDeleted: false,
          })
        }

        return {
          ...state,
          entity: {
            ...state.entity,
            rows: rows,
          },
        }
      },

      deleteRow (state, { payload }) {
        const { rows } = state.entity

        return {
          ...state,
          entity: {
            ...state.entity,
            // rows: rows.map((o) => {
            //   if (o.uid === payload) o.isDeleted = true
            //   return o
            // }),
            rows: rows.filter((x) => x.uid !== payload),
          },
        }
      },

      addAdjustment (state, { payload }) {
        let { purchaseOrderAdjustment } = state.entity

        const payloadData = {
          adjRemark: payload.adjRemark,
          adjType: payload.adjType,
          adjValue: payload.adjValue,
          adjDisplayAmount: payload.adjAmount,
        }

        purchaseOrderAdjustment.push({
          ...payloadData,
          id: getUniqueId(),
          isDeleted: false,
        })

        return {
          ...state,
          entity: {
            ...state.entity,
            purchaseOrderAdjustment: purchaseOrderAdjustment,
          },
        }
      },

      deleteAdjustment (state, { payload }) {
        return {
          ...state,
          entity: {
            ...state.entity,
            ...payload,
          },
        }
      },
    },
  },
})
