import React, { PureComponent } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { ReportDataGrid } from '@/components/_medisys'
import { currencySymbol } from '@/utils/config'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { withStyles } from '@material-ui/core'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})
class PurchaseReceivingList extends PureComponent {
  handleExpandedGroupsChange = (expandedGroups) => {
    this.setState((prevState) => {
      return { ...prevState, tableGroupRows: expandedGroups }
    })
  }

  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    let currentPoItemId = 0
    let currentTransactionType = ''
    let firstRow = false
    if (reportDatas && reportDatas.PurchaseReceivingListingDetails) {
      incomeData = reportDatas.PurchaseReceivingListingDetails.map(
        (item, index) => {
          if (
            item.poItemID !== currentPoItemId ||
            item.transactionType !== currentTransactionType
          ) {
            currentPoItemId = item.poItemID
            currentTransactionType = item.transactionType
            firstRow = true
          } else {
            firstRow = false
          }

          return {
            ...item,
            id: `purchaseReceiving-${index}-${item.itemCode}`,
            groupID: `${item.transactionType}-${item.porgid}`,
            countNumber: firstRow ? 1 : 0,
            rowspan: firstRow
              ? reportDatas.PurchaseReceivingListingDetails.filter(
                  (pr) =>
                    pr.poItemID === currentPoItemId &&
                    pr.transactionType === currentTransactionType,
                ).length
              : 0,
          }
        },
      )
    }

