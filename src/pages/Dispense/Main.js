import React, { Component } from 'react'
// common component
import { connect } from 'dva'
import { formatMessage } from 'umi'
import moment from 'moment'
import {
  withFormikExtend,
  notification,
  CommonModal,
  Button,
} from '@/components'
import { calculateAmount, navigateDirtyCheck } from '@/utils/utils'
import Yup from '@/utils/yup'
import { VISIT_TYPE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import ViewPatientHistory from '@/pages/Consultation/ViewPatientHistory'
import DispenseDetails from './DispenseDetails/WebSocketWrapper'
import { DispenseItemsColumnExtensions } from './variables'
import _ from 'lodash'
import patient from '@/models/patient'
import { orderTypes } from '../Consultation/utils'

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
    return items?.map(m => {
      let tempDispenseItem = []
      const matchItem = values.dispenseItems.filter(
        d => d.type === m.type && d.id === m.id && d.dispenseQuantity > 0,
      )
      if (matchItem.length) {
        matchItem.forEach(item => {
          tempDispenseItem.push({
            ...getTransaction(item),
            inventoryFK: item[inventoryFiledName],
          })
        })
      }
      return {
        ...m,
        tempDispenseItem,
      }
    })
  }

  const _values = {
    ...values,
    consumable: updateTempDispenseItem(
      values.consumable,
      'inventoryConsumableFK',
    ),
    dispenseItems: undefined,
    defaultExpandedGroups: undefined,
  }
  return _values
}

const validDispense = (dispenseItems = []) => {
  let isValid = true
  const dispensedItems = dispenseItems.filter(d => d.stockFK)
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

    let matchItems = dispenseItems.filter(
      d =>
        d.type === dispensedItems[index].type &&
        d.id === dispensedItems[index].id,
    )

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
    const { dispense = {} } = pops
    let obj = dispense.entity || dispense.default
    const result = calculateInvoiceAmounts(obj)
    return result
  },
  validationSchema: Yup.object().shape({}),
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
@connect(({ orders, formik, dispense, patient, clinicSettings }) => ({
  orders,
  formik,
  dispense,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  patient,
}))
class Main extends Component {
  state = {
    hasShowOrderModal: false,
    isShowOrderUpdated: false,
    dispenseItems: [],
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  componentWillUnmount = () => {
    this.props.dispatch({
      type: `dispense/updateState`,
      payload: {
        queryCodeTablesDone: false,
      },
    })
  }
  componentDidMount = async () => {
    const {
      dispatch,
      values,
      dispense,
      clinicSettings,
      visitRegistration,
    } = this.props

    const { entity = {} } = visitRegistration
    const { visit = {} } = entity
    dispatch({
      type: 'dispense/incrementLoadCount',
    })
    // set default language based on patient tranlsation and clinic setting.
    const preferLanguage =
      (patient && patient.translationLinkFK) === 5
        ? 'JP'
        : clinicSettings.primaryPrintoutLanguage
    this.setState({ selectedLanguage: [preferLanguage] })
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

    if (values.id) {
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
              editingOrder: true,
            },
          })
          reloadDispense(this.props)
        }
      })
    }
  }

  editOrder = e => {
    const { values } = this.props

    navigateDirtyCheck({
      onProceed: this._editOrder,
    })(e)
  }

  handleReloadClick = () => {
    reloadDispense(this.props, 'refresh')
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
        })
      }
    }
  }

  checkExpiredItems = () => {
    if (
      (this.props.values.dispenseItems || []).find(
        item =>
          item.expiryDate &&
          moment(item.expiryDate).startOf('day') < moment().startOf('day'),
      )
    ) {
      return true
    }
    return false
  }

  checkBillFirst = () => {
    const {
      dispatch,
      values,
      dispense,
      clinicSettings,
      visitRegistration,
      history,
    } = this.props
    const { location } = history
    const { query } = location
    if (
      !dispense.queryCodeTablesDone ||
      this.state.hasShowOrderModal ||
      query.backToDispense
    ) {
      return
    }
    const { entity = {} } = visitRegistration
    const { visit = {} } = entity
    const { service = [], consumable = [] } = values
    const isEmptyDispense = service.length === 0 && consumable.length === 0
    const accessRights = Authorized.check('queue.dispense.editorder')
    const noClinicalObjectRecord = !values.clinicalObjectRecordFK

    if (
      accessRights &&
      accessRights.rights !== 'hidden' &&
      isEmptyDispense &&
      noClinicalObjectRecord &&
      !query.backToDispense
    ) {
      this.setState(
        prevState => {
          return {
            showCautionAlert: !prevState.showCautionAlert,
            hasShowOrderModal: true,
          }
        },
        () => {
          this.editOrder()
          dispatch({
            type: 'dispense/incrementLoadCount',
          })
        },
      )
    }

    if (dispense.loadCount === 0) {
      dispatch({
        type: 'dispense/incrementLoadCount',
      })
    }
  }
  render() {
    this.checkBillFirst()
    const {
      classes,
      handleSubmit,
      values,
      dispense,
      codetable,
      testProps,
    } = this.props

    return (
      <div className={classes.root}>
        <DispenseDetails
          {...this.props}
          onSaveClick={handleSubmit}
          onEditOrderClick={this.editOrder}
          onFinalizeClick={this.makePayment}
          onReloadClick={this.handleReloadClick}
          onLabLabelClick={this.handleLabLabelClick}
          isIncludeExpiredItem={this.checkExpiredItems()}
        />
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
