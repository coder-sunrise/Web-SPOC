import React, { useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import Order from '../../Widgets/Orders'
import { withFormikExtend } from '@/components'

const styles = () => ({})

const AddOrder = ({ footer, handleSubmit, dispatch, dispense, ctservice }) => {
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
            case 1:
            case 5: {
              const {
                retailPrescriptionItemInstruction,
                retailPrescriptionItemPrecaution,
                ...restValues
              } = o.retailVisitInvoiceDrug.retailPrescriptionItem

              obj = {
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
              }
              break
            }

            case 4: {
              const { serviceId, serviceCenterId } = servicesList.find(
                (s) =>
                  s.serviceCenter_ServiceId ===
                  o.retailVisitInvoiceService.serviceCenterServiceFK,
              )
              obj = {
                serviceFK: serviceId,
                serviceCenterFK: serviceCenterId,
                innerLayerId: o.retailVisitInvoiceService.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceService.concurrencyToken,
                ...o.retailVisitInvoiceService,
                ...o.retailVisitInvoiceService.retailService,
              }
              break
            }

            case 2: {
              obj = {
                innerLayerId: o.retailVisitInvoiceConsumable.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceConsumable.concurrencyToken,
                ...o.retailVisitInvoiceConsumable,
                ...o.retailVisitInvoiceConsumable.retailConsumable,
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
            type: o.invoiceItemTypeFK.toString(),
            subject: o.itemName,
            isActive: true,
            uid: o.id,
            ...obj,
          }
        })
        dispatch({
          type: 'orders/updateState',
          payload: {
            rows: newRows,
            finalAdjustments: retailInvoiceAdjustment,
          },
        })
      }
    })
  }

  useEffect(() => {
    const { entity } = dispense
    const { invoice } = entity

    let servicesList = ctservice
    if (!ctservice) {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctservice',
        },
      }).then((services) => {
        displayExistingOrders(invoice.id, services)
      })
    } else {
      displayExistingOrders(invoice.id, servicesList)
    }
  }, [])

  return (
    <React.Fragment>
      <Order fromDispense='dispense' />
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
  connect(({ dispense, orders, codetable }) => ({
    dispense,
    orders,
    ctservice: codetable.ctservice,
    inventoryConsumable: codetable.inventoryconsumable,
  })),
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      const {
        dispatch,
        orders,
        onClose,
        dispense,
        onReloadClick,
        inventoryConsumable,
      } = props
      const { rows, summary, finalAdjustments } = orders
      const { addOrderDetails } = dispense

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
          case '1':
          case '5': {
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
              invoiceItemTypeFK: 1,

              // "costPrice": 0,
              unitPrice: o.unitPrice,
              quantity: o.quantity,
              subTotal: o.totalPrice,
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
          case '3': {
            obj = {
              itemCode: o.serviceCode,
              itemName: o.serviceName,
              subTotal: o.total,
              invoiceItemTypeFK: 4,
              retailVisitInvoiceService: {
                id: o.innerLayerId,
                concurrencyToken: o.innerLayerConcurrencyToken,
                serviceCenterServiceFK: o.serviceCenterServiceFK,
                retailService: {
                  ...o,
                },
              },
            }
            break
          }
          case '4': {
            const { uom } = inventoryConsumable.find(
              (c) => c.id === o.inventoryConsumableFK,
            )
            obj = {
              invoiceItemTypeFK: 2,
              itemCode: o.consumableCode,
              itemName: o.consumableName,
              subTotal: o.totalPrice,
              retailVisitInvoiceConsumable: {
                id: o.innerLayerId,
                concurrencyToken: o.innerLayerConcurrencyToken,
                inventoryConsumableFK: o.inventoryConsumableFK,
                expiryDate: o.expiryDate,
                batchNo: o.batchNo,
                retailConsumable: {
                  unitOfMeasurement: uom.name,
                  unitofMeasurementFK: uom.id,
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

          invoiceItemTypeFK: parseInt(o.type, 10),
          description: o.subject,
          adjAmt: o.adjAmount,
          totalAfterItemAdjustment: o.totalAfterItemAdjustment,
          totalAfterOverallAdjustment: o.totalAfterOverallAdjustment,
          totalAfterGST: o.totalAfterGST,
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
          onClose()
          dispatch({
            type: 'orders/updateState',
            payload: {
              rows: [],
            },
          })
          onReloadClick()
        }
      })
    },
    displayName: 'AddOrder',
  }),
)(AddOrder)
