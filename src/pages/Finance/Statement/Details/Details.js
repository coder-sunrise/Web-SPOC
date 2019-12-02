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
} from '@/components'
import CollectPaymentConfirm from './CollectPaymentConfirm'
import ExtractAsSingle from './ExtractAsSingle'
import PrintStatementReport from '../PrintStatementReport'

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
      const invoice = statement.entity.statementInvoice.find(
        (r) => r.invoiceNo === o,
      )
      if (!invoice) {
        rows = []
        return
      }
      rows.push(invoice)
    })
    this.setState({ extractRows: rows })
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
    const { classes, statement, values, theme } = this.props
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
              columnName: 'outstandingAmount',
              type: 'number',
              currency: true,
            },
            {
              columnName: 'invoiceDate',
              type: 'date',
              format: dateFormatLong,
            },
          ]}
          FuncProps={{
            selectable: true,
            selectConfig: {
              showSelectAll: true,
              rowSelectionEnabled: (row) => {
                return !row.statementInvoicePayment.length > 0
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
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Details)
