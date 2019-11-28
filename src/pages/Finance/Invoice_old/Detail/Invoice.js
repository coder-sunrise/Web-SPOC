import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { formatMessage, FormattedMessage } from 'umi/locale'
import numeral from 'numeral'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import Print from '@material-ui/icons/Print'
import { Button, CommonModal, CommonTableGrid } from '@/components'

const sumReducer = (p, n) => {
  return p + n
}
const summaryCalculator = (type, rows, getValue) => {
  // console.log(type, rows, getValue)
  if (type === 'gst') {
    return numeral(rows.map((o) => o.amount).reduce(sumReducer) * 0.07).value()
  }
  if (type === 'subTotal') {
    return IntegratedSummary.defaultCalculator('sum', rows, getValue)
  }
  if (type === 'total') {
    return numeral(rows.map((o) => o.amount).reduce(sumReducer) * 1.07).value()
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}

const styles = (theme) => ({})
@connect(({ creditDebitNote, loading }) => ({
  creditDebitNote,
  submitting: loading.effects['form/submitRegularForm'],
}))
class Invoice extends PureComponent {
  state = {
    qtyColumns: [
      'qty',
    ],
    // integratedGroupingColumnExtensions: [
    //   { columnName: 'category'},
    // ],
    // groupingStateColumnExtensions: [
    //   { columnName: 'category' },
    // ],
    // groupSummaryItems: [
    //   { columnName: 'amount', type: 'subTotal' },
    // ],
    rows: [
      {
        Id: 1,
        category: 'Service',
        itemCode: 'CHASB04 / CHAS - Crown (BLUE -SUB $127.5)',
        unitPrice: 84.5,
        qty: 1,
        discount: '',
        amount: 84.5,
      },
      {
        Id: 2,
        category: 'Service',
        itemCode: 'SV05 / Dental CT Scan - 12.0 x 8.5',
        unitPrice: 50,
        qty: 1,
        discount: '',
        amount: 50,
      },
      {
        Id: 3,
        category: 'Service',
        itemCode: 'SV21 / Polish - For Ortho',
        unitPrice: 50,
        qty: 1,
        discount: '',
        amount: 50,
      },
      {
        Id: 4,

        category: 'Drug',
        itemCode: 'MED 06 / Chlorhexidine Mouthrinse',
        unitPrice: 2,
        qty: 1,
        discount: '',
        amount: 2,
      },
      {
        Id: 5,
        category: 'Drug',
        itemCode:
          "GLUCO+CHOND+MSM+HYALURONIC ACID / GLUCO+CHOND+MSM+HYALURONIC ACID 90'S",
        unitPrice: 45,
        qty: 540,
        discount: '',
        amount: 24300,
      },
    ], // generateRows({ columnValues: globalSalesValues, length: 8 }),
  }

  tableParas = {
    columns: [
      { name: 'category', title: 'Category' },
      { name: 'itemCode', title: 'Item Code / Description' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'qty', title: 'Qty' },
      { name: 'discount', title: 'Discount' },
      { name: 'amount', title: 'Amount' },
    ],
    columnExtensions: [
      { columnName: 'amount', type: 'number', currency: true, width: 200 },
      { columnName: 'discount', type: 'number', width: 100 },
      { columnName: 'qty', type: 'number', width: 100 },
      { columnName: 'unitPrice', type: 'number', currency: true, width: 100 },

      { columnName: 'category', width: 100 },
    ],
    FuncProps: {
      pager: false,
      grouping: true,
      groupingConfig: {
        showToolbar: false,
        state: {
          grouping: [
            { columnName: 'category' },
          ],
          defaultExpandedGroups: [
            'Drug',
            'Service',
          ],
        },
      },
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            // { columnName: 'region', type: 'count' },
            // { columnName: 'amount', type: 'max' },
            // { columnName: 'amount', type: 'subTotal' },
            { columnName: 'amount', type: 'gst' },
            { columnName: 'amount', type: 'total' },
            // { columnName: 'unitPrice', type: 'subTotal' },
          ],
          groupItems: [
            { columnName: 'amount', type: 'subTotal' },
          ],
        },
        integrated: {
          calculator: summaryCalculator,
        },
        row: {
          messages: {
            subTotal: 'Sub Total',
            gst: 'GST',
            total: 'Total',
          },
        },
      },
    },
  }

  render () {
    const { theme } = this.props
    const { rows } = this.state
    return (
      <Paper>
        <CommonTableGrid
          rows={rows}
          oddEven={false}
          ActionProps={{}}
          {...this.tableParas}
        />
        <div style={{ textAlign: 'center', padding: theme.spacing.unit }}>
          <Button color='rose' style={{ marginRight: theme.spacing.unit }}>
            <Print />Print Invoice
          </Button>
          <Button color='rose'>
            <Print />Print Drug Label
          </Button>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Invoice)
