import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import Add from '@material-ui/icons/Add'
import {
  CardContainer,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  OutlinedTextField,
  EditableTableGrid,
  Button,
  CodeSelect,
  CommonModal,
} from '@/components'
import POForm from './POForm'
import Grid from './Grid'
import POSummary from './POSummary'
import InvoiceAdjustment from './InvoiceAdjustment'

@connect(({ purchaseOrder }) => ({
  purchaseOrder,
}))
@withFormikExtend({
  displayName: 'purchaseOrder',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseOrder }) => {
    console.log('mapPropsToValues', purchaseOrder)
    return purchaseOrder.entity || purchaseOrder.default
  },
})
class index extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'purchaseOrder/fakeQueryDone',
    })
  }

  state = {
    showInvoiceAdjustment: false,
  }

  toggleInvoiceAdjustment = () => {
    this.setState((prevState) => ({
      showInvoiceAdjustment: !prevState.showInvoiceAdjustment,
    }))
  }

  calculateInvoice = (rows) => {
    /*-------------------------------------------*/
    // Retrieve from /api/GSTSetup
    const isClinicGSTEnabled = true
    const gstPercentage = 7.0
    /*-------------------------------------------*/
    const { values, setFieldValue } = this.props
    const { purchaseOrderItems, adjustmentList } = values
    const items = rows || purchaseOrderItems
    let tempInvoiceTotal = 0
    let invoiceTotal = 0
    let invoiceGST = 0

    // Calculate all unitPrice
    items.forEach((row) => {
      if (!row.isDeleted) {
        tempInvoiceTotal += row.totalPrice
        row.tempSubTotal = row.totalPrice
      }
    })

    // Check is there any adjustment was added
    if (adjustmentList) {
      // Calculate adjustment for added items
      adjustmentList.forEach((adj, adjKey, adjArr) => {
        // Init adjAmount for percentage
        if (adj.isPercentage) {
          adj.adjAmount = 0
        }

        items.map((item) => {
          if (!item.isDeleted) {
            if (adj.isPercentage) {
              item[adj.adjTitle] = item.tempSubTotal * (adj.adjPercentage / 100)
              item.tempSubTotal += item[adj.adjTitle]
              adj.adjAmount += item[adj.adjTitle]
            } else {
              item[adj.adjTitle] =
                item.tempSubTotal / tempInvoiceTotal * adj.adjAmount
              item.tempSubTotal += item[adj.adjTitle]
            }

            if (isClinicGSTEnabled) {
              // If Inclusive GST checked --> item.itemLevelGST = item.tempSubTotal * (gstPercentage / 107)
              // Else                     --> item.itemLevelGST = item.tempSubTotal * (gstPercentage / 100)
              item.itemLevelGST = item.tempSubTotal * (gstPercentage / 100)
            } else {
              item.itemLevelGST = 0
            }

            // Sum up all itemLevelGST & invoiceTotal at last iteration
            if (Object.is(adjArr.length - 1, adjKey)) {
              invoiceGST += item.itemLevelGST
              invoiceTotal += item.itemLevelGST + item.tempSubTotal
            }
          }
        })
      })
    }

    setTimeout(() => {
      setFieldValue('purchaseOrder.invoiceGST', invoiceGST)
    }, 1)

    setTimeout(() => {
      setFieldValue('purchaseOrder.invoiceTotal', invoiceTotal)
    }, 1)
  }

  onClickPrint = () => {
    console.log('onClickPrint', this.props)
  }

  calculateTotal = () => {}

  render () {
    const { classes, isEditable, values, setFieldValue, dispatch } = this.props
    const {
      adjustmentList,
      purchaseOrderAdjustment,
      purchaseOrder,
      //purchaseOrderItems,
      rows,
    } = values
    console.log('PO Index', this.props)

    return (
      <div>
        <POForm />
        <Grid
          rows={rows}
          dispatch={dispatch}
          setFieldValue={setFieldValue}
          calculateInvoice={this.calculateInvoice}
        />
        <POSummary
          adjustmentList={adjustmentList}
          purchaseOrderAdjustment={purchaseOrderAdjustment}
          setFieldValue={setFieldValue}
          toggleInvoiceAdjustment={this.toggleInvoiceAdjustment}
        />
        <GridContainer
          direction='row'
          justify='flex-end'
          alignItems='flex-end'
          style={{ marginTop: 20 }}
        >
          <Button color='danger'>
            {formatMessage({
              id: 'inventory.pr.detail.pod.cancelpo',
            })}
          </Button>
          <Button color='primary'>
            {formatMessage({
              id: 'inventory.pr.detail.pod.save',
            })}
          </Button>
          <Button color='success'>
            {formatMessage({
              id: 'inventory.pr.detail.pod.finalize',
            })}
          </Button>
          <Button color='info' onClick={this.onClickPrint}>
            {formatMessage({
              id: 'inventory.pr.detail.print',
            })}
          </Button>
        </GridContainer>

        <CommonModal
          open={this.state.showInvoiceAdjustment}
          title='Add Invoice Adjustment'
          maxWidth='sm'
          bodyNoPadding
          onClose={() => this.toggleInvoiceAdjustment()}
          onConfirm={() => this.toggleInvoiceAdjustment()}
        >
          <InvoiceAdjustment
            adjustmentList={adjustmentList}
            setFieldValue={setFieldValue}
          />
        </CommonModal>
      </div>
    )
  }
}

export default index
