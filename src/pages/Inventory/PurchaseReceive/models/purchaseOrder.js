import { createFormViewModel } from 'medisys-model'
import * as service from '../services'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { fakeQueryDoneData } from '../variables'

const InitialPurchaseOrderForm = {
  purchaseOrder: {
    poNo: 'PO/000001',
    poDate: moment(),
    status: 'Draft',
    IsEnabledGST: false,
    IsGSTInclusive: false,
    invoiceGST: 0,
    invoiceTotal: 0,
  },
  rows: [],
  purchaseOrderMedicationItem: [],
  purchaseOrderVaccinationItem: [],
  purchaseOrderConsumableItem: [],
  purchaseOrderAdjustment: [],
}

export default createFormViewModel({
  namespace: 'purchaseOrderDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      ...InitialPurchaseOrderForm,
      default: {},
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

    effects: {
      *refresh ({ payload }, { put }) {
        yield put({
          type: 'queryPurchaseOrder',
          payload: { id: payload.id },
        })
      },
      *initializePurchaseOrder (_, { call, put, select }) {
        // Call API to get new PurchaseOrder#

        // Access clinicInfo from store
        let clinicAddress = ''
        const clinicInfo = yield select((state) => state.clinicInfo)
        const { contact } = clinicInfo
        if (contact) {
          const { buildingName, blockNo, street, unitNo, postcode } = contact.contactAddress[0]
          clinicAddress = `${buildingName}, ${blockNo}, ${street}, ${unitNo}, ${postcode}`
        }

        const purchaseOrder = {
          poNo: 'PO/000001', // Mock PurchaseOrder#
          poDate: moment(),
          status: 'Draft',
          shippingAddress: clinicAddress,
          IsEnabledGST: false,
          IsGSTInclusive: false,
          invoiceGST: 0,
          invoiceTotal: 0,
        }

        return yield put({
          type: 'setNewPurchaseOrder',
          payload: { purchaseOrder },
        })
      },
      *duplicatePurchaseOrder ({ payload }, { call, put }) {
        // Call API to query selected Purchase Order
        // Call API to get new PurchaseOrder#

        let data = fakeQueryDoneData

        const purchaseOrder = {
          ...data.purchaseOrder,
          poNo: 'PO/000876', // Mock PurchaseOrder#
          poDate: moment(),
          status: 'Draft',
          IsEnabledGST: false,
          IsGSTInclusive: false,
          invoiceGST: 0,
          invoiceTotal: 0,
        }

        return yield put({
          type: 'setDuplicatePurchaseOrder',
          payload: { ...data, purchaseOrder },
        })
      },
      *queryPurchaseOrder ({ payload }, { call, put }) {
        // Call API to query selected Purchase Order
        // Call API to get new PurchaseOrder#
        let data = fakeQueryDoneData

        return yield put({
          type: 'setPurchaseOrder',
          payload: { ...data },
        })
      },
      *submitPurchaseOrder ({ payload }, { call, put }) {
        // Call API to submit Purchase Order 
        // Get return response

        return yield put({
          type: 'submitPurchaseOrderResult',
          payload: {
            id: 789,
            type: 'edit',
          },
        })
      },
    },

    reducers: {
      submitPurchaseOrderResult (state, { payload }) {
        return { ...state, ...payload }
      },

      setNewPurchaseOrder (state, { payload }) {
        return {
          ...state,
          ...InitialPurchaseOrderForm,
          ...payload,
        }
      },

      setDuplicatePurchaseOrder (state, { payload }) {
        let itemRows = []
        podoOrderType.map((x) => {
          itemRows = itemRows.concat(
            (payload[x.prop] || []).map((y) => {
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
          return null
        })

        return {
          ...state,
          ...payload,
          rows: itemRows,
        }
      },

      setPurchaseOrder (state, { payload }) {
        let itemRows = []
        podoOrderType.map((x) => {
          itemRows = itemRows.concat(
            (payload[x.prop] || []).map((y) => {
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
          return null
        })

        return {
          ...state,
          ...payload,
          rows: itemRows,
        }
      },

      upsertRow (state, { payload }) {
        let { rows } = state
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

        return { ...state, rows }
      },

      deleteRow (state, { payload }) {
        const { rows } = state
        return { ...state, rows: rows.filter((x) => x.uid !== payload) }
      },

      addAdjustment (state, { payload }) {
        let { purchaseOrderAdjustment } = state

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
          purchaseOrderAdjustment,
        }
      },

      deleteAdjustment (state, { payload }) {
        return { ...state, ...payload }
      },
    },
  },
})
