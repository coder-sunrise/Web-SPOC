import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { SizeContainer, withFormikExtend } from '@/components'
import { convertToConsultation } from '@/pages/Consultation/utils'
import {
  VISIT_TYPE,
  INVOICE_ITEM_TYPE_BY_NAME,
  ORDER_TYPE_TAB,
  CLINIC_TYPE,
  REVENUE_CATEGORY,
} from '@/utils/constants'
import { roundTo, getUniqueId } from '@/utils/utils'
import Order from '../../Widgets/Orders'

const styles = () => ({})

const AddOrder = ({
  footer,
  handleSubmit,
  dispatch,
  dispense,
  height,
  codetable: { ctservice, inventoryconsumable, inventorymedication },
  visitType,
  location,
  clinicInfo,
}) => {
  const displayExistingOrders = async (id, servicesList) => {
    const r = await dispatch({
      type: 'dispense/queryAddOrderDetails',
      payload: {
        invoiceId: id,
        isInitialLoading: location.query.isInitialLoading,
      },
    })

    if (r) {
      const { retailInvoiceAdjustment, retailInvoiceItem } = r

      const mapRetailItemPropertyToOrderProperty = (o) => {
        let obj
        switch (o.invoiceItemTypeFK) {
          case INVOICE_ITEM_TYPE_BY_NAME.MEDICATION: {
            const {
              retailPrescriptionItemInstruction,
              retailPrescriptionItemPrecaution,
              ...restValues
            } = o.retailVisitInvoiceDrug.retailPrescriptionItem

            let medicationItem
            if (o.retailVisitInvoiceDrug.inventoryMedicationFK) {
              medicationItem = inventorymedication.find(
                (medication) =>
                  medication.id ===
                    o.retailVisitInvoiceDrug.inventoryMedicationFK &&
                  medication.isActive,
              )
            } else {
              // for open prescription item
              medicationItem = true
            }

            obj = {
              type: o.retailVisitInvoiceDrug.inventoryMedicationFK
                ? o.invoiceItemTypeFK.toString()
                : ORDER_TYPE_TAB.OPENPRESCRIPTION,
              ...o.retailVisitInvoiceDrug,
              innerLayerId: o.retailVisitInvoiceDrug.id,
              innerLayerConcurrencyToken:
                o.retailVisitInvoiceDrug.concurrencyToken,
              ...restValues,
              corPrescriptionItemInstruction: o.retailVisitInvoiceDrug.retailPrescriptionItem.retailPrescriptionItemInstruction.map(
                (instruction) => {
                  return {
                    ...instruction,
                    stepdose: instruction.stepdose || 'AND',
                  }
                },
              ),
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
          revenueCategoryFK: o.revenueCategoryFK,
          ...obj,
        }
      }

      const assignRetailAdjustmentIdToOrderAdjustmentUid = (o) => {
        return {
          ...o,
          uid: getUniqueId(),
        }
      }

      const newRows = retailInvoiceItem.map(
        mapRetailItemPropertyToOrderProperty,
      )

      const newRetailInvoiceAdjustment = retailInvoiceAdjustment.map(
        assignRetailAdjustmentIdToOrderAdjustmentUid,
      )

      const isVaccinationExist = newRows.filter((row) => !row.type)
      const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
      if (clinicTypeFK === CLINIC_TYPE.GP && isVaccinationExist.length > 0) {
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: (
              <p style={{ fontWeight: 400 }}>
                Vaccination item(s) will not be added.
              </p>
            ),
            alignContent: 'left',
            isInformType: true,
            additionalInfo: (
              <div style={{ fontSize: '1.3em' }}>
                <ul style={{ listStylePosition: 'inside' }}>
                  {isVaccinationExist.map((item) => (
                    <li>
                      <b>{item.subject}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ),
            onConfirmSave: () => {},
          },
        })
      }

      const rowsWithoutVaccination = newRows
        .filter((row) => row.type)
        .map((row) => {
          return {
            ...row,
            uid: getUniqueId(),
          }
        })
      dispatch({
        type: 'orders/updateState',
        payload: {
          rows: rowsWithoutVaccination,
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
        <div style={{ maxHeight: height - 128, overflow: 'auto' }}>
          <Order fromDispense={visitType === VISIT_TYPE.RETAIL} />
        </div>
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
  withRouter,
  withStyles(styles, { withTheme: true }),
  connect(
    ({ dispense, orders, codetable, consultation, clinicInfo, forms }) => ({
      dispense,
      orders,
      consultation,
      codetable,
      clinicInfo,
      forms,
    }),
  ),
  withFormikExtend({
    handleSubmit: (values, { props }) => {
      const {
        dispatch,
        consultation,
        orders,
        onConfirm,
        dispense,
        onReloadClick,
        codetable: { inventoryconsumable, inventorymedication, ctservice },
        visitType,
        history,
        forms,
      } = props
      const { rows, summary, finalAdjustments } = orders
      const { addOrderDetails } = dispense
      if (visitType === VISIT_TYPE.RETAIL) {
        const removeIdAndConcurrencyTokenForNewPrecautionsOrInstructions = (
          existingIDArray,
        ) => (instructionOrPrecaution) => {
          if (existingIDArray.includes(instructionOrPrecaution.id)) {
            return {
              ...instructionOrPrecaution,
            }
          }

          return {
            ...instructionOrPrecaution,
            id: undefined,
            concurrencyToken: undefined,
          }
        }

        const setIsDeletedToUnwantedPrecautionsOrInstructions = (o) => {
          return {
            ...o,
            isDeleted: true,
          }
        }

        const setIsDeletedIfWholeItemIsDeleted = (o, itemIsDeleted) => {
          if (o.isDeleted) return o

          return {
            ...o,
            isDeleted: itemIsDeleted,
          }
        }

        const medicationPrecautionsArray = (
          corPrescriptionItemPrecaution,
          retailPrescriptionItemPrecaution,
          itemIsDeleted,
        ) => {
          const combinedOldNewPrecautions = _.intersectionWith(
            corPrescriptionItemPrecaution,
            retailPrescriptionItemPrecaution,
            _.isEqual,
          )

          const newAddedPrecautions = _.differenceWith(
            corPrescriptionItemPrecaution,
            combinedOldNewPrecautions,
            _.isEqual,
          )

          const precautionsIDArray = retailPrescriptionItemPrecaution.map(
            (precaution) => precaution.id,
          )

          const formatNewAddedPrecautions = newAddedPrecautions.map(
            removeIdAndConcurrencyTokenForNewPrecautionsOrInstructions(
              precautionsIDArray,
            ),
          )

          const returnedPrecautionsArray = [
            ...combinedOldNewPrecautions,
            ...formatNewAddedPrecautions,
          ].map((o) => setIsDeletedIfWholeItemIsDeleted(o, itemIsDeleted))

          return returnedPrecautionsArray
        }

        const medicationInstructionsArray = (
          corPrescriptionItemInstruction,
          retailPrescriptionItemInstruction,
          itemIsDeleted,
        ) => {
          const combinedOldNewInstructions = _.intersectionWith(
            corPrescriptionItemInstruction,
            retailPrescriptionItemInstruction,
            _.isEqual,
          )

          const newAddedInstructions = _.differenceWith(
            corPrescriptionItemInstruction,
            retailPrescriptionItemInstruction,
            _.isEqual,
          )

          const instructionIDArray = retailPrescriptionItemInstruction.map(
            (instruction) => instruction.id,
          )

          const formatNewAddedInstructions = newAddedInstructions.map(
            removeIdAndConcurrencyTokenForNewPrecautionsOrInstructions(
              instructionIDArray,
            ),
          )

          const returnedInstructionsArray = [
            ...combinedOldNewInstructions,
            ...formatNewAddedInstructions,
          ].map((o) => setIsDeletedIfWholeItemIsDeleted(o, itemIsDeleted))

          return returnedInstructionsArray
        }

        const mapRetailItemPropertyToApi = (o) => {
          let obj
          switch (o.type) {
            case ORDER_TYPE_TAB.MEDICATION:
            case ORDER_TYPE_TAB.OPENPRESCRIPTION: {
              let revenueCategory
              const medication = inventorymedication.find(
                (c) => c.id === o.inventoryMedicationFK,
              )
              revenueCategory = medication
                ? medication.revenueCategory
                : { id: REVENUE_CATEGORY.OTHER }
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
                adjType: o.adjType,
                adjValue: o.adjValue,
                itemCode: o.drugCode,
                itemName: o.drugName,
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.MEDICATION,
                unitPrice: o.unitPrice,
                quantity: o.quantity,
                subTotal: roundTo(o.totalPrice),
                itemRevenueCategoryFK: revenueCategory.id,
                retailVisitInvoiceDrug: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  inventoryMedicationFK: o.inventoryMedicationFK,
                  expiryDate: o.expiryDate,
                  batchNo: o.batchNo,
                  dispensedQuanity: o.dispensedQuanity,
                  isDeleted: o.isDeleted,
                  retailPrescriptionItem: {
                    ...restO,
                    isDeleted: o.isDeleted,
                    unitPrice: roundTo(o.totalPrice / o.quantity),
                    retailPrescriptionItemInstruction: medicationInstructionsArray(
                      corPrescriptionItemInstruction,
                      retailPrescriptionItemInstruction,
                      o.isDeleted,
                    ),
                    retailPrescriptionItemPrecaution: medicationPrecautionsArray(
                      corPrescriptionItemPrecaution,
                      retailPrescriptionItemPrecaution,
                      o.isDeleted,
                    ),
                  },
                },
              }

              break
            }
            case ORDER_TYPE_TAB.SERVICE: {
              const { retailService, ...restValues } = o
              const { revenueCategoryFK } = ctservice.find(
                (c) => c.serviceCenter_ServiceId === o.serviceCenterServiceFK,
              )
              obj = {
                adjType: o.adjType,
                adjValue: o.adjValue,
                itemCode: o.serviceCode,
                itemName: o.serviceName,
                subTotal: roundTo(o.total),
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.SERVICE,
                unitPrice: o.unitPrice,
                quantity: o.quantity,
                itemRevenueCategoryFK: revenueCategoryFK,
                retailVisitInvoiceService: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  serviceCenterServiceFK: o.serviceCenterServiceFK,
                  isDeleted: restValues.isDeleted,
                  retailService: {
                    unitPrice: o.total,
                    ...restValues,
                  },
                },
              }
              break
            }
            case ORDER_TYPE_TAB.CONSUMABLE: {
              const { uom, revenueCategory } = inventoryconsumable.find(
                (c) => c.id === o.inventoryConsumableFK,
              )
              const { retailConsumable, ...restValues } = o
              obj = {
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.CONSUMABLE,
                adjType: o.adjType,
                adjValue: o.adjValue,
                itemCode: o.consumableCode,
                itemName: o.consumableName,
                subTotal: roundTo(o.totalPrice),
                unitPrice: o.unitPrice,
                quantity: o.quantity,
                itemRevenueCategoryFK: revenueCategory.id,
                retailVisitInvoiceConsumable: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  inventoryConsumableFK: o.inventoryConsumableFK,
                  expiryDate: o.expiryDate,
                  batchNo: o.batchNo,
                  isDeleted: restValues.isDeleted,
                  retailConsumable: {
                    unitOfMeasurement: uom.name,
                    unitofMeasurementFK: uom.id,
                    unitPrice: roundTo(o.totalPrice / o.quantity),
                    ...restValues,
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
            isDeleted: o.isDeleted,
            ...obj,
            revenueCategoryFK: o.revenueCategoryFK || obj.itemRevenueCategoryFK,
          }
        }

        const retailInvoiceItem = rows.map(mapRetailItemPropertyToApi)

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
            history.push({
              pathname: history.location.pathname,
              query: {
                ...history.location.query,
                isInitialLoading: false,
              },
            })
            onReloadClick()
          }
        })
      }
      if (visitType === VISIT_TYPE.BILL_FIRST) {
        const billFirstPayload = convertToConsultation(consultation.entity, {
          consultationDocument: { rows: [] },
          orders,
          forms,
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
