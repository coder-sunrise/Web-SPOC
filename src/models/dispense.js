import { history } from 'umi'
import { createFormViewModel } from 'medisys-model'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { notification } from '@/components'
import { getUniqueId, getTranslationValue } from '@/utils/utils'
import service from '../services/dispense'
import Authorized from '@/utils/Authorized'

const getDispenseItems = (clinicSettings, entity = {}) => {
  const {
    primaryPrintoutLanguage = 'EN',
    secondaryPrintoutLanguage = '',
  } = clinicSettings

  let orderItems = []
  const defaultItem = (item, groupName) => {
    return {
      ...item,
      stockBalance: item.quantity,
      dispenseGroupId: groupName,
      countNumber: 1,
      rowspan: 1,
      uid: getUniqueId(),
    }
  }

  const transactionDetails = item => {
    const {
      inventoryStockFK,
      batchNo,
      expiryDate,
      oldQty,
      transactionQty,
      uomDisplayValue,
      secondUOMDisplayValue,
    } = item
    return {
      dispenseQuantity: transactionQty,
      batchNo,
      expiryDate,
      stock: oldQty,
      stockFK: inventoryStockFK,
      uomDisplayValue,
      secondUOMDisplayValue,
    }
  }

  const generateFromTempDispenseInfo = (
    item,
    stock = 0,
    isDefault,
    primaryUOM,
    secondUOM,
  ) => {
    const { inventoryStockFK, batchNo, expiryDate, transactionQty } = item
    return {
      dispenseQuantity: transactionQty,
      batchNo,
      expiryDate,
      stock,
      stockFK: inventoryStockFK,
      uomDisplayValue: primaryUOM,
      secondUOMDisplayValue: secondUOM,
      isDefault,
      allowToDispense: true,
    }
  }

  const generateFromNormalConsumable = item => {
    const groupName = 'NormalDispense'
    if (
      (item.isPreOrder && !item.isChargeToday) ||
      (!item.isPreOrder && item.hasPaid)
    ) {
      orderItems.push({
        ...defaultItem(item, groupName),
        groupNumber: 1,
        groupRowSpan: 1,
      })
      return
    }
    if (item.isDispensedByPharmacy) {
      if (item.dispenseItem.length) {
        item.dispenseItem.forEach((di, index) => {
          orderItems.push({
            ...defaultItem(item, groupName),
            ...transactionDetails(di),
            stockBalance:
              item.quantity - _.sumBy(item.dispenseItem, 'transactionQty'),
            countNumber: index === 0 ? 1 : 0,
            rowspan: index === 0 ? item.dispenseItem.length : 0,
            uid: getUniqueId(),
            consumableStock: item.consumable?.consumableStock,
          })
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    } else {
      if (item.tempDispenseItem.length) {
        item.tempDispenseItem.forEach((di, index) => {
          const currentStock = (item.consumable?.consumableStock || []).find(
            s => s.id === di.inventoryStockFK,
          )
          orderItems.push({
            ...defaultItem(item, groupName),
            ...generateFromTempDispenseInfo(
              di,
              currentStock?.stock,
              currentStock?.isDefault,
              item.dispenseUOM,
            ),
            stockBalance:
              item.quantity - _.sumBy(item.tempDispenseItem, 'transactionQty'),
            countNumber: index === 0 ? 1 : 0,
            rowspan: index === 0 ? item.tempDispenseItem.length : 0,
            uid: getUniqueId(),
            consumableStock: item.consumable?.consumableStock,
          })
        })
      } else {
        const inventoryItemStock = _.orderBy(
          (item.consumable?.consumableStock || []).filter(
            s => s.isDefault || s.stock > 0,
          ),
          ['isDefault', 'expiryDate'],
          ['asc'],
        )
        let remainQty = item.quantity
        if (remainQty > 0 && item.consumable && inventoryItemStock.length) {
          inventoryItemStock.forEach((itemStock, index) => {
            const { id, batchNo, expiryDate, stock, isDefault } = itemStock
            if (remainQty > 0) {
              let dispenseQuantity = 0
              if (isDefault || remainQty <= stock) {
                dispenseQuantity = remainQty
                remainQty = -1
              } else {
                dispenseQuantity = stock
                remainQty = remainQty - stock
              }
              orderItems.push({
                ...defaultItem(item, groupName),
                dispenseQuantity: dispenseQuantity,
                batchNo,
                expiryDate,
                stock,
                stockFK: id,
                uomDisplayValue: item.dispenseUOM,
                isDefault,
                stockBalance: 0,
                countNumber: index === 0 ? 1 : 0,
                rowspan: 0,
                uid: getUniqueId(),
                allowToDispense: true,
                consumableStock: item.consumable?.consumableStock,
              })
            }
            const firstItem = orderItems.find(
              i =>
                i.type === item.type &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id &&
                i.countNumber === 1,
            )
            firstItem.rowspan = orderItems.filter(
              i =>
                i.type === item.type &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id,
            ).length
          })
        } else {
          orderItems.push(defaultItem(item, groupName))
        }
      }
    }
    const groupItems = orderItems.filter(
      oi => oi.type === item.type && oi.id === item.id,
    )
    groupItems[0].groupNumber = 1
    groupItems[0].groupRowSpan = groupItems.length
  }

  const sortOrderItems = [...(entity.consumable || [])]

  sortOrderItems.forEach(item => {
    generateFromNormalConsumable(item)
  })

  return orderItems
}

export default createFormViewModel({
  namespace: 'dispense',
  config: {},
  param: {
    service,
    state: {
      loadCount: 0,
      totalWithGST: 0,
      visitID: undefined,
      servingPersons: [],
      default: {
        corAttachment: [],
        corPatientNoteVitalSign: [],
        corEyeExaminations: [],
        invoice: {
          isGSTInclusive: false,
          invoiceAdjustment: [],
          invoiceItem: [],
        },
      },
      selectedWidgets: ['1'],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct

        if (pathname === '/reception/queue/dispense' && Number(query.vid)) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              visitID: Number(query.vid),
              pid: Number(query.pid),
              qid: Number(query.qid),
            },
          })
        }
      })
    },
    effects: {
      *initState({ payload }, { all, put, select, take }) {
        const { version, visitID, md2, qid } = payload
        const patientState = yield select(st => st.patient)

        yield put({
          type: 'updateState',
          payload: {
            visitID,
            patientID: payload.pid,
          },
        })
        if (payload.pid) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
              version: Date.now(),
            },
          })
          yield take('patient/query/@@end')
        }

        if (qid)
          yield put({
            type: 'visitRegistration/query',
            payload: { id: payload.qid, version: payload.v },
          })

        yield put({
          type: 'query',
          payload: {
            id: visitID,
            version,
          },
        })
        yield take('query/@@end')
      },

      *start({ payload }, { call, put }) {
        const response = yield call(service.create, payload)
        const { id } = response
        if (id) {
          //yield put({
          //  type: 'updateState',
          //  payload: {
          //entity: response,
          //version: payload.version,
          //  },
          //})

          sendQueueNotification({
            message: 'Ready for dispensing.',
            queueNo: payload.queueNo,
            visitID: id,
          })
        }
        return response
      },
      *refresh({ payload }, { call, put, select }) {
        yield put({
          type: 'query',
          payload: {
            id: payload,
          },
        })
      },

      *save({ payload }, { call }) {
        const response = yield call(service.save, payload)
        return response
      },
      *discard({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.remove, payload)
        if (response) {
          sendQueueNotification({
            message: 'Dispense discarded',
            queueNo: entity.queueNo,
            visitID: entity.id,
          })
        }
        return response
      },
      *finalize({ payload }, { call, put, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.finalize, payload)
        if (response)
          yield put({
            type: 'closeModal',
            payload: {
              toBillingPage: true,
            },
          })
        sendQueueNotification({
          message: 'Dispense finalized. Waiting for payment.',
          queueNo: entity.queueNo,
          visitID: entity.id,
        })
        return response
      },
      *unlock({ payload }, { call }) {
        const response = yield call(service.unlock, payload)
        return response
      },
      *closeModal({ payload = { toBillingPage: false } }, { call, put }) {
        const { toBillingPage = false } = payload

        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showDispensePanel: false,
            fullscreen: false,
          },
        })
        if (!toBillingPage) {
          yield put({
            type: 'updateState',
            payload: {
              entity: undefined,
            },
          })
          history.push('/reception/queue')
        }
      },

      *queryAddOrderDetails({ payload }, { call, put }) {
        const response = yield call(service.queryAddOrderDetails, {
          invoiceId: payload.invoiceId,
          isInitialLoading: payload.isInitialLoading,
        })

        if (response.status === '200') {
          yield put({
            type: 'getAddOrderDetails',
            payload: response,
          })
          return response.data
        }
        return false
      },

      *saveAddOrderDetails({ payload }, { call }) {
        const response = yield call(service.saveAddOrderDetails, payload)
        if (response === 204) {
          notification.success({ message: 'Saved' })
          return true
        }
        return false
      },

      *removeAddOrderDetails({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.removeAddOrderDetails, payload)
        return response === 204
      },
      *discardBillOrder({ payload }, { call, select }) {
        const visitRegistration = yield select(state => state.visitRegistration)
        const { entity } = visitRegistration

        const response = yield call(service.removeBillFirstVisit, payload)
        return response === 204
      },

      *updateShouldRefreshOrder({ payload }, { put, select }) {
        const user = yield select(state => state.user)
        const dispense = yield select(state => state.dispense)
        const { visitID, senderId } = payload
        const { entity = {} } = dispense || {}
        if (entity && entity.id === visitID && senderId !== user.data.id) {
          yield put({
            type: 'updateState',
            payload: {
              shouldRefreshOrder: true,
            },
          })
        }
      },

      *queryDone({ payload }, { put, select }) {
        const clinicSettings = yield select(st => st.clinicSettings)
        const dispense = yield select(st => st.dispense)
        let obj = dispense.entity
        const orderItems = getDispenseItems(clinicSettings.settings || {}, obj)
        const defaultExpandedGroups = _.uniqBy(
          orderItems,
          'dispenseGroupId',
        ).map(o => o.dispenseGroupId)
        yield put({
          type: 'updateState',
          payload: {
            entity: {
              ...obj,
              dispenseItems: orderItems,
              defaultExpandedGroups,
            },
          },
        })
      },
    },
    reducers: {
      incrementLoadCount(state) {
        return { ...state, loadCount: state.loadCount + 1 }
      },
      getAddOrderDetails(state, { payload }) {
        const { data } = payload
        return {
          ...state,
          addOrderDetails: data,
        }
      },
    },
  },
})
