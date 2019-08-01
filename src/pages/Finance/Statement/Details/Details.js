import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Refresh, Print, Payment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import {
  Button,
  GridContainer,
  GridItem,
  EditableTableGrid,
  CommonTableGrid,
  CommonModal,
} from '@/components'
import CollectPayment from './CollectPayment'
import CollectPaymentConfirm from './CollectPaymentConfirm'

const styles = () => ({
  gridContainer: {
    marginBottom: '10px',
  },
  buttonContainer: {
    paddingLeft: '0 !important',
  },
  collectPaymentBtn: {
    paddingRight: '0 !important',
  },
})

@connect(({ statementDetails }) => ({
  statementDetails,
}))
class Details extends PureComponent {
  state = {
    lastRefresh: moment().add(-1, 'months').format('DD MMM YYYY HH:mm'),
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'amount', title: 'Payable Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
    ],
    columnExtensions: [
      { columName: 'amount', type: 'number', currency: true },
      { columName: 'outstandingBalance', type: 'number', currency: true },
      { columName: 'invoiceDate', type: 'date' },
    ],
    editingRowIds: [],
    rowChanges: {},
    rows: [
      {
        id: 'PT-000001A',
        invoiceNo: 'IV-000001',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000002A',
        invoiceNo: 'IV-000002',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000003A',
        invoiceNo: 'IV-000003',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000004A',
        invoiceNo: 'IV-000004',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000005A',
        invoiceNo: 'IV-000005A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000006A',
        invoiceNo: 'IV-000006A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000007A',
        invoiceNo: 'IV-000007A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000008A',
        invoiceNo: 'IV-000008A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000009A',
        invoiceNo: 'IV-000009A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000010A',
        invoiceNo: 'PT-000010A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000011A',
        invoiceNo: 'IV-000011A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000012A',
        invoiceNo: 'IV-000012A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000013A',
        invoiceNo: 'IV-000013A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000014A',
        invoiceNo: 'IV-000014A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        amount: 100,
        outstandingBalance: 100,
      },
    ],

    showCollectPayment: false,
  }

  handleRefresh = () => {
    this.setState({
      lastRefresh: moment().format('DD MMM YYYY HH:mm'),
    })
  }

  toggleCollectPayment = () => {
    const { showCollectPayment } = this.state
    this.setState({
      showCollectPayment: !showCollectPayment,
    })
  }

  gridGetRowID = (row) => row.invoiceNo

  render () {
    const {
      rows,
      columns,
      columnExtensions,
      lastRefresh,
      showCollectPayment,
    } = this.state

    const FuncProps = { pager: false }
    const { classes } = this.props
    return (
      <div>
        <GridContainer classes={{ grid: classes.gridContainer }}>
          <GridItem
            classes={{ grid: classes.buttonContainer }}
            container
            xs={12}
            sm={12}
            md={12}
            lg={9}
          >
            <GridItem>
              <Button color='rose' onClick={this.handleRefresh}>
                <Refresh />
                <FormattedMessage id='finance.statement.details.refreshStatement' />
              </Button>
              <Button color='rose'>
                <Print />
                <FormattedMessage id='finance.statement.details.printStatement' />
              </Button>
            </GridItem>
          </GridItem>
          <GridContainer item lg={3} justify='flex-end'>
            <GridItem classes={{ grid: classes.collectPaymentBtn }}>
              <Button color='primary' onClick={this.toggleCollectPayment}>
                <Payment />
                <FormattedMessage id='finance.collectPayment' />
              </Button>
            </GridItem>
          </GridContainer>
        </GridContainer>
        {/*
          <EditableTableGrid
            rows={rows}
            columns={columns}
            height={300}
            currencyColumns={currencyColumns}
            dateColumns={dateColumns}
            FuncProps={FuncProps}
          />
        */}
        <CommonTableGrid
          // height={300}
          rows={rows}
          columns={columns}
          columnExtensions={columnExtensions}
          // FuncProps={FuncProps}
          getRowId={this.gridGetRowID}
        />
        <h5>{`Last Refreshed On ${lastRefresh}`}</h5>
        <CommonModal
          open={showCollectPayment}
          title={formatMessage({
            id: 'finance.corporate-billing.collectPaymentTitle',
          })}
          onClose={this.toggleCollectPayment}
          onConfirm={this.toggleCollectPayment}
          maxWidth='lg'
          showFooter={false}
        >
          {/*
            <CollectPayment />
          */}
          <CollectPaymentConfirm />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles)(Details)
