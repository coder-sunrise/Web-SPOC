import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'

import { withStyles } from '@material-ui/core'
import {
  Button,
  GridContainer,
  GridItem,
  CommonTableGrid,
  CommonModal,
  dateFormatLong,
  dateFormatLongWithTime,
  ProgressButton,
  serverDateFormat,
} from '@/components'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import ExtractAsSingle from './ExtractAsSingle'
import PrintStatementReport from '../PrintStatementReport'
import { getBizSession } from '@/services/queue'

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
    ],

    showCollectPayment: false,
  }

  componentDidMount () {
    this.fetchLatestBizSessions()
  }

  fetchLatestBizSessions = () => {
    const { setFieldValue } = this.props
    const payload = {
      pagesize: 1,
      sorting: [
        { columnName: 'sessionStartDate', direction: 'desc' },
      ],
    }
    getBizSession(payload).then((response) => {
      const { status, data } = response
      if (status === '200' && data.totalRecords > 0) {
        const { data: sessionData } = data
        let paymentDate = moment(
          sessionData[0].sessionStartDate,
          serverDateFormat,
        )
        setFieldValue('paymentDate', paymentDate.format(serverDateFormat))
        setFieldValue('paymentCreatedBizSessionFK', sessionData[0].id)

        this.getBizList(paymentDate.format(serverDateFormat))
      } else {
        setFieldValue('paymentDate', null)
        setFieldValue('paymentCreatedBizSessionFK', undefined)
      }
    })
  }

  getBizList = (date) => {
    const { dispatch, setFieldValue } = this.props
    const momentDate = moment(date, serverDateFormat)

    const startDateTime = moment(
      momentDate.set({ hour: 0, minute: 0, second: 0 }),
    ).formatUTC(false)
    const endDateTime = moment(
      momentDate.set({ hour: 23, minute: 59, second: 59 }),
    ).formatUTC(false)

    dispatch({
      type: 'statement/bizSessionList',
      payload: {
        pagesize: 999,
        lgteql_SessionStartDate: startDateTime,
        isClinicSessionClosed: true,
        lsteql_SessionCloseDate: endDateTime,
        sorting: [
          { columnName: 'sessionStartDate', direction: 'desc' },
        ],
      },
    }).then(() => {
      const { bizSessionList } = this.props.statement
      if (bizSessionList) {
        setFieldValue(
          'paymentCreatedBizSessionFK',
          bizSessionList.length === 0 || bizSessionList === undefined
            ? undefined
            : bizSessionList[0].value, // bizSessionList.slice(-1)[0].value,
        )
      }
    })
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

      this.fetchLatestBizSessions()
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
    let selectedInvoiceNos = []
    this.state.selectedRows.forEach((o) => {
      const invoice = statement.entity.statementInvoice.find(
        (r) => r.invoiceNo === o,
      )
      if (!invoice) {
        return
      }
      rows.push(invoice)
      selectedInvoiceNos.push(invoice.invoiceNo)
    })
    this.setState({
      extractRows: rows,
      selectedRows: selectedInvoiceNos,
    })
    this.setState((prevState) => {
      return { showModal: !prevState.showModal }
    })
  }

  render () {
    const {
      columns,
      showCollectPayment,
      showModal,
      extractRows,
      selectedRows,
    } = this.state
    const { classes, statement, values, theme, history } = this.props
    return (
      <div>
        <GridContainer classes={{ grid: classes.gridContainer }}>
          <GridContainer direction='row' justify='flex-end'>
            <GridItem style={{ marginRight: -16 }}>
              <ProgressButton
                color='primary'
                onClick={this.handleRefresh}
                icon={null}
              >
                <Refresh />
                <FormattedMessage id='finance.statement.details.refreshStatement' />
              </ProgressButton>
              <PrintStatementReport id={values.id}>
                <Button color='primary'>
                  <Print />
                  <FormattedMessage id='finance.statement.details.printStatement' />
                </Button>
              </PrintStatementReport>
            </GridItem>
          </GridContainer>
        </GridContainer>

        <CommonTableGrid
          rows={statement.entity ? statement.entity.statementInvoice : []}
          columns={columns}
          columnExtensions={[
            {
              columnName: 'invoiceNo',
              sortingEnabled: false,
            },
            {
              columnName: 'patientName',
              sortingEnabled: false,
            },
            {
              columnName: 'remark',
              sortingEnabled: false,
            },
            {
              columnName: 'adminCharge',
              type: 'number',
              currency: true,
              sortingEnabled: false,
            },
            {
              columnName: 'payableAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
            },
            {
              columnName: 'outstandingAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
            },
            {
              columnName: 'invoiceDate',
              type: 'date',
              format: dateFormatLong,
              sortingEnabled: false,
            },
          ]}
          FuncProps={{
            selectable: true,
            selectConfig: {
              showSelectAll: true,
              rowSelectionEnabled: (row) => {
                return (
                  !row.statementInvoicePayment.find(
                    (o) => o.invoicePayment.isCancelled === false,
                  ) && row.payableAmount === row.outstandingAmount
                )
              },
            },
          }}
          getRowId={this.gridGetRowID}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
        />

        <p style={{ margin: theme.spacing(1) }}>
          {`Last Refreshed On ${values.lastRefreshTime
            ? moment(values.lastRefreshTime).format(dateFormatLongWithTime)
            : '-'}`}
        </p>

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
          title='Statement'
          open={showModal}
          maxWidth='md'
          bodyNoPadding
          onClose={this.handleClick}
          onConfirm={this.handleClick}
          observe='statementExtract'
        >
          <ExtractAsSingle selectedRows={extractRows} />
        </CommonModal>
        <Button
          style={{ marginTop: 10 }}
          color='primary'
          onClick={this.handleClick}
          disabled={selectedRows.length <= 0}
        >
          Extract As Single
        </Button>
        <Button
          style={{ marginTop: 10 }}
          color='primary'
          onClick={() => {
            history.push(`/finance/statement/editstatement`)
          }}
        >
          Edit Statement
        </Button>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Details)
