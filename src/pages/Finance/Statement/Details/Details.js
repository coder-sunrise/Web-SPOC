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
  dateFormatLongWithTime,
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
    ],

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
    const { columns, showCollectPayment, FuncProps, showModal } = this.state
    const { classes, statement, values, theme } = this.props
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
              format: { dateFormatLong },
            },
          ]}
          FuncProps={FuncProps}
          getRowId={this.gridGetRowID}
          selection={this.state.selectedRows}
          onSelectionChange={this.handleSelectionChange}
        />

        <p style={{ margin: theme.spacing(1) }}>
          {`Last Refreshed On ${moment(values.lastRefreshTime).format(
            dateFormatLongWithTime,
          ) || '-'}`}
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
