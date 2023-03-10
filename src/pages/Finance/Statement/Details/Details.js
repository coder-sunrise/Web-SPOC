import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { formatMessage, FormattedMessage } from 'umi'
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
  dateFormatLongWithTimeNoSec12h,
  ProgressButton,
  Tooltip,
} from '@/components'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import ExtractAsSingle from './ExtractAsSingle'
import PrintStatementReport from '../PrintStatementReport'

const styles = theme => ({
  gridContainer: {
    marginBottom: '10px',
  },
  buttonContainer: {
    paddingLeft: '0 !important',
  },
  collectPaymentBtn: {
    paddingRight: '0 !important',
  },
  refreshStatementButton: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
      2,
    )}px 0`,
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
      { name: 'payableAmount', title: 'Payable Amt.' },
      { name: 'statementAdjustment', title: 'Statement Adjustment' },
      { name: 'adminCharge', title: 'Corporate Charge' },
      { name: 'totalPayableAmount', title: 'Total Payable Amt.' },
      { name: 'creditNoteAmount', title: 'Credit Note' },
      { name: 'totalPayment', title: 'Paid' },
      { name: 'outstandingAmount', title: 'Outstanding' },
      { name: 'remark', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],

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

      this.props.fetchLatestBizSessions()
    })
  }

  toggleCollectPayment = () => {
    const { showCollectPayment } = this.state
    this.setState({
      showCollectPayment: !showCollectPayment,
    })
  }

  gridGetRowID = row => row.invoicePayerFK

  handleSelectionChange = selection => {
    this.setState({ selectedRows: selection })
  }

  handleClick = () => {
    const { statement } = this.props
    let rows = []
    let selectedInvoiceNos = []
    this.state.selectedRows.forEach(o => {
      const invoice = statement.entity.statementInvoice.find(
        r => r.invoicePayerFK === o,
      )
      if (!invoice) {
        return
      }
      rows.push(invoice)
      selectedInvoiceNos.push(invoice.invoicePayerFK)
    })
    this.setState({
      extractRows: rows,
      selectedRows: selectedInvoiceNos,
    })
    this.setState(prevState => {
      return { showModal: !prevState.showModal }
    })
  }

  printInvoice = row => {
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: 15,
        reportParameters: {
          InvoiceId: row.invoiceFK,
          CopayerId: undefined,
          InvoicePayerid: undefined,
          isSaved: true,
          printType: 'Detailed Invoice',
        },
      },
    })
  }

  render() {
    const {
      columns,
      showCollectPayment,
      showModal,
      extractRows,
      selectedRows,
    } = this.state
    const { classes, values, theme, history } = this.props
    const { statementInvoice = [] } = values
    return (
      <div>
        <GridContainer classes={{ grid: classes.gridContainer }}>
          <GridContainer direction='row' justify='flex-end'>
            <GridItem style={{ marginRight: -16 }}>
              <ProgressButton
                color='primary'
                style={styles.refreshStatementButton}
                onClick={this.handleRefresh}
                icon={<Refresh />}
              >
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
          forceRender
          rows={statementInvoice}
          columns={columns}
          columnExtensions={[
            {
              columnName: 'invoiceNo',
              sortingEnabled: false,
              width: 85,
            },
            {
              columnName: 'patientName',
              sortingEnabled: false,
              width: 250,
            },
            {
              columnName: 'remark',
              sortingEnabled: false,
            },
            {
              columnName: 'payableAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 110,
            },
            {
              columnName: 'adminCharge',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 130,
            },
            {
              columnName: 'statementAdjustment',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 170,
            },
            {
              columnName: 'totalPayableAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 140,
            },
            {
              columnName: 'creditNoteAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 110,
            },
            {
              columnName: 'totalPayment',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 110,
            },
            {
              columnName: 'outstandingAmount',
              type: 'number',
              currency: true,
              sortingEnabled: false,
              width: 110,
            },
            {
              columnName: 'invoiceDate',
              type: 'date',
              format: dateFormatLong,
              sortingEnabled: false,
              width: 100,
            },
            {
              columnName: 'action',
              align: 'center',
              width: 80,
              render: r => {
                return (
                  <Tooltip title='Print'>
                    <Button
                      color='primary'
                      justIcon
                      onClick={() => {
                        this.printInvoice(r)
                      }}
                    >
                      <Print />
                    </Button>
                  </Tooltip>
                )
              },
            },
          ]}
          TableProps={{
            height: 'calc(100vh - 370px)',
          }}
          FuncProps={{
            pager: false,
            selectable: true,
            selectConfig: {
              showSelectAll: true,
              rowSelectionEnabled: row => {
                return !row.statementInvoicePayment.find(
                  o => o.invoicePayment.isCancelled === false,
                )
              },
            },
          }}
          getRowId={this.gridGetRowID}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
        />

        <p style={{ margin: theme.spacing(1) }}>
          {`Last Refreshed On ${
            values.lastRefreshTime
              ? moment(values.lastRefreshTime).format(
                  dateFormatLongWithTimeNoSec12h,
                )
              : '-'
          }`}
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
          title='Transfer Invoice'
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
          Transfer Invoice
        </Button>
        <Button
          style={{ marginTop: 10 }}
          color='primary'
          onClick={() => {
            history.push(`/finance/statement/editstatement/${values.id}`)
          }}
        >
          Edit Statement
        </Button>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Details)
