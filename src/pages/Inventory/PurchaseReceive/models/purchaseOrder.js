import { createListViewModel } from 'medisys-model'
import * as service from '../Details/DeliveryOrder/services'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'

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
          //status: 'Finalized',
          shippingAddress:
            '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
          gstEnabled: true,
          gstIncluded: false,
          invoiceGST: 10.7,
          invoiceTotal: 163.6,
        },
        rows: [],
        purchaseOrderMedicationItem: [
          {
            id: 1,
            inventoryMedicationFK: 35,
            uom: 35,
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 25.0,
            unitPrice: 25.0,

            isDeleted: false,
          },
        ],
        purchaseOrderVaccinationItem: [
          {
            id: 2,
            inventoryVaccinationFK: 10,
            uom: 10,
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 40.0,
            unitPrice: 40.0,

            isDeleted: false,
          },
        ],
        purchaseOrderConsumableItem: [
          {
            id: 3,
            inventoryConsumableFK: 8,
            uom: 8,
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0,
            totalAfterGst: 0.0,
            quantityReceived: 0,

            totalPrice: 48.0,
            unitPrice: 48.0,

            isDeleted: false,
          },
          {
            id: 4,
            inventoryConsumableFK: 10,
            uom: 10,
            orderQty: 1,
            bonusQty: 0,
            totalQty: 1,

            totalAfterAdjustments: 0.0, // tempSubTotal || totalPrice - itemLevelGST
            totalAfterGst: 0.0, // tempSubTotal + itemLevelGST
            quantityReceived: 1,

            totalPrice: 50.0,
            unitPrice: 50.0,

            isDeleted: false,
          },
        ],
        purchaseOrderAdjustment: [
          {
            id: 1,
            adjRemark: 'Adj 001',
            adjType: 'ExactAmount',
            adjValue: -24,
            sequence: 1,
            adjDisplayAmount: -24,
            isDeleted: false,
          },
          {
            id: 2,
            adjRemark: 'Adj 002',
            adjType: 'Percentage',
            adjValue: 10,
            sequence: 2,
            adjDisplayAmount: 13.9,
            isDeleted: false,
          },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/inventory/pr/pdodetails') === 0) {
          console.log('query', query)
          if (query.type === 'dup' || query.type === 'edit') {
            dispatch({
              type: 'updateState',
              payload: {
                type: query.type,
                id: Number(query.id),
              },
            })
          } else {
            dispatch({
              type: 'init',
            })
          }

          dispatch({
            type: 'queryClinicSetting',
          })
        }
      })
    },
    effects: {
      *queryClinicSetting ({ payload }, { call, put }) {
        //const response = yield call(queryOne, payload)
        yield put({
          type: 'clinicSettingResult',
          //payload: 'TBD',
          payload: {
            gstEnabled: true,
            gstRate: 7,
            clinicAddress:
              '24 Raffles Place, Clifford Centre, #07-02A, Singapore 048621',
          },
        })
      },
    },

    reducers: {
      clinicSettingResult (state, { payload }) {
        console.log('clinicSettingResult', payload)
        return {
          ...state,
          clinicSetting: { ...payload },
          default: {
            ...state.default,
            purchaseOrder: {
              ...state.default.purchaseOrder,
              shippingAddress: payload.clinicAddress,
              gstValue: payload.gstRate,
              gstEnabled: payload.gstEnabled,
            },
          },
        }
      },

      queryDone (state, { payload }) {
        const { data } = payload
        console.log('queryDone')
        return {
          ...state,
          list: [],
        }
      },

      init (state, { payload }) {
        //const data = payload
        const data = state.default
        console.log('init')

        return {
          ...state,
          entity: {
            ...state.default,
          },
        }
      },

      fakeQueryDone (state, { payload }) {
        console.log('fakeQueryDone', state)
        //const data = payload
        const data = state.default

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
            ...state.default,
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
          adjRemark: payload.remarks,
          adjType: payload.adjType,
          adjValue: payload.adjValue,
          adjDisplayAmount: payload.adjAmount,
        }

        purchaseOrderAdjustment.push({
          ...payloadData,
          id: getUniqueId(),
          isDeleted: false,
        })

        console.log('addAdjustment', purchaseOrderAdjustment)

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
