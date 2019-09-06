import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import Add from '@material-ui/icons/Add'
import { Divider } from '@material-ui/core'
import POSummary from './POSummary'
import Grid from './Grid'
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
} from '@/components'

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
  constructor (props) {
    super(props)

    const { type } = props

    // this.tableParas = {
    //   columns: [
    //     { name: 'type', title: 'Type' },
    //     { name: 'code', title: 'Code' },
    //     { name: 'name', title: 'Name' },
    //     { name: 'uom', title: 'UOM' },
    //     { name: 'orderQty', title: 'Order Qty' },
    //     { name: 'bonusQty', title: 'Bonus Qty' },
    //     { name: 'totalReceived', title: 'Total Received' },
    //     { name: 'totalPrice', title: 'Total Price' },
    //   ],
    //   columnExtensions: [
    //     {
    //       columnName: 'totalReceived',
    //       type: 'number',
    //       currency: true,
    //     },
    //     {
    //       columnName: 'totalPrice',
    //       type: 'number',
    //       currency: true,
    //     },
    //   ],
    // }

    // this.commitChanges = props.setArrayValue
    // this.onAddedRowsChange = (addedRows) => {
    //   return addedRows.map((row) => ({
    //     onsetDate: moment(),
    //     ...row,
    //     confirmedByUserFK: props.user.data.id,
    //     isConfirmed: true,
    //     type,
    //   }))
    // }
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'purchaseOrder/query',
    })
  }

  render () {
    const { classes, isEditable, purchaseOrder } = this.props
    return (
      <div>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='poNo'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.pono',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='status'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.status',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='expectedDeliveryDate'
                  render={(args) => {
                    return (
                      <DatePicker
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.expectedDeliveryDate',
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
                          id: 'inventory.pr.detail.pod.invoiceDate',
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
                <FastField
                  name='poDate'
                  render={(args) => {
                    return (
                      <DatePicker
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.poDate',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <OutlinedTextField
                  label={formatMessage({
                    id: 'inventory.pr.detail.pod.shippingAdd',
                  })}
                  multiline
                  rowsMax={2}
                  rows={2}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='invoiceNo'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.invoiceNo',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem xs={12} md={11}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.pod.supplierInfo',
              })}
            </h4>
            <Divider />
          </GridItem>

          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='supplier'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.supplier',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='contactPerson'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.contactPerson',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <OutlinedTextField
                  label={formatMessage({
                    id: 'inventory.pr.detail.pod.supplierAdd',
                  })}
                  multiline
                  rowsMax={2}
                  rows={2}
                />
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem xs={12} md={1} />

          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='contactNo'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.contactNo',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='faxNo'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.faxNo',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>

        {/* <EditableTableGrid
          //rows={rows}
          //schema={schema}
          FuncProps={{
            edit: isEditable,
            pager: false,
            pagerConfig: {
              containerExtraComponent: (
                <Button
                  //onClick={this.toggleModal}
                  hideIfNoEditRights
                  color='info'
                  link
                >
                  <Add />Add Item
                </Button>
              ),
            },
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: isEditable,
            showDeleteCommand: isEditable,
            //onCommitChanges: this.commitChanges,
            //onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        /> */}

        <Grid />

        <Button
          // onClick={this.toggleAddPaymaneModal}
          hideIfNoEditRights
          color='info'
          link
        >
          <Add />
          {formatMessage({
            id: 'inventory.pr.detail.pod.addItem',
          })}
        </Button>
        <POSummary />

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
          <Button color='info'>
            {formatMessage({
              id: 'inventory.pr.detail.print',
            })}
          </Button>
        </GridContainer>
      </div>
    )
  }
}

export default index
