import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import { SizeContainer, withFormikExtend } from '@/components'
import { convertToConsultation } from '@/pages/Consultation/utils'
import { sendNotification } from '@/utils/realtime'
import {
  VISIT_TYPE,
  INVOICE_ITEM_TYPE_BY_NAME,
  ORDER_TYPE_TAB,
  CLINIC_TYPE,
  REVENUE_CATEGORY,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
} from '@/utils/constants'
import { roundTo, getUniqueId } from '@/utils/utils'
import { isPharmacyOrderUpdated } from '@/pages/Consultation/utils'
import {
  getRetailCautionAlertContent,
  getCautionAlertContent,
} from '@/pages/Widgets/Orders/utils'
import Order from '../../Widgets/Orders'

const styles = () => ({})

const AddOrder = ({
  footer,
  handleSubmit,
  dispatch,
  dispense,
  height,
  codetable: { ctservice = [], inventoryconsumable = [] },
  visitType,
  location,
  clinicInfo,
  isFirstLoad,
  visitRegistration,
}) => {
  const displayExistingOrders = async id => {
    const r = await dispatch({
      type: 'dispense/queryAddOrderDetails',
      payload: {
        invoiceId: id,
        isInitialLoading: location?.query?.isInitialLoading,
      },
    })

    if (r) {
      const {
        retailInvoiceAdjustment,
        retailInvoiceItem,
        drugAllergies = [],
      } = r
      const mapRetailItemPropertyToOrderProperty = o => {
        let obj
        switch (o.invoiceItemTypeFK) {
          case INVOICE_ITEM_TYPE_BY_NAME.SERVICE: {
            const serviceItem = ctservice.find(
              service =>
                service.serviceCenter_ServiceId ===
                o.retailVisitInvoiceService.serviceCenterServiceFK,
            )
            obj = {
              type: ORDER_TYPE_TAB.SERVICE,
              serviceFK: serviceItem?.serviceId,
              serviceCenterFK: serviceItem?.serviceCenterId,
              innerLayerId: o.retailVisitInvoiceService.id,
              innerLayerConcurrencyToken:
                o.retailVisitInvoiceService.concurrencyToken,
              ...o.retailVisitInvoiceService,
              ...o.retailVisitInvoiceService.retailService,
              isActive: serviceItem?.isActive,
              serviceCenterCategoryFK: serviceItem.serviceCenterCategoryFK,
            }
            break
          }

          case INVOICE_ITEM_TYPE_BY_NAME.CONSUMABLE: {
            const consumableItem = inventoryconsumable.find(
              consumable =>
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
          adjAmt: o.adjAmt,
          adjAmount: o.adjAmt,
          adjType: o.adjType,
          adjValue: o.adjValue,
          gstAmount: o.gstAmount,
          totalAfterGST: o.totalAfterGST,
          totalAfterItemAdjustment: o.totalAfterItemAdjustment,
          totalAfterOverallAdjustment: o.totalAfterOverallAdjustment,
        }
      }

      const assignRetailAdjustmentIdToOrderAdjustmentUid = o => {
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

      const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
      const removeItems =
        clinicTypeFK === CLINIC_TYPE.GP
          ? newRows.filter(row => row.type === ORDER_TYPE_TAB.SERVICE)
          : []

      if (removeItems.length) {
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            customWidth: 'md',
            openConfirmContent: getCautionAlertContent(removeItems),
            alignContent: 'left',
            isInformType: true,
            onConfirmSave: () => {},
          },
        })
      }

      const activeRows = (newRows || [])
        .filter(row => row.type !== ORDER_TYPE_TAB.SERVICE)
        .map(row => {
          return {
            ...row,
            uid: getUniqueId(),
          }
        })
      dispatch({
        type: 'orders/updateState',
        payload: {
          rows: activeRows,
          _originalRows: activeRows.map(r => ({ ...r })),
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
    if (dispense.ordersData) {
      dispatch({
        type: 'orders/upsertRows',
        payload: dispense.ordersData,
      })
      dispatch({
        type: 'dispense/updateState',
        payload: { ordersData: undefined },
      })
    }
  }

  useEffect(() => {
    const { entity } = dispense
    const { invoice } = entity || {}
    if (visitType === VISIT_TYPE.OTC && invoice) {
      displayExistingOrders(invoice.id)
    }
  }, [])
  return (
    <React.Fragment>
      <SizeContainer size='sm'>
        <div style={{ maxHeight: height - 128, overflow: 'auto' }}>
          <Order
            visitRegistration={visitRegistration}
            fromDispense={visitType === VISIT_TYPE.OTC}
            from='AddOrder'
          />
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
  withStyles(styles, { withTheme: true }),
  connect(
    ({
      dispense,
      orders,
      codetable,
      consultation,
      clinicInfo,
      forms,
      clinicSettings,
      user,
    }) => ({
      dispense,
      orders,
      consultation,
      codetable,
      clinicInfo,
      forms,
      clinicSettings: clinicSettings.settings || clinicSettings.default,
      user,
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
        codetable: { inventoryconsumable, ctservice },
        visitType,
        history,
        forms,
        clinicSettings,
        user,
      } = props
      const { rows, summary, finalAdjustments } = orders
      const { addOrderDetails } = dispense
      if (visitType === VISIT_TYPE.OTC) {
        const setIsDeletedIfWholeItemIsDeleted = (o, itemIsDeleted) => {
          if (o.isDeleted) return o

          return {
            ...o,
            isDeleted: itemIsDeleted,
          }
        }
        const mapRetailItemPropertyToApi = o => {
          let obj
          switch (o.type) {
            case ORDER_TYPE_TAB.SERVICE: {
              const { retailService, ...restValues } = o
              const { revenueCategoryFK } = ctservice.find(
                c => c.serviceCenter_ServiceId === o.serviceCenterServiceFK,
              )
              obj = {
                adjType: o.adjType,
                adjValue: o.adjValue,
                itemCode: o.serviceCode,
                itemName:
                  o.newServiceName && o.newServiceName.trim() !== ''
                    ? o.newServiceName
                    : o.serviceName,
                subTotal: roundTo(o.total),
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.SERVICE,
                unitPrice: roundTo(o.total) || 0,
                quantity: o.quantity,
                itemRevenueCategoryFK: revenueCategoryFK,
                isClaimable: true,
                retailVisitInvoiceService: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  serviceCenterServiceFK: o.serviceCenterServiceFK,
                  isDeleted: restValues.isDeleted,
                  visitOrderTemplateItemFK: restValues.visitOrderTemplateItemFK,
                  retailService: {
                    unitPrice: roundTo(o.total) || 0,
                    ...restValues,
                  },
                },
              }
              break
            }
            case ORDER_TYPE_TAB.CONSUMABLE: {
              const { uom, revenueCategory } = inventoryconsumable.find(
                c => c.id === o.inventoryConsumableFK,
              )
              const { retailConsumable, ...restValues } = o
              let actualUnitPrice = o.unitPrice || 0
              if (_.round(o.unitPrice * o.quantity, 2) !== o.totalPrice) {
                actualUnitPrice = _.round(o.totalPrice / o.quantity, 4)
              }
              actualUnitPrice = actualUnitPrice || 0
              obj = {
                invoiceItemTypeFK: INVOICE_ITEM_TYPE_BY_NAME.CONSUMABLE,
                adjType: o.adjType,
                adjValue: o.adjValue,
                itemCode: o.consumableCode,
                itemName: o.consumableName,
                subTotal: roundTo(o.totalPrice),
                unitPrice: actualUnitPrice,
                quantity: o.quantity,
                itemRevenueCategoryFK: revenueCategory.id,
                isClaimable: true,
                retailVisitInvoiceConsumable: {
                  id: o.innerLayerId,
                  concurrencyToken: o.innerLayerConcurrencyToken,
                  inventoryConsumableFK: o.inventoryConsumableFK,
                  expiryDate: o.expiryDate,
                  batchNo: o.batchNo,
                  isDeleted: restValues.isDeleted,
                  visitOrderTemplateItemFK: restValues.visitOrderTemplateItemFK,
                  retailConsumable: {
                    unitOfMeasurement: uom.name,
                    unitofMeasurementFK: uom.id,
                    unitPrice: actualUnitPrice,
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
            visitOrderTemplateItemFK: o.visitOrderTemplateItemFK,
            concurrencyToken: o.outerLayerConcurrencyToken,
            description: o.subject,
            adjAmt: o.adjAmount,
            totalAfterItemAdjustment: roundTo(o.totalAfterItemAdjustment),
            totalAfterOverallAdjustment: roundTo(o.totalAfterOverallAdjustment),
            totalAfterGST: roundTo(o.totalAfterGST),
            gstAmount: o.gstAmount,
            isDeleted: o.isDeleted,
            performingUserFK: o.performingUserFK,
            ...obj,
            revenueCategoryFK: obj.itemRevenueCategoryFK || o.revenueCategoryFK,
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
        }).then(r => {
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
      if (visitType === VISIT_TYPE.BF) {
        const billFirstPayload = convertToConsultation(consultation.entity, {
          consultationDocument: { rows: [] },
          orders,
          forms,
        })
        dispatch({
          type: `consultation/signOrder`,
          payload: {
            ...billFirstPayload,
            id: consultation.entity.id,
          },
        }).then(response => {
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
