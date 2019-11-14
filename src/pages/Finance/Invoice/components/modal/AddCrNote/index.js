import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Delete from '@material-ui/icons/Delete'
import Warning from '@material-ui/icons/Error'
// common components
import {
  CommonTableGrid,
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
import { roundToTwoDecimals } from '@/utils/utils'
import { CrNoteColumns } from './variables'
// sub components
import CrNoteForm from './CrNoteForm'
import Summary from './Summary'
import MiscCrNote from './MiscCrNote'

@connect(({ invoiceCreditNote, invoiceDetail }) => ({
  invoiceCreditNote,
  invoiceDetail: invoiceDetail.entity,
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
      errors.finalCredit = `Total Credit Notes amount cannot be more than Outstanding Amount. (Balance: $${creditNoteBalance.toFixed(
        2,
      )})`
    }
    return errors
  },
  handleSubmit: (values, { props }) => {
    const { invoiceDetail, dispatch, onConfirm, onRefresh } = props
    // console.log({ values, props })
    const {
      creditNoteItem,
      invoicePayerFK,
      isStockIn,
      remark,
      finalCredit,
    } = values
    const gstAmount = creditNoteItem.reduce(
      (totalGstAmount, item) =>
        item.isSelected ? totalGstAmount + item.gstAmount : totalGstAmount,
      0,
    )
    const payload = {
      generatedDate: moment().formatUTC(false),
      invoicePayerFK,
      isStockIn,
      remark,
      gstAmt: roundToTwoDecimals(gstAmount),
      gstValue: invoiceDetail.gstValue,
      total: finalCredit,
      totalAftGST: finalCredit,
      creditNoteItem: creditNoteItem
        .filter((x) => x.isSelected)
        .map((selectedItem) => {
          const { id, concurrencyToken, ...restProps } = selectedItem

          const item = {
            ...restProps,
            isInventoryItem:
              restProps.itemType.toLowerCase() === 'misc' ||
              restProps.itemType.toLowerCase() === 'service',
            subTotal: restProps.totalAfterGST,
            itemDescription: restProps.itemName,
          }
          return { ...item }
        }),
    }

    console.log({ payload })
    dispatch({
      type: 'invoiceCreditNote/upsert',
      payload,
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
      selectedRows: [],
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

    const finalCreditTotal = creditNoteItem.reduce((total, item) => {
      if (
        rowSelection.includes(item.id) ||
        item.itemType.toLowerCase() === 'misc'
      )
        return total + item.totalAfterGST
      return total
    }, 0)
    setFieldValue('finalCredit', roundToTwoDecimals(finalCreditTotal))
  }

  handleSelectionChange = (selection) => {
    const { values, setFieldValue } = this.props
    const newCreditNoteItem = values.creditNoteItem.map((item) => ({
      ...item,
      isSelected: selection.includes(item.id),
    }))
    setFieldValue('creditNoteItem', newCreditNoteItem)
    this.setState({ selectedRows: selection })

    this.handleCalcCrNoteItem(selection)
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue, values } = this.props
    const { creditNoteItem } = values

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
                            format='0.0'
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
              columnName: 'totalAfterGST',
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
                        <Tooltip title='Delete Misc. Item' placement='top-end'>
                          <Button size='sm' justIcon color='danger'>
                            <Delete />
                          </Button>
                        </Tooltip>
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
            <Button color='danger' onClick={onConfirm}>
              Cancel
            </Button>
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
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default AddCrNote
