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
  mapPropsToValues: ({ purchaseOrder }) => {
    return purchaseOrder.entity || purchaseOrder.default
  },
})
class index extends PureComponent {
  state = {
    showInvoiceAdjustment: false,
  }

  toggleInvoiceAdjustment = () => {
    this.setState((prevState) => ({
      showInvoiceAdjustment: !prevState.showInvoiceAdjustment,
    }))
  }

  onClickPrint = () => {
    console.log('onClickPrint', this.props)
  }

  calculateTotal = () => {}

  render () {
    const { classes, isEditable, values, setFieldValue } = this.props
    const { adjustmentList, purchaseOrder, purchaseOrderItems } = values
    console.log('PO Index', this.props)
    return (
      <div>
        <POForm />
        <Grid
          purchaseOrderItems={purchaseOrderItems}
          setFieldValue={setFieldValue}
        />
        <POSummary
          adjustmentList={adjustmentList}
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
