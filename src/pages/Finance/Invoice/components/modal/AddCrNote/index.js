import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
// common components
import {
  CommonTableGrid,
  EditableTableGrid,
  withFormikExtend,
  GridContainer,
  GridItem,
  Button,
} from '@/components'
import { showErrorNotification } from '@/utils/error'
import { CrNoteColumns, TableConfig } from './variables'
// sub components
import CrNoteForm from './CrNoteForm'
import Summary from './Summary'
import MiscCrNote from './MiscCrNote'

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
      errors.finalCredit =
        'Total Credit Notes amount cannot be more than Net Amount.'
    }
    return errors
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props
    console.log({ values })
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
        invoicePayerFK,
        isStockIn,
        remark,
        total: finalCredit,
        totalAftGST: finalCredit,
        creditNoteItem: creditNoteItem.filter((x) => x.isSelected),
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        // Refresh invoice & invoicePayer

        // dispatch({
        //   type: 'settingClinicService/query',
        // })
      }
    })
  },
})
class AddCrNote extends Component {
  state = {
    selectedRows: [
      undefined,
    ],
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
    creditNoteItem.splice(row.rowIndex - 1, 1)
    setFieldValue('creditNoteItem', creditNoteItem)
    this.handleCalcCrNoteItem()
    return row
  }

  render () {
    const { handleSubmit, onConfirm, values } = this.props
    const { creditNoteItem, finalCredit } = values
    return (
      <div>
        <CrNoteForm />
        <CommonTableGrid
          {...TableConfig}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
          onSelectRow={this.handleSelectRows}
          rows={creditNoteItem}
          columns={CrNoteColumns}
          columnExtensions={[
            { columnName: 'quantity', type: 'number' },
            // {
            //   columnName: 'unitPrice',
            //   type: 'currency',
            //   currency: true,
            // },

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
                      ''
                    ) : (
                      <Button
                        size='sm'
                        onClick={() => {
                          this.handleEditRow(row)
                        }}
                        justIcon
                        color='primary'
                      >
                        <Edit />
                      </Button>
                    )}

                    {row.itemType.toLowerCase() === 'misc' ? (
                      <Button
                        size='sm'
                        onClick={() => {
                          this.handleDeleteRow(row)
                        }}
                        justIcon
                        color='danger'
                      >
                        <Delete />
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                )
              },
            },
          ]}
        />

        {/* <EditableTableGrid
          {...TableConfig}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
          onSelectRow={this.handleSelectRows}
          rows={creditNoteItem}
          columns={CrNoteColumns}
          columnExtensions={[
            { columnName: 'quantity', type: 'number' },
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
                      ''
                    ) : (
                      <Button
                        size='sm'
                        onClick={() => {
                          this.handleEditRow(row)
                        }}
                        justIcon
                        color='primary'
                      >
                        <Edit />
                      </Button>
                    )}

                    {row.itemType.toLowerCase() === 'misc' ? (
                      <Button
                        size='sm'
                        onClick={() => {
                          this.handleDeleteRow(row)
                        }}
                        justIcon
                        color='danger'
                      >
                        <Delete />
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                )
              },
            },
          ]}
          EditingProps={{
            showAddCommand: false,
            showEditCommand: true,
            showDeleteCommand: true,
            // onCommitChanges: this.onCommitChanges,
            // onAddedRowsChange: this.onAddedRowsChange,
          }}
        /> */}

        <Summary />
        <MiscCrNote
          handleCalcFinalTotal={this.handleCalcCrNoteItem}
          {...this.props}
        />

        <GridContainer>
          <GridItem md={9}>
            <p>Note: Total Price($) are after GST.</p>
          </GridItem>
          <GridItem md={3}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={finalCredit <= 0}
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
