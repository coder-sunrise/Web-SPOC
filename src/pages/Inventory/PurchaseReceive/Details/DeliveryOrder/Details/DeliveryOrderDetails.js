import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  OutlinedTextField,
  CommonTableGrid,
  Button,
  CommonModal,
} from '@/components'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import ReceivingItemDetails from './ReceivingItemDetails'

@connect(({ deliveryOrderDetails }) => ({
  deliveryOrderDetails,
}))
@withFormikExtend({ displayName: 'deliveryOrderDetails' })
export class DeliveryOrderDetails extends PureComponent {
  editRow = (row, e) => {}

  toggleReceivingItemModal = () => {
    this.props.dispatch({
      type: 'deliveryOrderDetails/updateState',
      payload: {
        showModal: !this.props.deliveryOrderDetails.showModal,
      },
    })
  }

  render () {
    const { props } = this
    const { footer, theme, deliveryOrderDetails } = props
    const cfg = {
      toggleReceivingItemModal: this.toggleReceivingItemModal,
    }

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <FastField
                    name='poNo'
                    render={(args) => {
                      return (
                        <TextField
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.deliveryOrderNo',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='invoiceDate'
                    render={(args) => {
                      return (
                        <DatePicker
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.deliveryOrderDate',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>

            <GridItem xs={12} md={1} />

            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <OutlinedTextField
                    label={formatMessage({
                      id: 'inventory.pr.detail.dod.remarks',
                    })}
                    multiline
                    rowsMax={2}
                    rows={2}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>

          <GridItem xs={12} md={11}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.receivingDetails',
              })}
            </h4>
          </GridItem>

          <CommonTableGrid
            type='deliveryOrderDetails'
            onRowDoubleClick={this.editRow}
            columns={[
              { name: 'type', title: 'Type' },
              { name: 'code', title: 'Code' },
              { name: 'name', title: 'Name' },
              { name: 'uom', title: 'UOM' },
              { name: 'orderQty', title: 'Order Qty' },
              { name: 'bonusQty', title: 'Bonus Qty' },
              { name: 'totalReceived', title: 'Total Received' },
              { name: 'totalBonusReceived', title: 'Total Bonus Received' },
              { name: 'currentReceivingQty', title: 'Current Receiving Qty' },
              {
                name: 'currentReceivingBonusQty',
                title: 'Current Receiving Bonus Qty',
              },
              { name: 'batchNo', title: 'Batch No.' },
              { name: 'expiryDate', title: 'Expiry Date' },
              {
                name: 'action',
                title: 'Action',
              },
            ]}
            columnExtensions={[
              {
                columnName: 'expiryDate',
                type: 'date',
                format: 'DD MMM YYYY',
              },
              {
                columnName: 'action',
                sortingEnabled: false,
                align: 'center',
                render: (row) => {
                  return (
                    <Button
                      size='sm'
                      onClick={() => {
                        this.editRow(row)
                      }}
                      justIcon
                      color='primary'
                    >
                      <Edit />
                    </Button>
                  )
                },
              },
            ]}
            FuncProps={{
              pager: false,
            }}
          />
        </div>
        <CommonModal
          open={deliveryOrderDetails.showModal}
          observe='ReceivingItemDetail'
          title={'Receiving Item'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleReceivingItemModal}
          onConfirm={this.toggleReceivingItemModal}
        >
          <ReceivingItemDetails {...cfg} {...this.props} />
        </CommonModal>
        <Button
          onClick={this.toggleReceivingItemModal}
          hideIfNoEditRights
          color='info'
          link
        >
          <Add />
          {formatMessage({
            id: 'inventory.pr.detail.dod.addNewDeliveryOrder',
          })}
        </Button>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default DeliveryOrderDetails
