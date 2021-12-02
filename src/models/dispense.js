import { history } from 'umi'
import { createFormViewModel } from 'medisys-model'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { notification } from '@/components'
import { getUniqueId, getTranslationValue } from '@/utils/utils'
import service from '../services/dispense'
import Authorized from '@/utils/Authorized'

const getDispenseItems = (codetable, clinicSettings, entity = {}) => {
  const {
    inventorymedication = [],
    inventoryconsumable = [],
    inventoryvaccination = [],
    ctmedicationunitofmeasurement = [],
  } = codetable

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

  const generateFromDrugmixture = item => {
    const drugMixtures = _.orderBy(
      item.prescriptionDrugMixture,
      ['sequence'],
      ['asc'],
    )
    drugMixtures.forEach(drugMixture => {
      const inventoryItem = inventorymedication.find(
        medication => medication.id === drugMixture.inventoryMedicationFK,
      )
      const detaultDrugMixture = {
        ...defaultItem(item, `DrugMixture-${item.id}`),
        drugMixtureFK: drugMixture.id,
        inventoryMedicationFK: drugMixture.inventoryMedicationFK,
        code: drugMixture.drugCode,
        name: drugMixture.drugName,
        quantity: drugMixture.quantity,
        dispenseUOM: drugMixture.uomDisplayValue,
        isDispensedByPharmacy: drugMixture.isDispensedByPharmacy,
        drugMixtureName: item.name,
        stockBalance: drugMixture.quantity,
        uid: getUniqueId(),
        medicationStock: inventoryItem?.medicationStock,
      }
      if (drugMixture.isDispensedByPharmacy) {
        if (drugMixture.dispenseItem.length) {
          drugMixture.dispenseItem.forEach((di, index) => {
            orderItems.push({
              ...detaultDrugMixture,
              ...transactionDetails(di),
              stockBalance:
                drugMixture.quantity -
                _.sumBy(drugMixture.dispenseItem, 'transactionQty'),
              countNumber: index === 0 ? 1 : 0,
              rowspan: index === 0 ? drugMixture.dispenseItem.length : 0,
              uid: getUniqueId(),
            })
          })
        } else {
          orderItems.push({
            ...detaultDrugMixture,
          })
        }
      } else {
        const uom =
          ctmedicationunitofmeasurement.find(
            m => m.id === inventoryItem?.dispensingUOM?.id,
          ) || {}
        const primaryUOMDisplayValue = getTranslationValue(
          uom.translationData,
          primaryPrintoutLanguage,
          'displayValue',
        )
        const secondUOMDisplayValue =
          secondaryPrintoutLanguage !== ''
            ? getTranslationValue(
                uom.translationData,
                secondaryPrintoutLanguage,
                'displayValue',
              )
            : ''

        const tempDispenseItem = (item.tempDispenseItem || []).filter(
          t => t.inventoryFK === drugMixture.inventoryMedicationFK,
        )
        if (tempDispenseItem.length) {
          tempDispenseItem.forEach((di, index) => {
            const currentStock = (inventoryItem?.medicationStock || []).find(
              s => s.id === di.inventoryStockFK,
            )
            orderItems.push({
              ...detaultDrugMixture,
              ...generateFromTempDispenseInfo(
                di,
                currentStock?.stock,
                currentStock?.isDefault,
                primaryUOMDisplayValue,
                secondUOMDisplayValue,
              ),
              stockBalance:
                drugMixture.quantity -
                _.sumBy(tempDispenseItem, 'transactionQty'),
              countNumber: index === 0 ? 1 : 0,
              rowspan: index === 0 ? tempDispenseItem.length : 0,
              uid: getUniqueId(),
            })
          })
        } else {
          const inventoryItemStock = _.orderBy(
            (inventoryItem?.medicationStock || []).filter(
              s => s.isDefault || s.stock > 0,
            ),
            ['isDefault', 'expiryDate'],
            ['asc'],
          )
          let remainQty = drugMixture.quantity
          if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
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
                  ...detaultDrugMixture,
                  dispenseQuantity: dispenseQuantity,
                  batchNo,
                  expiryDate,
                  stock,
                  stockFK: id,
                  uomDisplayValue: primaryUOMDisplayValue,
                  secondUOMDisplayValue: secondUOMDisplayValue,
                  isDefault,
                  stockBalance: 0,
                  countNumber: index === 0 ? 1 : 0,
                  rowspan: 0,
                  uid: getUniqueId(),
                  allowToDispense: true,
                })
              }
            })
            const firstItem = orderItems.find(
              i => i.drugMixtureFK === drugMixture.id && i.countNumber === 1,
            )
            firstItem.rowspan = orderItems.filter(
              i => i.drugMixtureFK === drugMixture.id,
            ).length
          } else {
            orderItems.push({
              ...detaultDrugMixture,
            })
          }
        }
      }
    })

    const groupItems = orderItems.filter(
      oi => oi.type === item.type && oi.id === item.id,
    )
    groupItems[0].groupNumber = 1
    groupItems[0].groupRowSpan = groupItems.length
  }

  const generateFromNormalMedication = item => {
    const groupName = 'NormalDispense'
    if (item.isPreOrder) {
      orderItems.push({
        ...defaultItem(item, groupName),
        groupNumber: 1,
        groupRowSpan: 1,
      })
      return
    }

    const inventoryItem = inventorymedication.find(
      drug => drug.id === item.inventoryMedicationFK,
    )

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
            medicationStock: inventoryItem?.medicationStock,
          })
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    } else {
      const uom =
        ctmedicationunitofmeasurement.find(
          m => m.id === inventoryItem?.dispensingUOM?.id,
        ) || {}
      const primaryUOMDisplayValue = getTranslationValue(
        uom.translationData,
        primaryPrintoutLanguage,
        'displayValue',
      )
      const secondUOMDisplayValue =
        secondaryPrintoutLanguage !== ''
          ? getTranslationValue(
              uom.translationData,
              secondaryPrintoutLanguage,
              'displayValue',
            )
          : ''
      if (item.tempDispenseItem.length) {
        item.tempDispenseItem.forEach((di, index) => {
          const currentStock = (inventoryItem?.medicationStock || []).find(
            s => s.id === di.inventoryStockFK,
          )
          orderItems.push({
            ...defaultItem(item, groupName),
            ...generateFromTempDispenseInfo(
              di,
              currentStock?.stock,
              currentStock?.isDefault,
              primaryUOMDisplayValue,
              secondUOMDisplayValue,
            ),
            stockBalance:
              item.quantity - _.sumBy(item.tempDispenseItem, 'transactionQty'),
            countNumber: index === 0 ? 1 : 0,
            rowspan: index === 0 ? item.tempDispenseItem.length : 0,
            uid: getUniqueId(),
            medicationStock: inventoryItem?.medicationStock,
          })
        })
      } else {
        const inventoryItemStock = _.orderBy(
          (inventoryItem?.medicationStock || []).filter(
            s => s.isDefault || s.stock > 0,
          ),
          ['isDefault', 'expiryDate'],
          ['asc'],
        )
        let remainQty = item.quantity
        if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
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
                uomDisplayValue: primaryUOMDisplayValue,
                secondUOMDisplayValue: secondUOMDisplayValue,
                isDefault,
                stockBalance: 0,
                countNumber: index === 0 ? 1 : 0,
                rowspan: 0,
                uid: getUniqueId(),
                allowToDispense: true,
                medicationStock: inventoryItem?.medicationStock,
              })
            }
          })
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

  const generateFromNormalConsumable = item => {
    const groupName = 'NormalDispense'
    if (item.isPreOrder) {
      orderItems.push({
        ...defaultItem(item, groupName),
        groupNumber: 1,
        groupRowSpan: 1,
      })
      return
    }

    const inventoryItem = inventoryconsumable.find(
      consumable => consumable.id === item.inventoryConsumableFK,
    )
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
            consumableStock: inventoryItem?.consumableStock,
          })
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    } else {
      if (item.tempDispenseItem.length) {
        item.tempDispenseItem.forEach((di, index) => {
          const currentStock = (inventoryItem?.consumableStock || []).find(
            s => s.id === di.inventoryStockFK,
          )
          orderItems.push({
            ...defaultItem(item, groupName),
            ...generateFromTempDispenseInfo(
              di,
              currentStock?.stock,
              currentStock?.isDefault,
              inventoryItem?.uom?.name,
            ),
            stockBalance:
              item.quantity - _.sumBy(item.tempDispenseItem, 'transactionQty'),
            countNumber: index === 0 ? 1 : 0,
            rowspan: index === 0 ? item.tempDispenseItem.length : 0,
            uid: getUniqueId(),
            consumableStock: inventoryItem?.consumableStock,
          })
        })
      } else {
        const inventoryItemStock = _.orderBy(
          (inventoryItem?.consumableStock || []).filter(
            s => s.isDefault || s.stock > 0,
          ),
          ['isDefault', 'expiryDate'],
          ['asc'],
        )
        let remainQty = item.quantity
        if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
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
                uomDisplayValue: inventoryItem?.uom?.name,
                isDefault,
                stockBalance: 0,
                countNumber: index === 0 ? 1 : 0,
                rowspan: 0,
                uid: getUniqueId(),
                allowToDispense: true,
                consumableStock: inventoryItem?.consumableStock,
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

  const generateFromNormalVaccination = item => {
    const groupName = 'NormalDispense'
    if (item.isPreOrder) {
      orderItems.push({
        ...defaultItem(item, groupName),
        groupNumber: 1,
        groupRowSpan: 1,
      })
      return
    }
    const inventoryItem = inventoryvaccination.find(
      vaccination => vaccination.id === item.inventoryVaccinationFK,
    )
    if (item.tempDispenseItem.length) {
      item.tempDispenseItem.forEach((di, index) => {
        const currentStock = (inventoryItem?.vaccinationStock || []).find(
          s => s.id === di.inventoryStockFK,
        )
        orderItems.push({
          ...defaultItem(item, groupName),
          ...generateFromTempDispenseInfo(
            di,
            currentStock?.stock,
            currentStock?.isDefault,
            inventoryItem?.prescribingUOM?.name,
          ),
          stockBalance:
            item.quantity - _.sumBy(item.tempDispenseItem, 'transactionQty'),
          countNumber: index === 0 ? 1 : 0,
          rowspan: index === 0 ? item.tempDispenseItem.length : 0,
          uid: getUniqueId(),
          vaccinationStock: inventoryItem?.vaccinationStock,
        })
      })
    } else {
      const inventoryItemStock = _.orderBy(
        (inventoryItem?.vaccinationStock || []).filter(
          s => s.isDefault || s.stock >= item.quantity,
        ),
        ['isDefault', 'expiryDate'],
        ['asc'],
      )
      let remainQty = item.quantity
      if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
        const {
          id,
          batchNo,
          expiryDate,
          stock,
          isDefault,
        } = inventoryItemStock[0]
        orderItems.push({
          ...defaultItem(item, groupName),
          dispenseQuantity: item.quantity,
          batchNo,
          expiryDate,
          stock,
          stockFK: id,
          uomDisplayValue: inventoryItem?.dispensingUOM?.name,
          isDefault,
          stockBalance: 0,
          allowToDispense: true,
          vaccinationStock: inventoryItem?.vaccinationStock,
        })
      } else {
        const { batchNo, expiryDate, ...restItem } = item
        orderItems.push(defaultItem(restItem, groupName))
      }
    }
    const groupItems = orderItems.filter(
      oi => oi.type === item.type && oi.id === item.id,
    )
    groupItems[0].groupNumber = 1
    groupItems[0].groupRowSpan = groupItems.length
  }

  const sortOrderItems = [
    ...(entity.prescription || [])
      .filter(item => item.type === 'Medication' && !item.isDrugMixture)
      .map(item => {
        return { ...item, quantity: item.dispensedQuanity }
      }),
    ...(entity.vaccination || []),
    ...(entity.consumable || []),
    ...(entity.prescription || []).filter(
      item => item.type === 'Medication' && item.isDrugMixture,
    ),
    ...(entity.prescription || [])
      .filter(item => item.type === 'Open Prescription')
      .map(item => {
        return { ...item, quantity: item.dispensedQuanity }
      }),
    ...(entity.externalPrescription || []).map(item => {
      return { ...item, quantity: item.dispensedQuanity }
    }),
  ]

  sortOrderItems.forEach(item => {
    if (item.type === 'Medication') {
      if (item.isDrugMixture) {
        generateFromDrugmixture(item)
      } else {
        generateFromNormalMedication(item)
      }
    } else if (
      item.type === 'Open Prescription' ||
      item.type === 'Medication (Ext.)'
    ) {
      orderItems.push({
        ...defaultItem(item, 'NoNeedToDispense'),
        groupNumber: 1,
        groupRowSpan: 1,
      })
    } else if (item.type === 'Vaccination') {
      generateFromNormalVaccination(item)
    } else {
      generateFromNormalConsumable(item)
    }
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
        invoice: {
          isGSTInclusive: false,
          invoiceAdjustment: [],
          invoiceItem: [],
        },
      },
      selectedWidgets: ['1'],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        if (pathname === '/reception/queue/dispense' && Number(query.vid)) {
          await Promise.all([
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: 'inventorymedication',
                force: true,
                temp: true,
              },
            }),
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: 'inventoryvaccination',
                force: true,
                temp: true,
              },
            }),
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: 'inventoryconsumable',
                force: true,
                temp: true,
              },
            }),
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: 'ctservice',
                force: true,
                temp: true,
              },
            }),
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: 'ctmedicationunitofmeasurement',
                force: true,
              },
            }),
          ])
          dispatch({
            type: 'dispense/updateState',
            payload: {
              queryCodeTablesDone: true,
            },
          })

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

        if (
          payload.pid &&
          (!patientState.entity || patientState.entity.id !== payload.pid)
        ) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
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

        yield put({
          type: 'getServingPersons',
          payload: { visitFK: visitID },
        })
      },

      *addActualize({ payload }, { call, put }) {
        const response = yield call(service.addActualize, payload)
        return response
      },

      *getActualize({ payload }, { call, put }) {
        const response = yield call(service.getActualize, payload)
        return response
      },

      *cancelActualize({ payload }, { call, put }) {
        const response = yield call(service.cancelActualize, payload)
        return response
      },

      *getServingPersons({ payload }, { call, put }) {
        const response = yield call(service.getServingPersons, payload)
        if (response)
          yield put({
            type: 'updateState',
            payload: {
              servingPersons: response.data,
            },
          })
      },

      *setServingPerson({ payload }, { call, put }) {
        const response = yield call(service.setServingPerson, payload)
        if (response)
          yield put({
            type: 'getServingPersons',
            payload: payload,
          })
      },

      *start({ payload }, { call, put }) {
        const response = yield call(service.create, payload.id)
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
          })
        }
        return response
      },
      *refresh({ payload }, { call, put, select }) {
        const response = yield call(service.refresh, payload)
        if (response) {
          const codetable = yield select(st => st.codetable)
          const clinicSettings = yield select(st => st.clinicSettings)
          const orderItems = getDispenseItems(
            codetable,
            clinicSettings.settings || {},
            response,
          )
          const defaultExpandedGroups = _.uniqBy(
            orderItems,
            'dispenseGroupId',
          ).map(o => o.dispenseGroupId)
          yield put({
            type: 'updateState',
            payload: {
              entity: {
                ...response,
                dispenseItems: orderItems,
                defaultExpandedGroups,
              },
              //version: Date.now(),
            },
          })
        }
        return response
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
        const codetable = yield select(st => st.codetable)
        const clinicSettings = yield select(st => st.clinicSettings)
        const dispense = yield select(st => st.dispense)
        let obj = dispense.entity
        const orderItems = getDispenseItems(
          codetable,
          clinicSettings.settings || {},
          obj,
        )
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
