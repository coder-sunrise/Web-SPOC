import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Print from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import { withStyles } from '@material-ui/core'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import {
  ReportViewer,
  DeleteWithPopover,
  AccordionTitle,
} from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import {
  Button,
  CommonTableGrid,
  dateFormatLong,
  Tooltip,
  FastField,
  CommonModal,
  TextField,
  notification,
  Danger,
  Accordion,
} from '@/components'
import * as service from '../services/index'
// material ui
// common components
// sub components

const styles = (theme) => ({
  errorContainer: {
    textAlign: 'left',
    lineHeight: '1em',
    paddingBottom: theme.spacing(1),
    '& span': {
      fontSize: '.8rem',
    },
  },
})

@connect(({ statement }) => ({
  statement,
}))
class PaymentHistory extends PureComponent {
  state = {
    open: false,
    showError: false,
    errorMessage: '',
    cancelReason: '',
  }

  componentDidMount () {
    const { match: { params } } = this.props
    this.props.dispatch({
      type: 'statement/queryPaymentHistory',
      payload: {
        id: params.id,
      },
    })
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'statement/queryPaymentHistoryDone',
      payload: {
        statementPaymentList: [],
        invoicePaymentList: [],
      },
    })
  }

  onCancelReasonChange = (event) => {
    if (event.target.value !== '' || event.target.value !== undefined)
      this.setState({
        showError: false,
        cancelReason: event.target.value,
      })
  }

  handleConfirmDelete = async (id, toggleVisibleCallback) => {
    if (
      this.state.cancelReason === '' ||
      this.state.cancelReason === undefined
    ) {
      this.setState({
        showError: true,
        errorMessage: 'Void reason is required',
      })
    } else {
      toggleVisibleCallback()
      await service.cancelPayment(id, {
        cancelReason: this.state.cancelReason,
      })
      this.setState({
        showError: false,
        errorMessage: '',
        cancelReason: '',
      })
      this.props.dispatch({
        type: 'statement/refreshAll',
        payload: {
          id: this.props.values.id,
        },
      })
    }
  }

  handleConfirmDeleteSinglePayment = async (item, toggleVisibleCallback) => {
    if (
      this.state.cancelReason === '' ||
      this.state.cancelReason === undefined
    ) {
      this.setState({
        showError: true,
        errorMessage: 'Void reason is required',
      })
    } else {
      toggleVisibleCallback()
      await service.cancelSinglePayment(item.id, {
        cancelReason: this.state.cancelReason,
        concurrencyToken: item.concurrencyToken,
      })
      this.setState({
        showError: false,
        errorMessage: '',
        cancelReason: '',
      })
      this.props.dispatch({
        type: 'statement/refreshAll',
        payload: {
          id: this.props.values.id,
        },
      })
    }
  }

  handleCancelClick = () => {
    this.setState({
      showError: false,
      errorMessage: '',
      cancelReason: '',
    })
  }

  showDetails = (row, e) => {
    const { history, dispatch } = this.props
    const accessRight = Authorized.check('statement.statementdetails')

    if (accessRight && accessRight.rights !== 'enable') {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return
    }
    history.push(`/finance/statement/statementpayment/${row.id}`)
  }

  onPrintReceiptClick = (paymentId) => {
    this.setState({
      reportId: 56,
      reportParameters: {
        isSaved: true,
        StatementPaymentId: paymentId,
      },
      open: true,
    })
  }

  onPrintInvoicePaymentReceiptClick = (paymentId) => {
    this.setState({
      reportId: 29,
      reportParameters: {
        isSaved: true,
        InvoicePaymentId: paymentId,
      },
      open: true,
    })
  }

  onCloseReport = () => {
    this.setState({
      open: false,
    })
  }

  render () {
    const {
      classes,
      statement: { statementPaymentList, invoicePaymentList },
    } = this.props
    const cloumns = [
      { name: 'receiptNo', title: 'Receipt No.' },
      { name: 'paymentReceivedDate', title: 'Receipt Date' },
      { name: 'paymentMode', title: 'Payment Mode' },
      { name: 'amount', title: 'Amount' },
      { name: 'remark', title: 'Remarks' },
      { name: 'cancelDate', title: 'Voided Date' },
      { name: 'cancelReason', title: 'Voided Reason' },
      { name: 'action', title: 'Action' },
    ]
    const cloumnExtensions = [
      {
        columnName: 'receiptNo',
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'paymentReceivedDate',
        sortingEnabled: false,
        type: 'date',
        width: 120,
      },
      {
        columnName: 'paymentMode',
        sortingEnabled: false,
      },
      {
        columnName: 'amount',
        type: 'number',
        currency: true,
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'remark',
        sortingEnabled: false,
      },
      {
        columnName: 'cancelDate',
        type: 'date',
        format: dateFormatLong,
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'cancelReason',
        sortingEnabled: false,
      },
    ]
    return (
      <div>
        <Accordion
          // active={this.state.activePanel}
          // onChange={this.handleActivePanelChange}
          defaultActive={[
            0,
            1,
          ]}
          mode='multiple'
          leftIcon
          expandIcon={<SolidExpandMore fontSize='large' />}
          collapses={[
            {
              title: <AccordionTitle title='Statement Payment' />,
              content: (
                <CommonTableGrid
                  rows={statementPaymentList}
                  onRowDoubleClick={this.showDetails}
                  columns={cloumns}
                  columnExtensions={[
                    ...cloumnExtensions,
                    {
                      columnName: 'action',
                      sortingEnabled: false,
                      align: 'center',
                      width: 150,
                      render: (item) => {
                        return (
                          <div>
                            <Tooltip title='Show Details'>
                              <Button
                                size='sm'
                                onClick={() => {
                                  this.showDetails(item)
                                }}
                                justIcon
                                color='primary'
                              >
                                <Info />
                              </Button>
                            </Tooltip>
                            <DeleteWithPopover
                              index={item.id}
                              title='Void Payment'
                              tooltipText='void this Payment'
                              contentText='Confirm to void this payment?'
                              extraCmd={
                                item.id ? (
                                  <div className={classes.errorContainer}>
                                    <FastField
                                      name='cancelReason'
                                      render={(args) => (
                                        <TextField
                                          label='Void Reason'
                                          autoFocus
                                          {...args}
                                          onChange={this.onCancelReasonChange}
                                        />
                                      )}
                                    />
                                    {this.state.showError && (
                                      <Danger>
                                        <span>{this.state.errorMessage}</span>
                                      </Danger>
                                    )}
                                  </div>
                                ) : (
                                  undefined
                                )
                              }
                              onCancelClick={this.handleCancelClick}
                              onConfirmDelete={this.handleConfirmDelete}
                              disabled={item.isCancelled}
                            />
                            <Tooltip title='Print Payment Receipt'>
                              <Button
                                size='sm'
                                onClick={() => {
                                  this.onPrintReceiptClick(item.id)
                                }}
                                justIcon
                                color='primary'
                                disabled={item.isCancelled}
                              >
                                <Print />
                              </Button>
                            </Tooltip>
                          </div>
                        )
                      },
                    },
                  ]}
                  FuncProps={{
                    pager: false,
                  }}
                />
              ),
            },
            {
              title: <AccordionTitle title='Invoice Payment' />,
              content: (
                <CommonTableGrid
                  rows={invoicePaymentList}
                  columns={cloumns}
                  columnExtensions={[
                    ...cloumnExtensions,
                    {
                      columnName: 'action',
                      sortingEnabled: false,
                      align: 'center',
                      width: 150,
                      render: (item) => {
                        return (
                          <div>
                            <DeleteWithPopover
                              index={item.id}
                              title='Void Payment'
                              tooltipText='void this Payment'
                              contentText='Confirm to void this payment?'
                              extraCmd={
                                item.id ? (
                                  <div className={classes.errorContainer}>
                                    <FastField
                                      name='cancelReason'
                                      render={(args) => (
                                        <TextField
                                          label='Void Reason'
                                          autoFocus
                                          {...args}
                                          onChange={this.onCancelReasonChange}
                                        />
                                      )}
                                    />
                                    {this.state.showError && (
                                      <Danger>
                                        <span>{this.state.errorMessage}</span>
                                      </Danger>
                                    )}
                                  </div>
                                ) : (
                                  undefined
                                )
                              }
                              onCancelClick={this.handleCancelClick}
                              onConfirmDelete={(id, toggleVisibleCallback) => {
                                this.handleConfirmDeleteSinglePayment(
                                  item,
                                  toggleVisibleCallback,
                                )
                              }}
                              disabled={item.isCancelled}
                            />
                            <Tooltip title='Print Payment Receipt'>
                              <Button
                                size='sm'
                                onClick={() => {
                                  this.onPrintInvoicePaymentReceiptClick(
                                    item.id,
                                  )
                                }}
                                justIcon
                                color='primary'
                                disabled={item.isCancelled}
                              >
                                <Print />
                              </Button>
                            </Tooltip>
                          </div>
                        )
                      },
                    },
                  ]}
                  FuncProps={{
                    pager: false,
                  }}
                />
              ),
            },
          ]}
        />
        <CommonModal
          open={this.state.open}
          onClose={this.onCloseReport}
          title='Statement'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={this.state.reportId}
            reportParameters={this.state.reportParameters}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PaymentHistory)
