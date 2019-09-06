import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import Yup from '@/utils/yup'
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
  EditableTableGrid,
} from '@/components'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import ReceivingItemDetails from './ReceivingItemDetails'
import moment from 'moment'
import { podoOrderType } from '@/utils/codes'

@withFormikExtend({
  mapPropsToValues: ({ deliveryOrder }) =>
    deliveryOrder.entity || deliveryOrder.default,
  displayName: 'deliveryOrder',
  validationSchema: Yup.object().shape({
    poNo: Yup.string().required(),
    deliveryOrderDate: Yup.string().required(),
  }),
})
export class DeliveryOrderDetails extends PureComponent {
  state = { selectedType: 'InventoryConsumable' }

  handleOnTypeChange = (e) => {
    const { option } = e
    this.setState({
      selectedType: option ? option.ctName : undefined,
    })
  }

  tableParas = {
    //schema={schema},
    columns: [
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
    ],
    columnExtensions: [
      {
        columnName: 'type',
        type: 'codeSelect',
        options: podoOrderType,
        label: 'Type',
        width: 135,
        onChange: this.handleOnTypeChange,
      },
      {
        columnName: 'code',
        type: 'codeSelect',
        //Consumable = InventoryConsumable | Medication = InventoryMedication | Vacination = InventoryVaccination
        code: this.state.selectedType,
      },
      {
        columnName: 'expiryDate',
        type: 'date',
        format: 'DD MMM YYYY',
      },
      {
        columnName: 'orderQty',
        type: 'number',
      },
      {
        columnName: 'bonusQty',
        type: 'number',
      },
      {
        columnName: 'totalReceived',
        type: 'number',
      },
      {
        columnName: 'totalBonusReceived',
        type: 'number',
        width: 180,
      },
      {
        columnName: 'currentReceivingQty',
        type: 'number',
        width: 150,
      },
      {
        columnName: 'currentReceivingBonusQty',
        type: 'number',
        width: 180,
      },
    ],
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue } = this.props
    setFieldValue('deliveryOrder_receivingItemList', rows)
  }

  onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]

      const { quantity, unitPrice } = newRow
    }
    return addedRows
  }

  render () {
    const isEditable = true
    const { props, ...tableParas } = this
    const { footer, theme, deliveryOrderDetails, values } = props
    //const {} = values

    //console.log('DOD', this)

    return (
      <React.Fragment>
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
                  name='deliveryOrderDate'
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

        <EditableTableGrid
          rows={values.deliveryOrder_receivingItemList}
          FuncProps={{
            edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            //showEditCommand: isEditable,
            //showDeleteCommand: isEditable,
            onCommitChanges: this.onCommitChanges,
            onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        />
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
