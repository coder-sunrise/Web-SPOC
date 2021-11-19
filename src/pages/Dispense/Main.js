import React, { Component } from 'react'
// common component
import { connect } from 'dva'
import { formatMessage } from 'umi'
import {
  withFormikExtend,
  notification,
  CommonModal,
  Button,
} from '@/components'
import {
  calculateAmount,
  navigateDirtyCheck,
  getUniqueId,
  getTranslationValue,
} from '@/utils/utils'
import Yup from '@/utils/yup'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import { openCautionAlertOnStartConsultation } from '@/pages/Widgets/Orders/utils'
import ViewPatientHistory from '@/pages/Consultation/ViewPatientHistory'
import AddOrder from './DispenseDetails/AddOrder'
import DispenseDetails from './DispenseDetails/WebSocketWrapper'
import { DispenseItemsColumnExtensions } from './variables'
import _ from 'lodash'

const calculateInvoiceAmounts = entity => {
  const obj = { ...entity }
  const output = calculateAmount(
    obj.invoice.invoiceItem,
    obj.invoice.invoiceAdjustment,
    {
      isGSTInclusive: obj.invoice.isGSTInclusive,
      totalField: 'totalAfterItemAdjustment',
      adjustedField: 'totalAfterOverallAdjustment',
      gstField: 'totalAfterGST',
      gstAmtField: 'gstAmount',
      gstValue: obj.invoice.gstValue,
    },
  )
  let invoiceSummary = {}
  if (output && output.summary) {
    const { summary } = output

    invoiceSummary = {
      invoiceTotal: summary.total,
      invoiceTotalAftAdj: summary.totalAfterAdj,
      invoiceTotalAftGST: summary.totalWithGST,
      outstandingBalance: summary.totalWithGST - obj.invoice.totalPayment,
      invoiceGSTAdjustment: summary.gstAdj,
      invoiceGSTAmt: Math.round(summary.gst * 100) / 100,
    }
  }

  return {
    ...obj,
    invoice: {
      ...obj.invoice,
      ...invoiceSummary,
    },
  }
}

const reloadDispense = (props, effect = 'query') => {
  const { dispatch, dispense, resetForm, codetable, clinicSettings } = props

  dispatch({
    type: `dispense/${effect}`,
    payload: dispense.visitID,
  }).then(response => {
    if (response) {
      let obj = { ...response }
      const orderItems = getDispenseItems(codetable, clinicSettings, obj)
      const defaultExpandedGroups = _.uniqBy(orderItems, 'dispenseGroupId').map(
        o => o.dispenseGroupId,
      )

      obj = { ...obj, dispenseItems: orderItems, defaultExpandedGroups }
      const result = calculateInvoiceAmounts(obj)
      resetForm(result)
    }
  })
}

