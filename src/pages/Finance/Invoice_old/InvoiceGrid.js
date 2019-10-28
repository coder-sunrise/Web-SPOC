import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
import router from 'umi/router'
// import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
// import { TooltipComponent } from '@syncfusion/ej2-react-popups'
// import {TextBox as TextBoxComponent , TextArea,RadioButtonGroup} from '@/components'
// import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons'
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Button from "mui-pro-components/CustomButtons"
import Paper from "@material-ui/core/Paper"
import {AccountCircle,Search,Replay,Person,Apps} from '@material-ui/icons'

import {
  Column,
  FilteringState, GroupingState,
  IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSelection, IntegratedSorting,
  PagingState, SelectionState, SortingState, DataTypeProvider, DataTypeProviderProps,
} from '@devexpress/dx-react-grid'
import {
  DragDropProvider,VirtualTable,
  Grid as DevGrid, GroupingPanel, PagingPanel,
  Table, TableFilterRow, TableGroupRow,
  TableHeaderRow, TableSelection, Toolbar,TableFixedColumns, 
} from '@devexpress/dx-react-grid-material-ui'

const NumberFormatter = ({ value }) => (
  <b style={{ color: 'darkblue' }}>
$
    {value}
  </b>
)
const DateFormatter = ({ value }) => {
  return moment.isMoment(value)?value.format('LLL'):value
}
const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    {...props}
  />
)

const NumberTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={NumberFormatter}
    {...props}
  />
)
const styles = theme => ({
  root: {
    // padding: theme.spacing.unit * 2,
    // margin: 'auto',
    // maxWidth: 800,
  },
  actionBar:{
    marginTop: theme.spacing.unit*3,
  },
  radiogroup:{
    marginTop: theme.spacing.unit*1,

  },
  buttonContainer:{
    padding:'0 10px',
  },
})
@connect(({ invoice,loading }) => ({
  invoice,
  submitting: loading.effects['form/submitRegularForm'],
}))
class InvoiceGrid extends PureComponent {
  // handleSubmit = e => {
  //   const { dispatch, form } = this.props
  //   e.preventDefault()
  //   form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       dispatch({
  //         type: 'form/submitRegularForm',
  //         payload: values,
  //       })
  //     }
  //   })
  // };
  state = {
    columns: [
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'refNo', title: 'Ref. No.' },
      { name: 'acctNo', title: 'Acc. No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'totalAfterGST', title: 'Total After GST' },
      { name: 'payments', title: 'Payments' },
      { name: 'creditNotes', title: 'Credit Notes' },
      { name: 'debitNotes', title: 'Debit Notes' },
      { name: 'osBal', title: 'O/S Bal.' },
      { name: 'Action', title: '' },

      
    ],
    dateColumns: ['invoiceDate'],
    currencyColumns: ['totalAfterGST','payments','creditNotes','debitNotes','osBal'],
    // currencyColumns: ['amount'],
    pageSizes: [5, 10, 15],
    selection:[],
  };

  changeSelection = (selection)=>{
    this.setState({ selection })
  }

  render () {
    const { submitting, invoice:{list},dispatch } = this.props

    const {
      rows, columns, pageSizes,
      currencyColumns,dateColumns,selection,
    } = this.state

    const Cell = (p) => {
      const { column ,row} = p
      // console.log(p)
      if (column.name === 'Action') {
        return <Table.Cell {...p}>
          <Button size="sm"
            onClick={()=>{
              const href=`/finance/invoice/${row.invoiceNo}`
              dispatch({
                type:'menu/updateBreadcrumb',
                payload:{
                  href,
                  name:row.invoiceNo,
                },
              })
              router.push(href)
          }}
            justIcon
            round
            color="primary"
            title="View Details"
            style={{marginRight:5}}
          >
            <Apps />
          </Button>
          <Button size="sm"
            onClick={()=>{
            
          }}
            justIcon
            round
            color="primary"
            title="Update Visit Docotr"
          >
            <Person />
          </Button>
        </Table.Cell>
      }
      return <Table.Cell {...p} />
    }
    

    return (
      <Paper style={{marginTop:5}}>
        <DevGrid
          rows={list}
          columns={columns}
        >
          <FilteringState  onFiltersChange={(f)=>{
        }} 
            columnExtensions={[
          { columnName: 'Action', filteringEnabled: false },
        ]}
          />
          <SortingState
            defaultSorting={[
        { columnName: 'invoiceDate', direction: 'desc' },
      ]}
          /> 

          <SelectionState />
          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />

          <GroupingState />
          <PagingState />

          <IntegratedGrouping />
          {/* <IntegratedFiltering /> */}
          <IntegratedSorting />
          <IntegratedPaging />
          <IntegratedSelection />

          <NumberTypeProvider
            for={currencyColumns}
          />
          <DateTypeProvider
            for={dateColumns}
          />

          <DragDropProvider />
          {/* <VirtualTable
          height={600}
        /> */}
          <Table 
            cellComponent={Cell}
            columnExtensions={[{columnName:'Action',width:95}]}
          />
          <TableSelection
          // selectByRowClick
            highlightRow
            showSelectionColumn={false}
          />

          <TableHeaderRow showSortingControls />
          {/* <TableFilterRow /> */}
          <PagingPanel pageSizes={pageSizes} />

          <TableGroupRow />
          <Toolbar />
          <GroupingPanel showSortingControls />
          <TableFixedColumns
            rightColumns={['Action']}
          />
        </DevGrid>
      </Paper>
    )
  }
}

export default  withStyles(styles)(InvoiceGrid)
