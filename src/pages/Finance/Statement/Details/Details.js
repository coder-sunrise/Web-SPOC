import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { FastField } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Refresh, Print, Payment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

import {
  Button,
  GridContainer,
  GridItem,
  EditableTableGrid,
  CommonTableGrid,
  CommonModal,
  NavPills,
  dateFormatLong,
  timeFormatWithoutSecond,
} from '@/components'
import CollectPayment from './CollectPayment'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import ExtractAsSingle from './ExtractAsSingle'

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
    showModal: false,
    selectedRows: [],
    lastRefresh: moment()
      .add(-1, 'months')
      .format(`${dateFormatLong} ${timeFormatWithoutSecond}`),
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'adminCharge', title: 'Admin Charge' },
      { name: 'payableAmount', title: 'Payable Amount' },
      { name: 'outstandingBalance', title: 'Outstanding' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],

    columnExtensions: [
      {
        columnName: 'adminCharge',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'payableAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'outstandingBalance',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'invoiceDate',
        type: 'date',
        format: { dateFormatLong },
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Button
              size='sm'
              // onClick={() => {
              //   editRow(row)
              // }}
              justIcon
              color='primary'
            >
              <Delete />
            </Button>
          )
        },
      },
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
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000002A',
        invoiceNo: 'IV-000002',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000003A',
        invoiceNo: 'IV-000003',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000004A',
        invoiceNo: 'IV-000004',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000005A',
        invoiceNo: 'IV-000005A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000006A',
        invoiceNo: 'IV-000006A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000007A',
        invoiceNo: 'IV-000007A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000008A',
        invoiceNo: 'IV-000008A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000009A',
        invoiceNo: 'IV-000009A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000010A',
        invoiceNo: 'PT-000010A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000011A',
        invoiceNo: 'IV-000011A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000012A',
        invoiceNo: 'IV-000012A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000013A',
        invoiceNo: 'IV-000013A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
      {
        id: 'PT-000014A',
        invoiceNo: 'IV-000014A',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 10,
        payableAmount: 100,
        outstandingBalance: 100,
      },
    ],
    FuncProps: { selectable: true },

    showCollectPayment: false,
  }

  handleRefresh = () => {
    this.setState({
      lastRefresh: moment().format(
        `${dateFormatLong} ${timeFormatWithoutSecond}`,
      ),
    })
  }

  toggleCollectPayment = () => {
    const { showCollectPayment } = this.state
    this.setState({
      showCollectPayment: !showCollectPayment,
    })
  }

  gridGetRowID = (row) => row.invoiceNo

  handleSelectionChange = (selection) => {
    this.setState({ selectedRows: selection })
  }

  handleClick = () => {
    this.setState((prevState) => {
      return { showModal: !prevState.showModal }
    })
  }

  render () {
    console.log('state', this.state)
    const {
      rows,
      columns,
      columnExtensions,
      lastRefresh,
      showCollectPayment,
      FuncProps,
      showModal,
    } = this.state

    // const FuncProps = { pager: false }
    const { classes, history } = this.props
    console.log('asd', this.props)
    return (
      <div>
        <GridContainer classes={{ grid: classes.gridContainer }}>
          <GridContainer direction='row' justify='flex-end'>
            <GridItem style={{ marginRight: -16 }}>
              <Button color='primary' onClick={this.handleRefresh}>
                <Refresh />
                <FormattedMessage id='finance.statement.details.refreshStatement' />
              </Button>
              <Button color='primary'>
                <Print />
                <FormattedMessage id='finance.statement.details.printStatement' />
              </Button>
            </GridItem>
          </GridContainer>
        </GridContainer>

        {/* <NavPills
          color='info'
          onChange={(event, active) => {
            history.push(
              getAppendUrl({
                t: active,
              }),
            )
          }}
          // index={currentTab}
          contentStyle={{}}
          tabs={[
            {
              tabButton: 'Statement Details',
              tabContent: <p />, //<DetailPanel {...detailProps} />,
            },
            {
              tabButton: 'Payment Details',
              tabContent: <p />, //<Setting {...detailProps} />,
            },
          ]}
        /> */}
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
          FuncProps={FuncProps}
          getRowId={this.gridGetRowID}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
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
        <CommonModal
          open={showModal}
          maxWidth='md'
          bodyNoPadding
          onClose={this.handleClick}
          onConfirm={this.handleClick}
        >
          <ExtractAsSingle selectedRows={this.state.selectedRows} />
        </CommonModal>
        <Button
          style={{ marginTop: 10 }}
          color='primary'
          onClick={this.handleClick}
        >
          Extract As Single
        </Button>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Details)
