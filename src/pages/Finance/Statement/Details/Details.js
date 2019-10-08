import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Refresh, Print, Payment, Delete } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import {
  Button,
  GridContainer,
  GridItem,
  CommonTableGrid,
  CommonModal,
  dateFormatLong,
  dateFormatWithTime,
  ProgressButton,
} from '@/components'
import CollectPaymentConfirm from './CollectPaymentConfirm'
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

@connect(({ statement }) => ({
  statement,
}))
class Details extends PureComponent {
  state = {
    showModal: false,
    selectedRows: [],
    extractRows: [],
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'adminCharge', title: 'Admin Charge' },
      { name: 'payableAmount', title: 'Payable Amount' },
      { name: 'outstandingAmount', title: 'Outstanding' },
      { name: 'remark', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],

    // editingRowIds: [],
    // rowChanges: {},
    // rows: [
    //   {
    //     id: 'PT-000001A',
    //     invoiceNo: 'IV-000001',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000002A',
    //     invoiceNo: 'IV-000002',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000003A',
    //     invoiceNo: 'IV-000003',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000004A',
    //     invoiceNo: 'IV-000004',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000005A',
    //     invoiceNo: 'IV-000005A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000006A',
    //     invoiceNo: 'IV-000006A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000007A',
    //     invoiceNo: 'IV-000007A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000008A',
    //     invoiceNo: 'IV-000008A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000009A',
    //     invoiceNo: 'IV-000009A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000010A',
    //     invoiceNo: 'PT-000010A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000011A',
    //     invoiceNo: 'IV-000011A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000012A',
    //     invoiceNo: 'IV-000012A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000013A',
    //     invoiceNo: 'IV-000013A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    //   {
    //     id: 'PT-000014A',
    //     invoiceNo: 'IV-000014A',
    //     invoiceDate: moment()
    //       .add(Math.ceil(Math.random() * 100) - 100, 'days')
    //       .format('LLL'),
    //     patientName: 'Patient 01',
    //     adminCharge: 10,
    //     payableAmount: 100,
    //     outstandingBalance: 100,
    //   },
    // ],
    FuncProps: { selectable: true },

    showCollectPayment: false,
  }

  handleRefresh = () => {
    const { dispatch, values, resetForm } = this.props
    dispatch({
      type: 'statement/refreshStatement',
      payload: {
        id: values.id,
      },
    }).then(() => {
      resetForm()
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
    const { statement } = this.props
    let rows = []
    this.state.selectedRows.forEach((o) => {
      rows.push(
        statement.entity.statementInvoice.find((r) => r.invoiceNo === o),
      )
    })
    this.setState({ extractRows: rows })
    this.setState((prevState) => {
      return { showModal: !prevState.showModal }
    })
  }

  render () {
    const {
      columns,
      columnExtensions,
      showCollectPayment,
      FuncProps,
      showModal,
    } = this.state
    const { classes, statement, values, type } = this.props
    return (
      <div>
        <GridContainer classes={{ grid: classes.gridContainer }}>
          <GridContainer direction='row' justify='flex-end'>
            <GridItem style={{ marginRight: -16 }}>
              <ProgressButton color='primary' onClick={this.handleRefresh}>
                <Refresh />
                <FormattedMessage id='finance.statement.details.refreshStatement' />
              </ProgressButton>
              <Button color='primary'>
                <Print />
                <FormattedMessage id='finance.statement.details.printStatement' />
              </Button>
            </GridItem>
          </GridContainer>
        </GridContainer>

        <CommonTableGrid
          rows={statement.entity ? statement.entity.statementInvoice : []}
          columns={columns}
          columnExtensions={[
            {
              columnName: 'adminCharge',
              type: 'number',
              currency: type === 'ExactAmount',
            },
            {
              columnName: 'payableAmount',
              type: 'number',
              currency: true,
            },
            {
              columnName: 'outstandingAmount',
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
          ]}
          FuncProps={FuncProps}
          getRowId={this.gridGetRowID}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
        />

        <h5>
          {`Last Refreshed On ${moment(values.lastRefreshTime).format(
            dateFormatWithTime,
          ) || '-'}`}
        </h5>

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
          <CollectPaymentConfirm />
        </CommonModal>
        <CommonModal
          title='Extract As Single'
          open={showModal}
          maxWidth='md'
          bodyNoPadding
          onClose={this.handleClick}
          onConfirm={this.handleClick}
          observe='statementExtract'
        >
          <ExtractAsSingle selectedRows={this.state.extractRows} />
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
