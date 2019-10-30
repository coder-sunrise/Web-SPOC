import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { notification } from '@/components'
import { podoOrderType } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import { getPurchaseOrderStatusFK, getInvoiceStatusFK } from '../variables'

export default createFormViewModel({
  namespace: 'purchaseOrderDetails',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        purchaseOrder: {
          purchaseOrderNo: 'PO/000001',
          purchaseOrderDate: moment(),
          purchaseOrderStatusFK: 1,
          shippingAddress: '',
          IsGSTEnabled: false,
          IsGSTInclusive: false,
          gstAmount: 0,
          totalAmount: 0,
          adjustmentAmount: 0,
        },
        rows: [],
        purchaseOrderMedicationItem: [],
        purchaseOrderVaccinationItem: [],
        purchaseOrderConsumableItem: [],
        purchaseOrderAdjustment: [],
      },
      purchaseOrder: {
        purchaseOrderDate: moment(),
        purchaseOrderStatusFK: 1,
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

    effects: {
      *refresh ({ payload }, { put }) {
        yield put({
          type: 'queryPurchaseOrder',
          payload: { id: payload.id },
        })
      },
      *initializePurchaseOrder (_, { call, put, select }) {
        // Call API to get new PurchaseOrder#
        // const runningNumberResponse = yield call(service.queryRunningNumber, {
        //   prefix: 'PO',
        // })
        // const { data: poRunningNumber } = runningNumberResponse

        // Access clinicInfo from store
        let clinicAddress = ''
        let tempClinicAddress = []
        const clinicInfo = yield select((state) => state.clinicInfo)
        const { contact } = clinicInfo
        if (contact) {
          const {
            buildingName,
            blockNo,
            street,
            unitNo,
            postcode,
          } = contact.contactAddress[0]

          if (buildingName) tempClinicAddress.push(buildingName)
          if (blockNo) tempClinicAddress.push(blockNo)
          if (street) tempClinicAddress.push(street)
          if (unitNo) tempClinicAddress.push(unitNo)
          if (postcode) tempClinicAddress.push(postcode)
          clinicAddress = tempClinicAddress.join(', ')

          // clinicAddress = `${buildingName}, ${blockNo}, ${street}, ${unitNo}, ${postcode}`
        }

        const purchaseOrder = {
          // purchaseOrderNo: poRunningNumber, // Mock PurchaseOrder#
          purchaseOrderDate: moment(),
          // status: 'Draft',
          purchaseOrderStatusFK: 1,
          shippingAddress: clinicAddress,
          IsEnabledGST: false,
          IsGSTInclusive: false,
          gstAmount: 0,
          totalAmount: 0,
          adjustmentAmount: 0,
          exceptedDeliveryDate: '',
        }

        return yield put({
          type: 'setNewPurchaseOrder',
          payload: { purchaseOrder },
        })
      },
      *duplicatePurchaseOrder ({ payload }, { call, put }) {
        // Call API to query selected Purchase Order
        const response = yield call(service.queryById, payload.id)
        // Call API to get new PurchaseOrder#
        // const runningNumberResponse = yield call(service.queryRunningNumber, {
        //   prefix: 'PO',
        // })
        // const { data: poRunningNumber } = runningNumberResponse

        const { data } = response

        return yield put({
          type: 'setPurchaseOrder',
          payload: {
            ...data,
            // purchaseOrderNo: poRunningNumber, // Mock PurchaseOrder#
            purchaseOrderDate: moment(),
            purchaseOrderStatusFK: 1,
            purchaseOrderStatus: getPurchaseOrderStatusFK(1).name,
            IsEnabledGST: false,
            IsGSTInclusive: data.isGstInclusive,
            gstAmount: data.gstAmount,
            totalAmount: data.totalAmount,
            adjustmentAmount: 0,
          },
        })
      },
      *queryPurchaseOrder ({ payload }, { call, put }) {
        const response = yield call(service.queryById, payload.id)
        const { data } = response
        if (data && data.id) {
          return yield put({
            type: 'setPurchaseOrder',
            payload: { ...data },
          })
        }

        // If status != 200, handle error
        return yield put(
          {
            // type: 'setPurchaseOrder',
            // payload: { ...data },
          },
        )
      },
      *upsertWithStatusCode ({ payload }, { call }) {
        const r = yield call(service.upsertWithStatusCode, payload)
        let message = r ? 'Saved' : ''
        if (r) {
          notification.success({
            message,
          })
        }
        // else {
        //   notification.error({
        //     message,
        //   })
        // }
        return r
      },
    },
    reducers: {
      setNewPurchaseOrder (state, { payload }) {
        return {
          ...state,
          ...state.default,
          ...payload,
          rows: [],
          purchaseOrderMedicationItem: [],
          purchaseOrderVaccinationItem: [],
          purchaseOrderConsumableItem: [],
          purchaseOrderAdjustment: [],
        }
      },

      setPurchaseOrder (state, { payload }) {
        const { purchaseOrderAdjustment, purchaseOrderItem } = payload

        const itemRows = purchaseOrderItem.map((x) => {
          const itemType = podoOrderType.find(
            (y) => y.value === x.inventoryItemTypeFK,
          )

          return {
            ...x,
            uid: getUniqueId(),
            type: x.inventoryItemTypeFK,
            [itemType.itemFKName]: x[itemType.prop][itemType.itemFKName],
            code: x[itemType.prop][itemType.itemFKName],
            name: x[itemType.prop][itemType.itemFKName],
            uom: x[itemType.prop][itemType.itemFKName],
          }
        })

        return {
          ...state,
          purchaseOrder: {
            ...payload,
            invoiceStatusFK: payload.invoiceStatus
              ? getInvoiceStatusFK(payload.invoiceStatus).id
              : null,
            purchaseOrderStatusFK: getPurchaseOrderStatusFK(
              payload.purchaseOrderStatus,
            ).id,
          },
          purchaseOrderAdjustment: purchaseOrderAdjustment || [],
          rows: itemRows || [],
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
            sortOrder: rows.length + 1,
            isDeleted: false,
          })
        }

        return { ...state, rows }
      },

      deleteRow (state, { payload }) {
        const { rows } = state
        rows.find((v) => v.uid === payload).isDeleted = true
        return { ...state, rows }
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
          sequence: purchaseOrderAdjustment.length + 1,
          id: getUniqueId(),
          isDeleted: false,
          isNew: true,
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
