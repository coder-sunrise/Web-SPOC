import React, { Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Delete from '@material-ui/icons/Delete'
import Warning from '@material-ui/icons/Error'
import { withStyles } from '@material-ui/core'
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
import { roundTo } from '@/utils/utils'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
// sub components
import CrNoteForm from './CrNoteForm'
import Summary from './Summary'
import MiscCrNote from './MiscCrNote'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'

const styles = theme => ({
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
    lineHeight: '16px',
  },
})
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
  validate: values => {
    const { creditNoteBalance, finalCredit, payerType } = values
    const errors = {}
    if (creditNoteBalance - finalCredit < 0) {
      const amountType =
        payerType === INVOICE_PAYER_TYPE.PATIENT
          ? 'Patient Payable Amount'
          : 'Outstanding Amount'
      errors.finalCredit = `Total Credit Notes amount cannot be more than ${amountType}. (Balance: $${creditNoteBalance.toFixed(
        2,
      )})`
    }
    return errors
  },
  handleSubmit: (values, { props }) => {
    const { invoiceDetail, dispatch, onConfirm, onRefresh } = props
    const {
      creditNoteItem,
      invoicePayerFK,
      isStockIn,
      remark,
      finalCredit,
      gstAmount,
      generatedDate,
    } = values
    // const gstAmount = creditNoteItem.reduce(
    //   (totalGstAmount, item) =>
    //     item.isSelected ? totalGstAmount + item.gstAmount : totalGstAmount,
    //   0,
    // )
    // const gstAmt = invoiceDetail.isGSTInclusive ?
    //   (finalCredit - finalCredit / (1 + invoiceDetail.gstValue / 100))
    //   : finalCredit * (invoiceDetail.gstValue / 100)
    const payload = {
      generatedDate,
      invoicePayerFK,
      isStockIn,
      remark,
      gstAmt: gstAmount,
      gstValue: invoiceDetail.gstValue,
      total: finalCredit - gstAmount,
      totalAftGST: finalCredit,
      creditNoteItem: creditNoteItem
        .filter(x => x.isSelected)
        .map(selectedItem => {
          const { id, concurrencyToken, ...restProps } = selectedItem

          const item = {
            ...restProps,
            isInventoryItem:
              restProps.itemType.toLowerCase() !== 'misc' &&
              restProps.itemType.toLowerCase() !== 'service' &&
              !restProps.isDrugMixture,
            subTotal: restProps.isPackage
              ? restProps.packageRemainingAmountAfterGST
              : restProps.totalAfterGST,
            itemDescription: restProps.itemName,
            quantity: restProps.isPackage
              ? restProps.packageRemainingQuantity
              : restProps.quantity,
          }
          return { ...item }
        }),
    }

    dispatch({
      type: 'invoiceCreditNote/upsert',
      payload,
    }).then(r => {
      if (r) {
        if (onConfirm) onConfirm()
        // Refresh invoice & invoicePayer
        onRefresh()
      }
    })
  },
})
class AddCrNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      expandedGroups: [],
      isExistPackage: false,
    }

    this.handleOnChangeQuantity = _.debounce(this.handleOnChangeQuantity, 100)
  }

  componentDidMount = () => {
    const { values } = this.props
    const { creditNoteItem } = values

    const settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { isEnablePackage = false } = settings
    const packageItems = creditNoteItem.filter(item => item.isPackage)
    const existPackage = isEnablePackage && packageItems.length > 0
    this.setState({
      isExistPackage: existPackage,
    })

    this.expandAllPackages(values)
  }

  expandAllPackages = values => {
    const { creditNoteItem } = values

    if (creditNoteItem) {
      const groups = creditNoteItem.reduce(
        (distinct, data) =>
          distinct.includes(data.packageGlobalId)
            ? [...distinct]
            : [...distinct, data.packageGlobalId],
        [],
      )

      this.setState({
        expandedGroups: groups,
      })
    }
  }

  handleExpandedGroupsChange = e => {
    this.setState({
      expandedGroups: e,
    })
  }

  handleEditRow = row => {}

  handleCalcCrNoteItem = (selection = undefined) => {
    const { invoiceDetail, invoiceCreditNote } = this.props
    let rowSelection = []
    const { selectedRows } = this.state
    rowSelection = selection || selectedRows

    const { setFieldValue, values } = this.props
    const { creditNoteItem } = values

    const finalCreditTotal = creditNoteItem.reduce((total, item) => {
      if (rowSelection.includes(item.id)) {
        if (item.isPackage) return total + item.packageRemainingAmountAfterGST
        return total + item.totalAfterGST
      }
      if (item.itemType.toLowerCase() === 'misc')
        return total + item.totalAfterGST
      return total
    }, 0)
    setFieldValue('finalCredit', roundTo(finalCreditTotal))

    const gstAmount =
      invoiceDetail.gstValue >= 0
        ? (finalCreditTotal / (1 + invoiceDetail.gstValue / 100)) *
          (invoiceDetail.gstValue / 100)
        : 0
    setFieldValue('gstAmount', roundTo(gstAmount))
    setFieldValue('subTotal', roundTo(finalCreditTotal) - roundTo(gstAmount))
  }

  handleSelectionChange = selection => {
    const { values, setFieldValue } = this.props

    let newSelection = selection
    if (this.state.isExistPackage) {
      // If is select a package item, should auto select all items under the package
      const newSelect = selection.find(
        i => !this.state.selectedRows.includes(i),
      )
      if (newSelect) {
        const item = values.creditNoteItem.find(i => i.id === newSelect)
        if (item && item.isPackage) {
          const otherItems = values.creditNoteItem.filter(
            i =>
              i.packageGlobalId === item.packageGlobalId &&
              i.id !== newSelect &&
              !i.isSelected,
          )
          if (otherItems && otherItems.length > 0) {
            otherItems.forEach(i => {
              i.isSelected = true
              newSelection.push(i.id)
            })
          }
        }
      }

      // If is remove selection from a package item, should auto remove selection all items under the package
      const newUnselect = this.state.selectedRows.find(
        i => !selection.includes(i),
      )
      if (newUnselect) {
        const item = values.creditNoteItem.find(i => i.id === newUnselect)
        if (item && item.isPackage) {
          const otherItems = values.creditNoteItem.filter(
            i =>
              i.packageGlobalId === item.packageGlobalId &&
              i.id !== newUnselect &&
              i.isSelected,
          )
          if (otherItems && otherItems.length > 0) {
            otherItems.forEach(i => {
              i.isSelected = false
              newSelection = newSelection.filter(s => s !== i.id)
            })
          }
        }
      }
    }

    const newCreditNoteItem = values.creditNoteItem.map(item => ({
      ...item,
      isSelected: newSelection.includes(item.id),
    }))
    setFieldValue('creditNoteItem', newCreditNoteItem)
    this.setState({ selectedRows: newSelection })

    this.handleCalcCrNoteItem(newSelection)
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue, values } = this.props
    const { creditNoteItem } = values

    if (deleted) {
      const selectedCrItem = creditNoteItem.find(
        crItem => crItem.id === deleted[0],
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
        const filteredRows = rows.filter(x => x.id !== selectedCrItem.id)
        setFieldValue('creditNoteItem', filteredRows)
        setTimeout(() => this.handleCalcCrNoteItem(), 100)
      }
    }

    return rows
  }

  handleDeleteRow = row => {
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

    creditNoteItem.map(x => {
      if (x.itemType === 'Misc') return x

      if (x.quantity === x.originRemainingQty) {
        x.totalAfterGST = x._totalAfterGST
      } else {
        x.totalAfterGST = roundTo(x.quantity * x._unitPriceAftGst)
      }
      return x
    })

    setTimeout(() => this.handleCalcCrNoteItem(), 100)
  }

  handleAddMiscItem = newItem => {
    const { values, setFieldValue } = this.props
    const { creditNoteItem } = values

    const tempID = creditNoteItem.reduce((smallestNegativeID, item) => {
      if (item.id < 0 && item.id < smallestNegativeID) return item.id
      return smallestNegativeID
    }, 0)
    setFieldValue('creditNoteItem', [
      ...creditNoteItem,
      {
        ...newItem,
        id: tempID,
        packageGlobalId: '',
      },
    ])
    setTimeout(() => this.handleCalcCrNoteItem(), 100)

    // Auto expand group for non packages
    if (!this.state.expandedGroups.includes('')) {
      const groups = this.state.expandedGroups
      groups.push('')

      this.setState({
        expandedGroups: groups,
      })
    }
  }

  handleTotalChange = row => event => {
    const { target } = event
    const { values, setFieldValue } = this.props
    const { gstValue } = values
    let gstAmt = row.gstAmount

    if (target && target.value && event.target.name !== '') {
      const parseValue = Number(target.value)
      gstAmt = roundTo(parseValue - parseValue / (1 + gstValue / 100)) || 0
      const gstFieldName = `${target.name.split('.')[0]}.gstAmount`
      setFieldValue(gstFieldName, gstAmt)
      setTimeout(() => this.handleCalcCrNoteItem(), 100)
    }
  }

  drugMixtureIndicator = (row, right) => {
    if (row.itemType !== 'Medication' || !row.isDrugMixture) return null

    return (
      <DrugMixtureInfo values={row.prescriptionDrugMixture} right={right} />
    )
  }

  render() {
    const { handleSubmit, onConfirm, values, invoiceDetail } = this.props
    const { creditNoteItem, finalCredit, payerType } = values

    const packageGroupCellContent = ({ row }) => {
      if (row.value === undefined || row.value === '') {
        return (
          <span style={{ verticalAlign: 'middle' }}>
            <strong>Non-Package Items</strong>
          </span>
        )
      }

      let label = 'Package'
      if (!creditNoteItem) return ''
      const data = creditNoteItem.filter(
        item => item.packageGlobalId === row.value,
      )
      if (data.length > 0) {
        label = `${data[0].packageCode} - ${data[0].packageName}`
        if (data[0].isPackageExpired) {
          label += ' (Expired)'
        }
      }

      return (
        <span style={{ verticalAlign: 'middle' }}>
          <strong>{label}</strong>
        </span>
      )
    }

    let CrNoteColumns = [
      { name: 'itemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'totalAfterGST', title: 'Payable Amount ($)' },
      { name: 'totalAfterGST1', title: 'Total CN Amount ($)' },
      { name: 'totalAfterGST2', title: 'Current CN Amount ($)' },
      { name: 'action', title: 'Action' },
    ]

    if (this.state.isExistPackage) {
      CrNoteColumns.splice(2, 0, {
        name: 'quantity',
        title: 'Purchased Quantity',
      })
      CrNoteColumns.splice(3, 0, {
        name: 'packageConsumeQuantity',
        title: 'Consumed Quantity',
      })
      CrNoteColumns.splice(4, 0, {
        name: 'packageRemainingQuantity',
        title: 'Balance Quantity',
      })

      CrNoteColumns.push({
        name: 'packageGlobalId',
        title: 'Package',
      })
    } else {
      CrNoteColumns.splice(2, 0, { name: 'quantity', title: 'Quantity' })
    }

    return (
      <div>
        <CrNoteForm payerType={payerType} />
        <CommonTableGrid
          size='sm'
          // {...TableConfig}
          FuncProps={{
            selectable: true,
            selectConfig: {
              showSelectAll: false,
              rowSelectionEnabled: row =>
                row.itemType !== 'Misc' &&
                (!row.isPackage ||
                  (row.isPackage &&
                    !row.isPackageExpired &&
                    row.packageRemainingAmountAfterGST > 0)),
            },
            pager: false,
            grouping: this.state.isExistPackage,
            groupingConfig: {
              state: {
                grouping: [{ columnName: 'packageGlobalId' }],
                expandedGroups: [...this.state.expandedGroups],
                onExpandedGroupsChange: this.handleExpandedGroupsChange,
              },
              row: {
                contentComponent: packageGroupCellContent,
              },
            },
          }}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
          defaultSorting={[{ columnName: 'packageGlobalId', direction: 'asc' }]}
          rows={creditNoteItem.filter(cn => !cn.isPreOrder || cn.isChargeToday)}
          columns={CrNoteColumns}
          columnExtensions={[
            {
              columnName: 'itemType',
              width: 150,
              render: row => {
                let paddingRight = 0
                if (row.isPreOrder) {
                  paddingRight = 24
                }
                if (row.isDrugMixture) {
                  paddingRight = 10
                }
                return (
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        paddingRight: paddingRight,
                      }}
                    >
                      {row.itemType}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-1px',
                          right: '-6px',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-block',
                            position: 'relative',
                          }}
                        >
                          {this.drugMixtureIndicator(row)}
                        </div>
                        {row.isPreOrder && (
                          <Tooltip title='New Pre-Order'>
                            <div
                              className={classes.rightIcon}
                              style={{
                                borderRadius: 4,
                                backgroundColor: '#4255bd',
                                display: 'inline-block',
                              }}
                            >
                              Pre
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                )
              },
            },
            {
              columnName: 'quantity',
              width: 150,
              align: this.state.isExistPackage ? 'right' : 'left',
              render: row => {
                const { quantity, originRemainingQty, isPackage } = row

                if (isPackage) {
                  return (
                    <NumberInput size='sm' text value={quantity} format='0.0' />
                  )
                }

                return (
                  <Field
                    name={`creditNoteItem[${row.rowIndex}].quantity`}
                    render={args => {
                      return (
                        <SizeContainer size='sm'>
                          <NumberInput
                            size='sm'
                            style={{ width: '92%' }}
                            disabled={row.itemType.toLowerCase() === 'misc'}
                            onChange={this.handleOnChangeQuantity}
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
              columnName: 'packageConsumeQuantity',
              width: 150,
              align: 'right',
              render: row => {
                const { quantity, packageRemainingQuantity, isPackage } = row
                const totalConsumedQuantity =
                  isPackage !== true
                    ? undefined
                    : quantity - (packageRemainingQuantity || 0)

                return (
                  <NumberInput
                    size='sm'
                    text
                    value={totalConsumedQuantity}
                    format='0.0'
                  />
                )
              },
            },
            {
              columnName: 'packageRemainingQuantity',
              width: 150,
              align: 'right',
              render: row => {
                const { packageRemainingQuantity } = row

                return (
                  <NumberInput
                    size='sm'
                    text
                    value={packageRemainingQuantity}
                    format='0.0'
                  />
                )
              },
            },

            {
              columnName: 'totalAfterGST1',
              width: 180,
              align: 'right',
            },
            {
              columnName: 'totalAfterGST2',
              width: 180,
              align: 'right',
            },
            {
              columnName: 'totalAfterGST',
              width: 150,
              align: 'right',
              render: row => {
                if (row.isPackage) {
                  return (
                    <NumberInput
                      size='sm'
                      text
                      currency
                      value={row.packageRemainingAmountAfterGST}
                    />
                  )
                }

                return (
                  <Field
                    name={`creditNoteItem[${row.rowIndex}].totalAfterGST`}
                    render={args => (
                      <SizeContainer size='sm'>
                        <NumberInput
                          {...args}
                          currency
                          text={!row.isSelected}
                          onChange={this.handleTotalChange(row)}
                        />
                      </SizeContainer>
                    )}
                  />
                )
              },
            },

            {
              columnName: 'action',
              align: 'center',
              width: 78,
              render: row => {
                return (
                  <div>
                    {row.itemType.toLowerCase() === 'misc' ? (
                      <Popconfirm
                        title='Delete the selected item?'
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

        <Summary
          showGST={invoiceDetail.gstValue >= 0}
          invoiceDetail={invoiceDetail}
        />
        {/* <MiscCrNote
          handleAddMiscItem={this.handleAddMiscItem}
          handleCalcFinalTotal={this.handleCalcCrNoteItem}
          gstValue={values.gstValue}
          // {...this.props}
        /> */}

        <GridContainer>
          <GridItem md={9}>
            <p>Note: Total Amount ($) is GST inclusive.</p>
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
                  x => x.quantity > x.originRemainingQty && x.isSelected,
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
export default withStyles(styles)(AddCrNote)
