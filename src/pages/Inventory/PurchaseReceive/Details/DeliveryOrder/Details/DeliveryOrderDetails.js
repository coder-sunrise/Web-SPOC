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
  CodeSelect
} from '@/components'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import ReceivingItemDetails from './ReceivingItemDetails'
import moment from 'moment'
import { podoOrderType, getInventoryItem } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'

let commitCount = 2201 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.string().required(),
  code: Yup.number().required(),
  //name: Yup.number().required(),
  //orderQty: Yup.number().min(1).required(),
  orderQty: Yup.number().min(0).required(),
  bonusQty: Yup.number().min(0).required(),
  quantityReceived: Yup.number().min(0).required(),
  totalBonusReceived: Yup.number().min(0).required(),

  currentReceivingQty: Yup.number().min(0).required(),
  currentReceivingBonusQty: Yup.number().min(0).required(),
})

@withFormikExtend({
  mapPropsToValues: ({ deliveryOrder }) => {
    console.log('mapPropsToValues', deliveryOrder)
    return deliveryOrder.entity || deliveryOrder.default
  },
  enableReinitialize: true,
  displayName: 'deliveryOrder',
  validationSchema: Yup.object().shape({
    poNo: Yup.string().required(),
    deliveryOrderDate: Yup.string().required(),
    rows: Yup.array().compact((v) => v.isDeleted).of(receivingDetailsSchema),
  }),

})
export class DeliveryOrderDetails extends PureComponent {
  state = {
    selectedType: 'InventoryConsumable',
    selectedItem: {},
    itemDropdownList: [],
  }

  // handleOnTypeChange = (e) => {
  //   const { option } = e
  //   this.setState({
  //     selectedType: option ? option.ctName : undefined,
  //   })
  // }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch, values } = this.props
    const { option, row } = e
    const { ctName, value, itemFKName } = option
    const { rows } = values

    this.setState({
      onClickColumn: 'Type',
    })

    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: ctName,
      },
    }).then((list) => {
      const { inventoryItemList } = getInventoryItem(list, value, itemFKName, rows)
      this.setState({
        itemDropdownList: inventoryItemList,
      })
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    })
  }

  handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice, uom, name, value } = option
    this.setState({
      selectedItem: option,
    })
    return { ...row }
  }

  // onCommitChanges = ({ rows, deleted }) => {
  //   const { setFieldValue } = this.props
  //   let newRows = rows

  //   if (deleted) {
  //     newRows = rows.filter((x) => x.uid !== deleted[0])
  //   } else {
  //     console.log('onCommitChanges', rows)
  //   }

  //   setFieldValue('rows', newRows)
  //   return newRows
  // }

  onCommitChanges = ({ rows, deleted, changed }) => {
    const { dispatch } = this.props

    if (deleted) {
      dispatch({
        type: 'deliveryOrder/deleteRow',
        payload: deleted[0],
      })
    } else if (changed) {
      const existUid = Object.keys(changed)[0]

      dispatch({
        type: 'deliveryOrder/upsertRow',
        payload: { uid: existUid, ...changed[existUid] },
      })

    }
    else {
      dispatch({
        type: 'deliveryOrder/upsertRow',
        payload: rows[0],
      })
    }


    return rows
  }

  onAddedRowsChange = (addedRows) => {
    //currentReceivingQty
    //currentReceivingBonusQty
    if (addedRows.length > 0) {
      const { selectedItem } = this.state
      console.log('onAddedRowsChange', addedRows)
      return addedRows.map((row) => ({
        ...row,
        itemFK: selectedItem.id || undefined,
        currentReceivingQty: row.orderQty - row.quantityReceived < row.currentReceivingQty ? undefined : row.currentReceivingQty,
        currentReceivingBonusQty: row.bonusQty - row.totalBonusReceived < row.currentReceivingBonusQty ? undefined : row.currentReceivingBonusQty
      }))
    }
    return addedRows
  }

  render() {
    const isEditable = true
    const { props } = this
    const { footer, deliveryOrderDetails, values } = props
    const { rows } = values

    console.log('DO Details', this.props)

    const tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'orderQty', title: 'Order Qty' },
        { name: 'bonusQty', title: 'Bonus Qty' },
        { name: 'quantityReceived', title: 'Total Received' },
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
          type: 'select',
          options: podoOrderType,
          onChange: (e) => {
            if (e.option) {
              this.handleOnOrderTypeChanged(e)
            }
          },
        },
        {
          columnName: 'code',
          type: 'select',
          labelField: 'name',
          options: this.state.itemDropdownList,
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }
          },
          render: (row) => {
            if (row.uid) {
              const podoType = podoOrderType.filter(
                (x) => x.value === row.type,
              )[0]
              const { ctName, itemFKName } = podoType

              return (
                <FastField
                  name={`rows[${row.rowIndex - 1}].${itemFKName}`}
                  render={(args) => {
                    console.log(args)
                    return (
                      <CodeSelect
                        text
                        labelField='code'
                        code={ctName}
                        {...args}
                      />
                    )
                  }}
                />
              )
            }
          }
        },
        {
          columnName: 'name',
          type: 'select',
          labelField: 'displayValue',
          options: this.state.itemDropdownList,
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }
          },
          render: (row) => {
            if (row.uid) {
              const podoType = podoOrderType.filter(
                (x) => x.value === row.type,
              )[0]
              const { ctName, itemFKName } = podoType

              return (
                <FastField
                  name={`rows[${row.rowIndex - 1}].${itemFKName}`}
                  render={(args) => {
                    console.log(args)
                    return (
                      <CodeSelect
                        text
                        labelField='displayValue'
                        code={ctName}
                        {...args}
                      />
                    )
                  }}
                />
              )
            }
          }
        },
        {
          columnName: 'uom',
          disabled: true,
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
          columnName: 'quantityReceived',
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
        {
          columnName: 'expiryDate',
          type: 'date',
          format: 'DD MMM YYYY',
        },
      ],
    }

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
          getRowId={(r) => r.uid}
          rows={rows}
          schema={receivingDetailsSchema}
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
          {...tableParas}
        />
        {footer &&
          footer({
            align: 'center',
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
