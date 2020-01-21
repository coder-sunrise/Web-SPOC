import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import Order from '../../Widgets/Orders'
import { SizeContainer, withFormikExtend } from '@/components'
import { convertToConsultation } from '@/pages/Consultation/utils'
import {
  VISIT_TYPE,
  INVOICE_ITEM_TYPE_BY_NAME,
  ORDER_TYPE_TAB,
} from '@/utils/constants'
import { roundTo } from '@/utils/utils'

const styles = () => ({})

const AddOrder = ({
  footer,
  handleSubmit,
  dispatch,
  dispense,
  codetable: { ctservice, inventoryconsumable, inventorymedication },
  visitType,
}) => {
  const displayExistingOrders = async (id, servicesList) => {
    await dispatch({
      type: 'dispense/queryAddOrderDetails',
      payload: {
        invoiceId: id,
      },
    }).then((r) => {
      if (r) {
        const { retailInvoiceAdjustment, retailInvoiceItem } = r
        const newRows = retailInvoiceItem.map((o) => {
          let obj
          switch (o.invoiceItemTypeFK) {
            case INVOICE_ITEM_TYPE_BY_NAME.MEDICATION: {
              const {
                retailPrescriptionItemInstruction,
                retailPrescriptionItemPrecaution,
                ...restValues
              } = o.retailVisitInvoiceDrug.retailPrescriptionItem

              const medicationItem = inventorymedication.find(
                (medication) =>
                  medication.id ===
                    o.retailVisitInvoiceDrug.inventoryMedicationFK &&
                  medication.isActive,
              )
              obj = {
                type: o.invoiceItemTypeFK.toString(),
                ...o.retailVisitInvoiceDrug,
                innerLayerId: o.retailVisitInvoiceDrug.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceDrug.concurrencyToken,
                ...restValues,
                corPrescriptionItemInstruction:
                  o.retailVisitInvoiceDrug.retailPrescriptionItem
                    .retailPrescriptionItemInstruction,
                corPrescriptionItemPrecaution:
                  o.retailVisitInvoiceDrug.retailPrescriptionItem
                    .retailPrescriptionItemPrecaution,
                isActive: !!medicationItem,
              }
              break
            }

            case INVOICE_ITEM_TYPE_BY_NAME.SERVICE: {
              const { serviceId, serviceCenterId } = servicesList.find(
                (s) =>
                  s.serviceCenter_ServiceId ===
                    o.retailVisitInvoiceService.serviceCenterServiceFK &&
                  s.isActive,
              )
              const serviceItem = ctservice.find(
                (service) =>
                  service.serviceCenter_ServiceId ===
                  o.retailVisitInvoiceService.serviceCenterServiceFK,
              )
              obj = {
                type: ORDER_TYPE_TAB.SERVICE,
                serviceFK: serviceId,
                serviceCenterFK: serviceCenterId,
                innerLayerId: o.retailVisitInvoiceService.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceService.concurrencyToken,
                ...o.retailVisitInvoiceService,
                ...o.retailVisitInvoiceService.retailService,
                isActive: !!serviceItem,
              }
              break
            }

            case INVOICE_ITEM_TYPE_BY_NAME.CONSUMABLE: {
              const consumableItem = inventoryconsumable.find(
                (consumable) =>
                  consumable.id ===
                    o.retailVisitInvoiceConsumable.inventoryConsumableFK &&
                  consumable.isActive,
              )
              obj = {
                type: ORDER_TYPE_TAB.CONSUMABLE,
                innerLayerId: o.retailVisitInvoiceConsumable.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceConsumable.concurrencyToken,
                ...o.retailVisitInvoiceConsumable,
                ...o.retailVisitInvoiceConsumable.retailConsumable,
                isActive: !!consumableItem,
              }
              break
            }
            default: {
              break
            }
          }

          return {
            outerLayerId: o.id,
            outerLayerConcurrencyToken: o.concurrencyToken,
            subject: o.itemName,
            uid: o.id,
            ...obj,
          }
        })

        const newRetailInvoiceAdjustment = retailInvoiceAdjustment.map((o) => {
          return {
            ...o,
            uid: o.id,
          }
        })
        dispatch({
          type: 'orders/updateState',
          payload: {
            rows: newRows,
            finalAdjustments: newRetailInvoiceAdjustment,
            isGSTInclusive: r.isGSTInclusive,
            gstValue: r.gstValue,
          },
        })

        dispatch({
          type: 'orders/calculateAmount',
          payload: {
            isGSTInclusive: r.isGSTInclusive,
            gstValue: r.gstValue,
          },
        })
      }
    })
  }

  useEffect(() => {
    const { entity } = dispense
    const { invoice } = entity

    if (visitType === VISIT_TYPE.RETAIL)
      displayExistingOrders(invoice.id, ctservice)
  }, [])

  return (
    <React.Fragment>
      <SizeContainer size='sm'>
        <Order fromDispense={visitType === VISIT_TYPE.RETAIL} />
      </SizeContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ dispense, orders, codetable, consultation }) => ({
    dispense,
    orders,
    consultation,
    codetable,
  })),
  withFormikExtend({
    handleSubmit: (values, { props }) => {
      const {
        dispatch,
        consultation,
        orders,
        onConfirm,
        dispense,
        onReloadClick,
        codetable: { inventoryconsumable },
        visitType,
      } = props
      const { rows, summary, finalAdjustments } = orders
      const { addOrderDetails } = dispense
      if (visitType === VISIT_TYPE.RETAIL) {
        const medicationPrecautionsArray = (
          corPrescriptionItemPrecaution,
          retailPrescriptionItemPrecaution,
        ) => {
          const combinedOldNewPrecautions = _.intersectionBy(
            corPrescriptionItemPrecaution,
            retailPrescriptionItemPrecaution,
            'medicationPrecautionFK',
          )

          const newAddedPrecautions = _.differenceBy(
            corPrescriptionItemPrecaution,
            combinedOldNewPrecautions,
            'medicationPrecautionFK',
          )

          // const unwantedItem = _.differenceBy(
          //   retailPrescriptionItemPrecaution,
          //   combinedOldNewPrecautions,
          //   'medicationPrecautionFK',
          // )

          const unwantedItem = _.xor(
            retailPrescriptionItemPrecaution,
            combinedOldNewPrecautions,
          )

          const formatNewAddedPrecautions = newAddedPrecautions.map((o) => {
            return {
              ...o,
              id: undefined,
              concurrencyToken: undefined,
            }
          })

          let deleteUnwantedItem = []
          if (combinedOldNewPrecautions.length <= 0) {
            deleteUnwantedItem = retailPrescriptionItemPrecaution.map((o) => {
              return {
                ...o,
                isDeleted: true,
              }
            })
          } else {
            deleteUnwantedItem = unwantedItem.map((o) => {
              return {
                ...o,
                isDeleted: true,
              }
            })
          }

          return [
            ...combinedOldNewPrecautions,
            ...formatNewAddedPrecautions,
            ...deleteUnwantedItem,
          ]
        }

        const medicationIntructionsArray = (
          corPrescriptionItemInstruction,
          retailPrescriptionItemInstruction,
        ) => {
          // const compareCriteria = [
          //   'dosageFK',
          //   'drugFrequencyFK',
          //   'duration',
          //   'prescribeUOMFK',
          //   'stepdose',
          //   'usageMethodFK',
          // ]
          const compareCriteria =
            'dosageFK drugFrequencyFK duration prescribeUOMFK stepdose usageMethodFK'

          const combinedOldNewInstructions = _.intersectionBy(
            corPrescriptionItemInstruction,
            retailPrescriptionItemInstruction,
            compareCriteria,
          )

          const newAddedIntructions = _.differenceBy(
            corPrescriptionItemInstruction,
            combinedOldNewInstructions,
            compareCriteria,
          )

          const unwantedItem = _.xor(
            retailPrescriptionItemInstruction,
            combinedOldNewInstructions,
          )

          const formatNewAddedInstructions = newAddedIntructions.map((o) => {
            return {
              ...o,
              id: undefined,
              concurrencyToken: undefined,
            }
          })

          let deleteUnwantedItem = []
          if (combinedOldNewInstructions.length <= 0) {
            deleteUnwantedItem = retailPrescriptionItemInstruction.map((o) => {
              return {
                ...o,
                isDeleted: true,
              }
            })
          } else {
            deleteUnwantedItem = unwantedItem.map((o) => {
              return {
                ...o,
                isDeleted: true,
              }
            })
          }

          return [
            ...combinedOldNewInstructions,
            ...formatNewAddedInstructions,
            ...deleteUnwantedItem,
          ]
        }
        const retailInvoiceItem = rows.map((o) => {
          let obj
          switch (o.type) {
            case ORDER_TYPE_TAB.MEDICATION:
            case ORDER_TYPE_TAB.OPENPRECRIPTION: {
              const {
                corPrescriptionItemInstruction,
                corPrescriptionItemPrecaution,
                retailPrescriptionItem = {},
                ...restO
              } = o
              const {
                retailPrescriptionItemInstruction = [],
                retailPrescriptionItemPrecaution = [],
              } = retailPrescriptionItem
              obj = {
                itemCode: o.drugCode,
                itemName: o.drugName,
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.MEDICATION,
                unitPrice: o.unitPrice,
                quantity: o.quantity,
                subTotal: roundTo(o.totalPrice),
                // "adjType": "string",
                // "adjValue": 0,
                retailVisitInvoiceDrug: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  inventoryMedicationFK: o.inventoryMedicationFK,
                  expiryDate: o.expiryDate,
                  batchNo: o.batchNo,
                  dispensedQuanity: o.dispensedQuanity,
                  retailPrescriptionItem: {
                    ...restO,
                    unitPrice: roundTo(o.totalPrice / o.quantity),
                    retailPrescriptionItemInstruction: medicationIntructionsArray(
                      corPrescriptionItemInstruction,
                      retailPrescriptionItemInstruction,
                    ),
                    retailPrescriptionItemPrecaution: medicationPrecautionsArray(
                      corPrescriptionItemPrecaution,
                      retailPrescriptionItemPrecaution,
                    ),
                  },
                },
              }

              break
            }
            case ORDER_TYPE_TAB.SERVICE: {
              obj = {
                itemCode: o.serviceCode,
                itemName: o.serviceName,
                subTotal: roundTo(o.total),
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.SERVICE,
                retailVisitInvoiceService: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  serviceCenterServiceFK: o.serviceCenterServiceFK,
                  retailService: {
                    unitPrice: o.total,
                    ...o,
                  },
                },
              }
              break
            }
            case ORDER_TYPE_TAB.CONSUMABLE: {
              const { uom } = inventoryconsumable.find(
                (c) => c.id === o.inventoryConsumableFK,
              )
              obj = {
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.CONSUMABLE,
                itemCode: o.consumableCode,
                itemName: o.consumableName,
                subTotal: roundTo(o.totalPrice),
                retailVisitInvoiceConsumable: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  inventoryConsumableFK: o.inventoryConsumableFK,
                  expiryDate: o.expiryDate,
                  batchNo: o.batchNo,
                  retailConsumable: {
                    unitOfMeasurement: uom.name,
                    unitofMeasurementFK: uom.id,
                    unitPrice: roundTo(o.totalPrice / o.quantity),
                    ...o,
                  },
                },
              }
              break
            }
            default: {
              break
            }
          }
          return {
            id: o.outerLayerId,
            concurrencyToken: o.outerLayerConcurrencyToken,
            description: o.subject,
            adjAmt: o.adjAmount,
            totalAfterItemAdjustment: roundTo(o.totalAfterItemAdjustment),
            totalAfterOverallAdjustment: roundTo(o.totalAfterOverallAdjustment),
            totalAfterGST: roundTo(o.totalAfterGST),
            gstAmount: o.gstAmount,
            ...obj,
          }
        })

        const payload = {
          ...addOrderDetails,
          ...summary,
          retailInvoiceItem,
          retailInvoiceAdjustment: finalAdjustments,
        }
        dispatch({
          type: 'dispense/saveAddOrderDetails',
          payload,
        }).then((r) => {
          if (r) {
            if (onConfirm) onConfirm()
            onReloadClick()
          }
        })
      }
      if (visitType === VISIT_TYPE.BILL_FIRST) {
        const billFirstPayload = convertToConsultation(consultation.entity, {
          consultationDocument: { rows: [] },
          orders,
        })
        console.log({ billFirstPayload })
        dispatch({
          type: `consultation/signOrder`,
          payload: {
            ...billFirstPayload,
            id: consultation.entity.id,
          },
        }).then((response) => {
          if (response) {
            dispatch({
              type: `dispense/refresh`,
              payload: dispense.visitID,
            })
            if (onConfirm) onConfirm()
            onReloadClick()
          }
        })
      }
    },
    displayName: 'AddOrder',
  }),
)(AddOrder)