const constructPayload = values => {
  const getTransaction = item => {
    const {
      stockFK,
      batchNo,
      expiryDate,
      dispenseQuantity,
      uomDisplayValue,
      secondUOMDisplayValue,
    } = item
    return {
      inventoryStockFK: stockFK,
      batchNo,
      expiryDate,
      transactionQty: dispenseQuantity,
      uomDisplayValue,
      secondUOMDisplayValue,
    }
  }

  const updateTempDispenseItem = (items, inventoryFiledName) => {
    return items.map(m => {
      let tempDispenseItem = []
      if (!m.isPreOrder) {
        const matchItem = values.dispenseItems.filter(
          d =>
            d.type === m.type &&
            d.id === m.id &&
            d.dispenseQuantity > 0 &&
            !d.isDispensedByPharmacy,
        )

        if (matchItem.length) {
          matchItem.forEach(item => {
            tempDispenseItem.push({
              ...getTransaction(item),
              inventoryFK: item[inventoryFiledName],
            })
          })
        }
      }
      return {
        ...m,
        tempDispenseItem,
      }
    })
  }

  const _values = {
    ...values,
    prescription: updateTempDispenseItem(
      values.prescription,
      'inventoryMedicationFK',
    ),
    vaccination: updateTempDispenseItem(
      values.vaccination,
      'inventoryVaccinationFK',
    ),
    consumable: updateTempDispenseItem(
      values.consumable,
      'inventoryConsumableFK',
    ),
    dispenseItems: undefined,
    defaultExpandedGroups: undefined,
  }
  return _values
}

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
    }
  }

  const generateFromDrugmixture = item => {
    const drugMixtures = _.orderBy(
      item.prescriptionDrugMixture,
      ['sequence'],
      ['asc'],
    )
    drugMixtures.forEach(drugMixture => {
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
        const inventoryItem = inventorymedication.find(
          drug => drug.id === drugMixture.inventoryMedicationFK,
        )
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
          })
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    } else {
      const inventoryItem = inventorymedication.find(
        drug => drug.id === item.inventoryMedicationFK,
      )
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
          })
        })
      } else {
        orderItems.push(defaultItem(item, groupName))
      }
    } else {
      const inventoryItem = inventoryconsumable.find(
        consumable => consumable.id === item.inventoryConsumableFK,
      )

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
    ...(entity.prescription || []).filter(
      item => item.type === 'Medication' && !item.isDrugMixture,
    ),
    ...(entity.vaccination || []),
    ...(entity.consumable || []),
    ...(entity.prescription || []).filter(
      item => item.type === 'Medication' && item.isDrugMixture,
    ),
    ...(entity.prescription || []).filter(
      item => item.type === 'Open Prescription',
    ),
    ...(entity.externalPrescription || []),
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

const validDispense = (dispenseItems = []) => {
  let isValid = true
  const dispensedItems = dispenseItems.filter(
    d => !d.isPreOrder && d.stockFK && !d.isDispensedByPharmacy,
  )
  for (let index = 0; index < dispensedItems.length; index++) {
    if (
      dispensedItems[index].dispenseQuantity > dispensedItems[index].quantity
    ) {
      notification.error({
        message: 'Dispense quantity cannot be more than orderd quantity.',
      })
      isValid = false
      break
    }

    if (
      !dispensedItems[index].isDefault &&
      dispensedItems[index].dispenseQuantity > dispensedItems[index].stock
    ) {
      notification.error({
        message: 'Dispense quantity cannot be more than stock quantity.',
      })
      isValid = false
      break
    }

    let matchItems = []
    if (dispensedItems[index].isDrugMixture) {
      matchItems = dispenseItems.filter(
        d =>
          d.type === dispensedItems[index].type &&
          dispensedItems[index].isDrugMixture &&
          d.drugMixtureFK === dispensedItems[index].drugMixtureFK,
      )
    } else {
      matchItems = dispenseItems.filter(
        d =>
          d.type === dispensedItems[index].type &&
          d.id === dispensedItems[index].id,
      )
    }

    if (
      dispensedItems[index].quantity !== _.sumBy(matchItems, 'dispenseQuantity')
    ) {
      notification.error({
        message: 'Dispense quantity not equal order quantity.',
      })
      isValid = false
      break
    }

    if (!dispensedItems[index].isDefault) {
      const matchInventoryItems = dispenseItems.filter(
        d =>
          d.type === dispensedItems[index].type &&
          d.stockFK === dispensedItems[index].stockFK,
      )
      if (
        dispensedItems[index].stock <
        _.sumBy(matchInventoryItems, 'dispenseQuantity')
      ) {
        notification.error({
          message: 'Dispense quantity cannot be more than total stock.',
        })
        isValid = false
        break
      }
    }
  }
  return isValid
}

@withFormikExtend({
  authority: 'queue.dispense',
  enableReinitialize: true,
  notDirtyDuration: 3,
  mapPropsToValues: pops => {
    const {
      dispense = {},
      codetable,
      clinicSettings: { settings = {} },
    } = pops
    let obj = dispense.entity || dispense.default

    const orderItems = getDispenseItems(codetable, settings, obj)
    const defaultExpandedGroups = _.uniqBy(orderItems, 'dispenseGroupId').map(
      o => o.dispenseGroupId,
    )

    obj = { ...obj, dispenseItems: orderItems, defaultExpandedGroups }
    const result = calculateInvoiceAmounts(obj)
    return result
  },
  validationSchema: Yup.object().shape({
    prescription: Yup.array().of(
      Yup.object().shape({
        batchNo: Yup.string(),
        expiryDate: Yup.date(),
      }),
    ),
  }),
  handleSubmit: (values, { props, ...restProps }) => {
    const { dispatch, dispense } = props
    if (!validDispense(values.dispenseItems)) return
    const vid = dispense.visitID
    const _values = constructPayload(values)

    dispatch({
      type: `dispense/save`,
      payload: {
        id: vid,
        values: _values,
      },
    }).then(o => {
      if (o) {
        notification.success({
          message: 'Dispense saved',
        })
        reloadDispense({
          ...props,
          ...restProps,
        })
      }
    })
  },
  displayName: 'DispensePage',
})
@connect(({ orders, formik, dispense }) => ({
  orders,
  formik,
  dispense,
}))
class Main extends Component {
  state = {
    showOrderModal: false,
    showDrugLabelSelection: false,
    selectedDrugs: [],
    showCautionAlert: false,
    isShowOrderUpdated: false,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { prescription = [], packageItem = [] } = nextProps.values

    let drugList = []
    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(() => {
      return {
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  componentDidMount = async () => {
    const { dispatch, values, dispense } = this.props
    const {
      otherOrder = [],
      prescription = [],
      packageItem = [],
      visitPurposeFK,
    } = values
    dispatch({
      type: 'dispense/incrementLoadCount',
    })
    const isEmptyDispense = otherOrder.length === 0 && prescription.length === 0
    const noClinicalObjectRecord = !values.clinicalObjectRecordFK

    const accessRights = Authorized.check('queue.dispense.editorder')

    if (visitPurposeFK === VISIT_TYPE.OTC && isEmptyDispense) {
      this.setState(
        prevState => {
          return {
            showOrderModal: !prevState.showOrderModal,
            isFirstAddOrder: true,
          }
        },
        () => {
          this.openFirstTabAddOrder()
        },
      )
      return
    }

    if (
      accessRights &&
      accessRights.rights !== 'hidden' &&
      visitPurposeFK === VISIT_TYPE.BF &&
      isEmptyDispense &&
      noClinicalObjectRecord &&
      dispense.loadCount === 0
    ) {
      this.setState({ showCautionAlert: true })
      this.editOrder()
    }

    let drugList = []
    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(() => {
      return {
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  makePayment = async (voidPayment = false, voidReason = '') => {
    const { dispatch, dispense, values } = this.props
    if (!validDispense(values.dispenseItems)) return false
    const _values = constructPayload(values)
    const finalizeResponse = await dispatch({
      type: 'dispense/finalize',
      payload: {
        id: dispense.visitID,
        values: {
          ..._values,
          voidPayment,
          voidReason,
        },
      },
    })
    if (finalizeResponse === 204) {
      return true
    }
    return false
  }

  _editOrder = () => {
    const { dispatch, dispense, values, history } = this.props
    const { location } = history
    const { query } = location
    const { visitPurposeFK } = values
    const addOrderList = [VISIT_TYPE.OTC]
    const shouldShowAddOrderModal = addOrderList.includes(visitPurposeFK)

    if (shouldShowAddOrderModal) {
      this.handleOrderModal()
    }
    if (visitPurposeFK !== VISIT_TYPE.OTC) {
      dispatch({
        type: `consultation/editOrder`,
        payload: {
          id: values.id,
          queueID: query.qid,
          version: dispense.version,
        },
      }).then(o => {
        if (o) {
          dispatch({
            type: `dispense/updateState`,
            payload: {
              editingOrder: !shouldShowAddOrderModal,
            },
          })
          reloadDispense(this.props)

          if (this.state.showCautionAlert) {
            this.setState({ showCautionAlert: false })
            openCautionAlertOnStartConsultation(o)
          }
        }
      })
    }
  }

  editOrder = e => {
    const { values } = this.props
    const { visitPurposeFK } = values

    if (visitPurposeFK === VISIT_TYPE.OTC) {
      this._editOrder()
    } else {
      navigateDirtyCheck({
        onProceed: this._editOrder,
      })(e)
    }
  }

  actualizeEditOrder = () => {
    const { dispatch, values, dispense, orders } = this.props
    this.setState(
      prevState => {
        return {
          showOrderModal: !prevState.showOrderModal,
          isFirstAddOrder: false,
        }
      },
      () => {
        this.openFirstTabAddOrder()
      },
    )
  }

  openFirstTabAddOrder = () => {
    const { dispatch, values } = this.props
    if (this.state.showOrderModal) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          type: '1',
          visitPurposeFK: values.visitPurposeFK,
        },
      })
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          visitPurposeFK: values.visitPurposeFK,
        },
      })
    }
  }

  handleOrderModal = () => {
    this.props.dispatch({
      type: 'orders/reset',
    })

    this.setState(
      prevState => {
        return {
          showOrderModal: !prevState.showOrderModal,
          isFirstAddOrder: false,
        }
      },
      () => {
        this.openFirstTabAddOrder()
      },
    )
  }

  handleReloadClick = () => {
    reloadDispense(this.props, 'refresh')
  }

  showConfirmationBox = () => {
    const { dispatch, history } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: formatMessage({
          id: 'app.general.leave-without-save',
        }),
        onConfirmSave: () => {
          history.push({
            pathname: history.location.pathname,
            query: {
              ...history.location.query,
              isInitialLoading: false,
            },
          })
          this.handleOrderModal()
        },
      },
    })
  }

  handleCloseAddOrder = () => {
    const {
      dispatch,
      consultation,
      values,
      orders: { rows },
      formik,
    } = this.props
    const { visitPurposeFK } = values
    const newOrderRows = rows.filter(row => !row.id && !row.isDeleted)

    if (
      (formik.OrderPage && !formik.OrderPage.dirty) ||
      newOrderRows.length > 0
    )
      this.showConfirmationBox()
    else if (visitPurposeFK === VISIT_TYPE.BF) {
      dispatch({
        type: 'consultation/discard',
        payload: {
          id: consultation.entity.id,
        },
      }).then(response => {
        dispatch({
          type: 'dispense/query',
          payload: {
            id: values.id,
            version: Date.now(),
          },
        })
        if (response) this.handleOrderModal()
      })
    } else {
      this.handleOrderModal()
    }
  }

  handleDrugLabelClick = () => {
    const { values } = this.props
    const { prescription = [], packageItem = [] } = values
    let drugList = []

    prescription.forEach(item => {
      drugList.push(item)
    })
    packageItem.forEach(item => {
      if (item.type === 'Medication') {
        drugList.push({
          ...item,
          name: item.description,
          dispensedQuanity: item.packageConsumeQuantity,
        })
      }
    })

    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
        selectedDrugs: drugList.map(x => {
          return { ...x, no: 1, selected: true }
        }),
      }
    })
  }

  handleDrugLabelSelectionClose = () => {
    this.setState(prevState => {
      return {
        showDrugLabelSelection: !prevState.showDrugLabelSelection,
      }
    })
  }

  handleDrugLabelSelected = (itemId, selected) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, selected } : { ...drug },
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  handleDrugLabelNoChanged = (itemId, no) => {
    this.setState(prevState => ({
      selectedDrugs: prevState.selectedDrugs.map(drug =>
        drug.id === itemId ? { ...drug, no } : { ...drug },
      ),
    }))
    this.props.dispatch({ type: 'global/incrementCommitCount' })
  }

  showRefreshOrder = () => {
    const { dispense } = this.props
    const { shouldRefreshOrder } = dispense
    if (shouldRefreshOrder) {
      if (!this.state.isShowOrderUpdated) {
        this.props.dispatch({
          type: 'global/updateState',
          payload: {
            openAdjustment: false,
          },
        })
        this.setState({
          isShowOrderUpdated: true,
          showDrugLabelSelection: false,
        })
      }
    }
  }

  render() {
    const {
      classes,
      handleSubmit,
      values,
      dispense,
      codetable,
      isActualizeInRetail,
      testProps,
    } = this.props

    if (dispense.openOrderPopUpAfterActualize) {
      this.actualizeEditOrder()
      dispense.openOrderPopUpAfterActualize = false
    }
    return (
      <div className={classes.root}>
        <DispenseDetails
          {...this.props}
          onSaveClick={handleSubmit}
          onEditOrderClick={this.editOrder}
          onFinalizeClick={this.makePayment}
          onReloadClick={this.handleReloadClick}
          onDrugLabelClick={this.handleDrugLabelClick}
          showDrugLabelSelection={this.state.showDrugLabelSelection}
          onDrugLabelSelectionClose={this.handleDrugLabelSelectionClose}
          onDrugLabelSelected={this.handleDrugLabelSelected}
          onDrugLabelNoChanged={this.handleDrugLabelNoChanged}
          selectedDrugs={this.state.selectedDrugs}
        />
        <CommonModal
          title='Orders'
          open={this.state.showOrderModal && dispense.queryCodeTablesDone}
          onClose={this.handleCloseAddOrder}
          onConfirm={this.handleOrderModal}
          maxWidth='md'
          observe='OrderPage'
        >
          <AddOrder
            visitType={values.visitPurposeFK}
            isFirstLoad={this.state.isFirstAddOrder}
            onReloadClick={() => {
              reloadDispense(this.props)
            }}
            {...this.props}
          />
        </CommonModal>
        <ViewPatientHistory top='213px' />

        <CommonModal
          title='Orders Updated'
          maxWidth='sm'
          open={this.state.isShowOrderUpdated}
          showFooter={false}
        >
          <div
            style={{
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <div
              style={{
                marginTop: -20,
              }}
            >
              <h3>
                Orders has been updated by other user. Click OK to refresh
                orders.
              </h3>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button
                color='primary'
                icon={null}
                onClick={() => {
                  const { dispatch } = this.props
                  dispatch({
                    type: 'dispense/updateState',
                    payload: {
                      shouldRefreshOrder: false,
                    },
                  })
                  this.setState({ isShowOrderUpdated: false })
                  if (this.handleReloadClick) {
                    this.handleReloadClick()
                  }
                }}
              >
                ok
              </Button>
            </div>
          </div>
        </CommonModal>
        {this.showRefreshOrder()}
      </div>
    )
  }
}

export default Main