    let PurchaseReceivingDetailsCols = [
      { name: 'itemCode', title: 'Code' },
      { name: 'itemName', title: 'Name' },
      {
        name: 'orderQuantity',
        title: (
          <div>
            <div>Qty.</div>Ordered
          </div>
        ),
      },
      {
        name: 'bonusQuantity',
        title: (
          <div>
            <div>Bonus</div>Qty.
          </div>
        ),
      },
      { name: 'uom', title: 'UOM' },
      {
        name: 'receivedDate',
        title: (
          <div>
            <div>Date</div>Received
          </div>
        ),
      },
      {
        name: 'receivedQuantity',
        title: (
          <div>
            <div>Qty.</div>Received
          </div>
        ),
      },
      {
        name: 'receivedBonus',
        title: (
          <div>
            <div>Bonus</div>Received
          </div>
        ),
      },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'totalPrice', title: 'Total Price' },
      { name: 'expiryDate', title: 'Exp. Date' },
      { name: 'batchNo', title: 'Batch No.' },
      { name: 'groupID', title: 'Details' },
    ]

    if (reportDatas.PurchaseReceivingListingInfo[0].isGroupBySupplier) {
      PurchaseReceivingDetailsCols = [
        ...PurchaseReceivingDetailsCols,
        { name: 'supplierName', title: 'Supplier' },
      ]
    }

    const PurchaseReceivingDetailsExtensions = [
      { columnName: 'itemCode', sortingEnabled: false, width: 120 },
      { columnName: 'itemName', sortingEnabled: false },
      {
        columnName: 'orderQuantity',
        type: 'number',
        sortingEnabled: false,
        width: 80,
      },
      {
        columnName: 'bonusQuantity',
        type: 'number',
        sortingEnabled: false,
        width: 80,
      },
      { columnName: 'uom', sortingEnabled: false, width: 120 },
      {
        columnName: 'receivedDate',
        type: 'date',
        sortingEnabled: false,
        width: 95,
      },
      {
        columnName: 'receivedQuantity',
        type: 'number',
        sortingEnabled: false,
        width: 80,
      },
      {
        columnName: 'receivedBonus',
        type: 'number',
        sortingEnabled: false,
        width: 80,
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        sortingEnabled: false,
        precision: 4,
        width: 120,
      },
      {
        columnName: 'totalPrice',
        type: 'number',
        currency: true,
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'expiryDate',
        type: 'date',
        sortingEnabled: false,
        width: 95,
      },

      { columnName: 'batchNo', sortingEnabled: false, width: 120 },
      { columnName: 'supplierName', width: 0 },
      {
        columnName: 'groupID',
        width: 0,
      },
    ]

    let grouping = []
    if (reportDatas.PurchaseReceivingListingInfo[0].isGroupBySupplier) {
      grouping = [
        { columnName: 'supplierName' },
      ]
    }
    grouping = [
      ...grouping,
      {
        columnName: 'groupID',
      },
    ]
    let FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping,
        },
        row: {
          contentComponent: (group) => {
            const { row } = group
            if (row.groupedBy === 'supplierName')
              return (
                <span>
                  <span style={{ fontWeight: 500 }}>Supplier:</span> &nbsp;
                  {row.value}
                </span>
              )
            if (row.groupedBy === 'groupID') {
              const groupRow = incomeData.find(
                (data) => data.groupID === row.value,
              )
              return (
                <span>
                  <span style={{ fontWeight: 500 }}>
                    {groupRow.transactionType === 'PurchaseOrder' ? (
                      'PO. No.:'
                    ) : (
                      'RG. No.:'
                    )}
                  </span>
                  &nbsp;
                  <span>{`${groupRow.poNo || ''}`}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ fontWeight: 500 }}>
                    {groupRow.transactionType === 'PurchaseOrder' ? (
                      'PO. Date.:'
                    ) : (
                      'RG. Date.:'
                    )}
                  </span>
                  &nbsp;
                  {moment(groupRow.poDate).format('DD MMM YYYY')}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {!reportDatas.PurchaseReceivingListingInfo[0]
                    .isGroupBySupplier ? (
                    <span>
                      <span style={{ fontWeight: 500 }}>Supplier:</span>
                      &nbsp;
                      {groupRow.supplierName || ''}
                    </span>
                  ) : (
                    ''
                  )}
                  <br />
                  <span style={{ marginLeft: 40 }}>
                    <span style={{ fontWeight: 500 }}>Invoice No.:</span>
                    &nbsp;
                    {groupRow.inovoiceNo || ''}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: 500 }}>Invoice Amt:</span>
                    &nbsp;
                    {currencySymbol}
                    {numeral(groupRow.invoiceAmount || 0).format('0.00')}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: 500 }}>GST:</span>
                    &nbsp;
                    {currencySymbol}
                    {numeral(groupRow.gstAmt || 0).format('0.00')}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: 500 }}>Invoice Total:</span>
                    &nbsp;
                    {currencySymbol}
                    {numeral(groupRow.totalAftGST || 0).format('0.00')}
                  </span>
                </span>
              )
            }
            return ''
          },
        },
      },
    }

    const listRow = (p) => {
      const { classes } = this.props
      const { row, children } = p
      let newchildren = []
      let middleColumns = []
      if (reportDatas.PurchaseReceivingListingInfo[0].isGroupBySupplier) {
        middleColumns = children.slice(7, 14)
      } else {
        middleColumns = children.slice(6, 13)
      }

      if (row.countNumber === 1) {
        newchildren.push(
          children
            .filter(
              (value, index) =>
                index <
                (reportDatas.PurchaseReceivingListingInfo[0].isGroupBySupplier
                  ? 7
                  : 6),
            )
            .map((item) => ({
              ...item,
              props: {
                ...item.props,
                rowSpan: row.rowspan,
              },
            })),
        )

        newchildren.push(middleColumns)
      } else {
        newchildren.push(middleColumns)
      }

      if (row.countNumber === 1) {
        return <Table.Row {...p}>{newchildren}</Table.Row>
      }
      return (
        <Table.Row {...p} className={classes.subRow}>
          {newchildren}
        </Table.Row>
      )
    }

    return (
      <ReportDataGrid
        data={incomeData}
        columns={PurchaseReceivingDetailsCols}
        columnExtensions={PurchaseReceivingDetailsExtensions}
        FuncProps={FuncProps}
        TableProps={{ rowComponent: listRow }}
      />
    )
  }
}
export default withStyles(styles)(PurchaseReceivingList)
