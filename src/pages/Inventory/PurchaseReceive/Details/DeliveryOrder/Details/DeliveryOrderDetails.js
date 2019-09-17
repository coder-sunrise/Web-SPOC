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
  CodeSelect,
} from '@/components'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import ReceivingItemDetails from './ReceivingItemDetails'
import moment from 'moment'
import {
  podoOrderType,
  getInventoryItem,
  getInventoryItemList,
} from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'

let commitCount = 2201 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.string().required(),
  code: Yup.string().required(),
  name: Yup.string().required(),
  //orderQty: Yup.number().required(),
  //bonusQty: Yup.number().required(),
  //quantityReceived: Yup.number().min(0).required(),
  //totalBonusReceived: Yup.number().min(0).required(),

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
    onClickColumn: undefined,
    selectedItem: {},

    ConsumableItemList: [],
    MedicationItemList: [],
    VaccinationItemList: [],

    filterConsumableItemList: [],
    filterMedicationItemList: [],
    filterVaccinationItemList: [],
  }

  forceUpdate = () => {
    const { dispatch } = this.props
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  initializeStateItemList = async () => {
    const { dispatch } = this.props

    await podoOrderType.forEach((x) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then((list) => {
        const { inventoryItemList } = getInventoryItemList(list, x.itemFKName, x.stateName)
        this.setState({
          [x.stateName]: inventoryItemList
        })
      })
    })

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }


  componentDidMount() {
    this.initializeStateItemList()
  }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch, values } = this.props
    const { rows } = values
    const { row, option } = e
    const { value, itemFKName, stateName } = option
    const originItemList = this.state[stateName]

    const { inventoryItemList } = getInventoryItem(originItemList, value, itemFKName, rows)

    this.setState({
      [`filter${stateName}`]: inventoryItemList
    })

    this.forceUpdate()

    row.code = ''
    row.name = ''
    row.uom = ''
    row.orderQty = 0
    row.bonusQty = 0
    row.quantityReceived = 0
    row.totalBonusReceived = 0
    row.currentReceivingQty = 0
    row.currentReceivingBonusQty = 0

    this.setState({ onClickColumn: 'type' })
  }

  handleItemOnChange = (e, type) => {
    const { dispatch } = this.props
    const { option, row } = e
    const { sellingPrice, uom, name, value } = option

    if (type === 'code') {
      row.name = option.name
    } else {
      row.code = option.code
    }

    row.uom = option.uom

    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })

    this.forceUpdate()

    return { ...row }
  }

  onCommitChanges = ({ rows, deleted, changed }) => {
    console.log('onCommitChanges')
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
    } else {
      dispatch({
        type: 'deliveryOrder/upsertRow',
        payload: rows[0],
      })
    }

    return rows
  }

  onAddedRowsChange = (addedRows) => {
    console.log('onAddedRowsChange')
    if (addedRows.length > 0) {
      if (!addedRows.isFocused) {
        const { onClickColumn, selectedItem } = this.state
        let tempRow = addedRows[0]
        let tempOrderQty = tempRow.orderQty
        let tempBonusQty = tempRow.bonusQty
        let tempQuantityReceived = tempRow.quantityReceived
        let tempTotalBonusReceived = tempRow.totalBonusReceived
        let tempCurrentReceivingQty = tempRow.currentReceivingQty
        let tempCurrentReceivingBonusQty = tempRow.currentReceivingBonusQty

        if (onClickColumn === 'type') {
        } else if (onClickColumn === 'item') {
          // Set according outstanding list
          // orderQty
          // bonusQty
          // quantityReceived
          // totalBonusReceived
          // currentReceivingQty = Auto fill to maximum
          // currentReceivingBonusQty = Auto fill to maximum
        } else {
          tempCurrentReceivingQty =
            tempOrderQty - tempQuantityReceived < tempCurrentReceivingQty
              ? ''
              : tempCurrentReceivingQty
          //------------------------------------------------------
          tempCurrentReceivingBonusQty =
            tempBonusQty - tempTotalBonusReceived < tempCurrentReceivingBonusQty
              ? ''
              : tempCurrentReceivingBonusQty
          this.forceUpdate()
        }

        this.setState({ onClickColumn: undefined })

        return addedRows.map((row) => ({
          ...row,
          itemFK: selectedItem.value,
          currentReceivingQty: tempCurrentReceivingQty,
          currentReceivingBonusQty: tempCurrentReceivingBonusQty,
        }))
      } else {
        // Initialize new generated row
        this.setState({ onClickColumn: undefined })
        return addedRows.map((row) => ({
          ...row,
          orderQty: 0,
          bonusQty: 0,
          quantityReceived: 0,
          totalBonusReceived: 0,
          currentReceivingQty: 0,
          currentReceivingBonusQty: 0,
          isFocused: true,
        }))
      }
    }
    return addedRows
  }

  rowOptions = (row) => {
    if (row.type === 1) {
      return row.uid ? this.state.MedicationItemList : this.state.filterMedicationItemList
    } else if (row.type === 2) {
      return row.uid ? this.state.VaccinationItemList : this.state.filterVaccinationItemList
    } else if (row.type === 3) {
      return row.uid ? this.state.ConsumableItemList : this.state.filterConsumableItemList
    } else {
      return []
    }
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
          labelField: 'code',
          options: (row) => {
            return this.rowOptions(row)
          },
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e, 'code')
            }
          },
        },
        {
          columnName: 'name',
          type: 'select',
          labelField: 'name',
          options: (row) => {
            return this.rowOptions(row)
          },
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e, 'name')
            }
          },
        },
        {
          columnName: 'uom',
          type: 'select',
          labelField: 'uom',
          disabled: true,
          options: (row) => {
            if (row.type === 1) {
              return this.state.MedicationItemList
            } else if (row.type === 2) {
              return this.state.VaccinationItemList
            } else if (row.type === 3) {
              return this.state.ConsumableItemList
            } else {
              return []
            }
          },
        },
        {
          columnName: 'orderQty',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'bonusQty',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'quantityReceived',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'totalBonusReceived',
          type: 'number',
          width: 180,
          disabled: true,
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
            //edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: isEditable,
            showDeleteCommand: isEditable,
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
