import React, { useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import { compose } from 'redux'
import Order from '../../Widgets/Orders'
import { withFormikExtend } from '@/components'
import { inventoryTypeName } from '@/utils/codes'

const styles = () => ({})

const AddOrder = ({ footer, handleSubmit, dispatch, dispense }) => {
  const displayExistingOrders = async (id) => {
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
            case '1':
            case '5': {
              obj = {
                ...o.retailVisitInvoiceDrug,
                innerLayerId: o.retailVisitInvoiceDrug.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceDrug.concurrencyToken,
                ...o.retailVisitInvoiceDrug.retailPrescriptionItem,
                type: o.invoiceItemTypeFK.toString(),
                subject: o.itemName,
                isActive: true,
                uid: o.id,
                corPrescriptionItemInstruction:
                  o.retailVisitInvoiceDrug.retailPrescriptionItem
                    .retailPrescriptionItemInstruction,
                corPrescriptionItemPrecaution:
                  o.retailVisitInvoiceDrug.retailPrescriptionItem
                    .retailPrescriptionItemPrecaution,
              }
              break
            }

            case '3': {
              obj = {
                innerLayerId: o.retailVisitInvoiceService.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceService.concurrencyToken,
                ...o.retailVisitInvoiceService.retailService,
              }
              break
            }

            case '4': {
              obj = {
                innerLayerId: o.retailVisitInvoiceConsumable.id,
                innerLayerConcurrencyToken:
                  o.retailVisitInvoiceConsumable.concurrencyToken,
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
    displayExistingOrders(invoice.id)
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
  connect(({ dispense, orders }) => ({
    dispense,
    orders,
  })),
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, orders, onClose, dispense, onReloadClick } = props
      const { rows, summary, finalAdjustments } = orders
      const { addOrderDetails } = dispense

      const retailInvoiceItem = rows.map((o) => {
        let obj
        switch (o.type) {
          case '1':
          case '5': {
            const {
              corPrescriptionItemInstruction,
              corPrescriptionItemPrecaution,
              ...restO
            } = o
            obj = {
              itemCode: o.drugCode,
              itemName: o.drugName,
              // "costPrice": 0,
              unitPrice: o.unitPrice,
              quantity: o.quantity,
              subTotal: o.totalPrice,
              // "adjType": "string",
              // "adjValue": 0,
              id: o.outerLayerId,
              concurrencyToken: o.outerLayerConcurrencyToken,
              retailVisitInvoiceDrug: {
                id: o.innerLayerId,
                concurrencyToken: o.innerLayerConcurrencyToken,
                inventoryMedicationFK: o.inventoryMedicationFK,
                expiryDate: o.expiryDate,
                batchNo: o.batchNo,
                dispensedQuanity: o.dispensedQuanity,
                retailPrescriptionItem: {
                  ...restO,
                  retailPrescriptionItemInstruction: corPrescriptionItemInstruction,
                  retailPrescriptionItemPrecaution: corPrescriptionItemPrecaution,
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

              retailVisitInvoiceService: {
                serviceCenterServiceFK: o.serviceCenterServiceFK,
                retailService: {
                  ...o,
                },
              },
            }
            break
          }
          case '4': {
            obj = {
              itemCode: o.consumableCode,
              itemName: o.consumableName,
              subTotal: o.totalPrice,

              retailVisitInvoiceConsumable: {
                inventoryConsumableFK: o.inventoryConsumableFK,
                expiryDate: o.expiryDate,
                batchNo: o.batchNo,
                retailConsumable: {
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
