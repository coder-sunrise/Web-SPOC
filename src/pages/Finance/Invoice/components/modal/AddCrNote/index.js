import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import Warning from '@material-ui/icons/Error'
import Yup from '@/utils/yup'
// common components
import {
  CommonTableGrid,
  EditableTableGrid,
  withFormikExtend,
  GridContainer,
  GridItem,
  Button,
  Field,
  NumberInput,
  IconButton,
  Tooltip,
  Popconfirm,
  notification,
  SizeContainer,
} from '@/components'
import { showErrorNotification } from '@/utils/error'
import { CrNoteColumns, TableConfig } from './variables'
// sub components
import CrNoteForm from './CrNoteForm'
import Summary from './Summary'
import MiscCrNote from './MiscCrNote'

const crNoteItemSchema = Yup.object().shape({
  quantity: Yup.number().min(0).required(),
})

@connect(({ invoiceCreditNote }) => ({
  invoiceCreditNote,
}))
@withFormikExtend({
  name: 'invoiceCreditNote',
  // enableReinitialize: true,
  mapPropsToValues: ({ invoiceCreditNote }) => {
    return invoiceCreditNote
  },
  validate: (values) => {
    const { creditNoteBalance, finalCredit } = values
    const errors = {}
    if (creditNoteBalance - finalCredit < 0) {
      errors.finalCredit = `Total Credit Notes amount cannot be more than Net Amount. (Balance: $${creditNoteBalance.toFixed(
        2,
      )})`
    }
    return errors
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, onRefresh } = props
    // console.log({ values, props })
    const {
      creditNoteItem,
      invoicePayerFK,
      isStockIn,
      remark,
      finalCredit,
    } = values

    dispatch({
      type: 'invoiceCreditNote/upsert',
      payload: {
        generatedDate: moment().formatUTC(false),
        invoicePayerFK,
        isStockIn,
        remark,
        total: finalCredit,
        totalAftGST: finalCredit,
        creditNoteItem: creditNoteItem
          .filter((x) => x.isSelected)
          .map((selectedItem) => {
            if (selectedItem.itemType.toLowerCase() === 'misc') {
              selectedItem.isInventoryItem = false
              selectedItem.itemDescription = selectedItem.itemName
            } else {
              selectedItem.isInventoryItem = true
            }
            delete selectedItem.id
            delete selectedItem.concurrencyToken
            selectedItem.subTotal = selectedItem.totalAfterItemAdjustment
            return { ...selectedItem }
          }),
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        // Refresh invoice & invoicePayer
        onRefresh()
        // dispatch({
        //   type: 'settingClinicService/query',
        // })
      }
    })
  },
})
class AddCrNote extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedRows: [
        undefined,
      ],
    }

    this.handleOnChangeQuantity = _.debounce(this.handleOnChangeQuantity, 100)
  }

  handleEditRow = (row) => {}

  handleCalcCrNoteItem = (selection = undefined) => {
    let rowSelection = []
    const { selectedRows } = this.state
    rowSelection = selection || selectedRows

    const { setFieldValue, values } = this.props
    const { creditNoteItem } = values
    let finalCreditTotal = 0

    creditNoteItem.map((x) => {
      x.isSelected = false
      return null
    })

    let filterCreditNoteItem = creditNoteItem.filter(
      (o) =>
        rowSelection.includes(+o.id) || o.itemType.toLowerCase() === 'misc',
    )

    filterCreditNoteItem.map((x) => {
      x.isSelected = true
      finalCreditTotal += x.totalAfterItemAdjustment
      return finalCreditTotal
    })

    setFieldValue('finalCredit', finalCreditTotal)
  }

  handleSelectionChange = (selection) => {
    let newSelection = selection

    newSelection.includes(undefined)
      ? newSelection
      : newSelection.push(undefined)
    this.setState({ selectedRows: newSelection })

    this.handleCalcCrNoteItem(selection)
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue, values } = this.props
    const { creditNoteItem } = values
    // console.log('onCommitChanges1', { rows, deleted })

    if (deleted) {
      const selectedCrItem = creditNoteItem.find(
        (crItem) => crItem.id === deleted[0],
      )
      if (selectedCrItem.itemType.toLowerCase() !== 'misc') {
        notification.destroy()
        notification.error({
          message: (
            <div>
              <h4> </h4>
              <p>Sorry you are not allowed to delete this item.</p>
            </div>
          ),
          duration: 3,
        })
      } else {
        const filteredRows = rows.filter((x) => x.id !== selectedCrItem.id)
        setFieldValue('creditNoteItem', filteredRows)
        setTimeout(() => this.handleCalcCrNoteItem(), 100)
      }
    }

    return rows
  }

  handleDeleteRow = (row) => {
    if (row.itemType.toLowerCase() !== 'misc') {
      showErrorNotification(
        '',
        'Sorry you are not allowed to delete this item.',
      )
      return row
    }
    const { values, setFieldValue } = this.props
    const { creditNoteItem } = values
    creditNoteItem.splice(row.rowIndex, 1)
    setFieldValue('creditNoteItem', creditNoteItem)
    this.handleCalcCrNoteItem()
    return row
  }

  handleOnChangeQuantity = () => {
    const { values } = this.props
    const { creditNoteItem } = values

    creditNoteItem.map((x) => {
      x.totalAfterItemAdjustment = x.quantity * x.unitPrice
      return x
    })

    setTimeout(() => this.handleCalcCrNoteItem(), 100)
  }

  handleAddMiscItem = (newItem) => {
    const { values, setFieldValue } = this.props
    const { creditNoteItem } = values

    const tempID = creditNoteItem.reduce((smallestNegativeID, item) => {
      if (item.id < 0 && item.id < smallestNegativeID) return item.id
      return smallestNegativeID
    }, 0)
    setFieldValue('creditNoteItem', [
      ...creditNoteItem,
      { ...newItem, id: tempID },
    ])
    setTimeout(() => this.handleCalcCrNoteItem(), 100)
  }

  render () {
    const { handleSubmit, onConfirm, values } = this.props
    const { creditNoteItem, finalCredit } = values
    console.log({ creditNoteItem })
    return (
      <div>
        <CrNoteForm />
        <CommonTableGrid
          size='sm'
          // {...TableConfig}
          FuncProps={{
            selectable: true,
            selectConfig: {
              showSelectAll: false,
              rowSelectionEnabled: (row) => row.itemType !== 'Misc',
            },
            pager: false,
          }}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
          rows={creditNoteItem}
          columns={CrNoteColumns}
          columnExtensions={[
            {
              columnName: 'quantity',
              render: (row) => {
                const { quantity, originRemainingQty } = row
                return (
                  <Field
                    name={`creditNoteItem[${row.rowIndex}].quantity`}
                    render={(args) => {
                      return (
                        <SizeContainer size='sm'>
                          <NumberInput
                            size='sm'
                            style={{ width: '92%' }}
                            disabled={row.itemType.toLowerCase() === 'misc'}
                            onChange={() => this.handleOnChangeQuantity()}
                            min={1}
                            // max={row.originRemainingQty}
                            {...args}
                          />
                          {quantity > originRemainingQty ? (
                            <Tooltip
                              title={
                                <p style={{ color: 'red', fontSize: 12 }}>
                                  {`Item exceed quantity limits. (Maximum: ${originRemainingQty})`}
                                </p>
                              }
                            >
                              <IconButton>
                                <Warning color='error' />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </SizeContainer>
                      )
                    }}
                  />
                )
              },
            },
            {
              columnName: 'unitPrice',
              type: 'currency',
              currency: true,
            },
            {
              columnName: 'totalAfterItemAdjustment',
              type: 'currency',
              currency: true,
            },

            {
              columnName: 'action',
              align: 'center',
              width: 78,
              render: (row) => {
                return (
                  <div>
                    {row.itemType.toLowerCase() === 'misc' ? (
                      <Popconfirm
                        title='Are you sure you want to delete the selected item?'
                        onConfirm={() => {
                          this.handleDeleteRow(row)
                        }}
                      >
                        <Button size='sm' justIcon color='danger'>
                          <Delete />
                        </Button>
                      </Popconfirm>
                    ) : (
                      ''
                    )}
                  </div>
                )
              },
            },
          ]}
        />

        <Summary />
        <MiscCrNote
          handleAddMiscItem={this.handleAddMiscItem}
          handleCalcFinalTotal={this.handleCalcCrNoteItem}
          // {...this.props}
        />

        <GridContainer>
          <GridItem md={9}>
            <p>Note: Total Price($) are after GST.</p>
          </GridItem>
          <GridItem md={3} style={{ textAlign: 'right' }}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={
                finalCredit <= 0 ||
                creditNoteItem.filter(
                  (x) => x.quantity > x.originRemainingQty && x.isSelected,
                ).length > 0
              }
            >
              Save
            </Button>
            <Button color='danger' onClick={onConfirm}>
              Cancel
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default AddCrNote
