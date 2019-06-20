import React, { PureComponent } from 'react'
import classnames from 'classnames'
import numeral from 'numeral'
// dva
import { connect } from 'dva'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// dev grid
import {
  GroupingState,
  IntegratedGrouping,
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import {
  Grid as DevGrid,
  VirtualTable,
  TableHeaderRow,
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui'
// custom components
import {
  CommonTableGrid2,
  GridContainer,
  GridItem,
  NumberInput,
  NumberTypeProvider2,
} from '@/components'

const STYLES = () => ({
  paperSpacing: {
    margin: '10px 5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
})

const sumReducer = (p, n) => {
  return p + n
}

const summaryCalculator = (type, rows, getValue) => {
  if (type === 'gst') {
    return numeral(
      rows.map((o) => o.amount).reduce(sumReducer, 0) * 0.07,
    ).value()
  }
  if (type === 'subTotal') {
    return IntegratedSummary.defaultCalculator('sum', rows, getValue)
  }
  if (type === 'total') {
    return numeral(
      rows.map((o) => o.amount).reduce(sumReducer, 0) * 1.07,
    ).value()
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}

const rows = [
  {
    Id: 1,
    Category: 'Service',
    ItemCode: 'CHASB04 / CHAS - Crown (BLUE -SUB $127.5)',
    UnitPrice: 84.5,
    Quantity: 1,
    Discount: '',
    Amount: 84.5,
  },
  {
    Id: 2,
    Category: 'Service',
    ItemCode: 'SV05 / Dental CT Scan - 12.0 x 8.5',
    UnitPrice: 50,
    Quantity: 1,
    Discount: '',
    Amount: 50,
  },
  {
    Id: 3,
    Category: 'Service',
    ItemCode: 'SV21 / Polish - For Ortho',
    UnitPrice: 50,
    Quantity: 1,
    Discount: '',
    Amount: 50,
  },
  {
    Id: 4,

    Category: 'Drug',
    ItemCode: 'MED 06 / Chlorhexidine Mouthrinse',
    UnitPrice: 2,
    Quantity: 1,
    Discount: '',
    Amount: 2,
  },
  {
    Id: 5,
    Category: 'Drug',
    ItemCode:
      "GLUCO+CHOND+MSM+HYALURONIC ACID / GLUCO+CHOND+MSM+HYALURONIC ACID 90'S",
    UnitPrice: 45,
    Quantity: 540,
    Discount: '',
    Amount: 24300,
  },
]

@connect(({ dispense }) => ({ dispense }))
@withFormik({
  mapPropsToValues: () => ({
    subTotal: 60,
    total: 60,
    gst: 7,
  }),
})
class DispenseGrid extends PureComponent {
  state = {
    tableParams: {
      columns: [
        { name: 'category', title: 'Category' },
        { name: 'itemCode', title: 'Item Code / Description' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'quantity', title: 'Qty' },
        { name: 'discount', title: 'Discount' },
        { name: 'amount', title: 'Amount' },
      ],
      columnExtensions: [
        { columnName: 'discount', width: 100, type: 'number', currency: true },
        { columnName: 'quantity', width: 100, type: 'number' },
        { columnName: 'unitPrice', width: 100, type: 'number', currency: true },
        {
          columnName: 'amount',
          align: 'right',
          width: 200,
          type: 'number',
          currency: true,
        },
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
              { columnName: 'amount', type: 'gst' },
              { columnName: 'amount', type: 'total' },
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
    },
    expandedGroups: [],
  }

  handleExpandedGroupChange = (newExpandedGroups) => {
    this.setState({
      expandedGroups: newExpandedGroups,
    })
  }

  render () {
    const {
      columns,
      grouping,
      tableColumnExtensions,
      expandedGroups,
      tableParams,
    } = this.state
    const { dispense, classes } = this.props
    const { invoiceItems } = dispense
    // return (
    //   <React.Fragment>
    //     <Paper className={classnames(classes.paperSpacing)}>
    //       <DevGrid rows={invoiceItems} columns={columns}>
    //         <GroupingState
    //           grouping={grouping}
    //           onExpandedGroupsChange={this.handleExpandedGroupChange}
    //           expandedGroups={expandedGroups}
    //         />
    //         <NumberTypeProvider2 columnExtensions={tableColumnExtensions} />
    //         <IntegratedGrouping />
    //         <VirtualTable
    //           height={300}
    //           columnExtensions={tableColumnExtensions}
    //         />
    //         <TableHeaderRow />
    //         <TableGroupRow />

    //         {/* <GroupingPanel showGroupingControls /> */}
    //       </DevGrid>
    //     </Paper>
    //     <GridContainer
    //       direction='column'
    //       justify='center'
    //       alignItems='flex-end'
    //       md={12}
    //     >
    //       <GridItem xs md={12}>
    //         <FastField
    //           name='subTotal'
    //           render={(args) => (
    //             <NumberInput {...args} currency label='SubTotal' disabled />
    //           )}
    //         />
    //       </GridItem>
    //       <GridItem xs md={12}>
    //         <FastField
    //           name='gst'
    //           render={(args) => (
    //             <NumberInput {...args} percentage label='GST' disabled />
    //           )}
    //         />
    //       </GridItem>
    //       <GridItem xs md={12}>
    //         <FastField
    //           name='total'
    //           render={(args) => (
    //             <NumberInput {...args} currency label='Total' disabled />
    //           )}
    //         />
    //       </GridItem>
    //     </GridContainer>
    //   </React.Fragment>
    // )
    return (
      <CommonTableGrid2
        rows={invoiceItems}
        oddEven={false}
        ActionProps={{}}
        {...tableParams}
      />
    )
  }
}

export default withStyles(STYLES)(DispenseGrid)
