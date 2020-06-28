import React, { PureComponent } from 'react'
import Print from '@material-ui/icons/Print'
import Info from '@material-ui/icons/Info'
import { withStyles } from '@material-ui/core'
import { ReportViewer, DeleteWithPopover } from '@/components/_medisys'
import * as service from '../services/index'
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
} from '@/components'

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


class PaymentHistory extends PureComponent {
  state = {
    open: false,
    statementPaymentList: [],
    statementPaymentId: 0,
    showError: false,
    errorMessage: '',
    cancelReason: '',
  }

  componentDidMount () {
    this.queryPaymentList()
  }

  onCancelReasonChange = (event) => {
    if (event.target.value !== '' || event.target.value !== undefined)
      this.setState({
        showError: false,
        cancelReason: event.target.value,
      })
  }

  handleConfirmDelete = async (id, toggleVisibleCallback) => {
    console.log({ id })
    if (this.state.cancelReason === '' || this.state.cancelReason === undefined) {
      this.setState({
        showError: true,
        errorMessage: 'Cancel reason is required',
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
      this.queryPaymentList()
    }
  }

  handleCancelClick = () => {
    this.setState({
      showError: false,
      errorMessage: '',
      cancelReason: '',
    })
  }

  queryPaymentList = async () => {
    const response = await service.queryPaymentList({
      pagesize: 999,
      statementFK: this.props.values.id,
      sorting: [
        { columnName: 'paymentReceivedDate', direction: 'desc' },
        { columnName: 'receiptNo', direction: 'desc' },
      ],
    })
    this.setState({
      statementPaymentList: response.data.data || [],
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
      statementPaymentId: paymentId,
      open: true,
    })
  }

  onCloseReport = () => {
    this.setState({
      open: false,
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        <CommonTableGrid
          rows={this.state.statementPaymentList}
          onRowDoubleClick={this.showDetails}
          columns={[
            { name: 'receiptNo', title: 'Receipt No.' },
            { name: 'paymentReceivedDate', title: 'Receipt Date' },
            { name: 'paymentMode', title: 'Payment Mode' },
            { name: 'amount', title: 'Amount' },
            { name: 'remark', title: 'Remarks' },
            { name: 'cancelDate', title: 'Voided Date' },
            { name: 'cancelReason', title: 'Voided Reason' },
            { name: 'action', title: 'Action' },
          ]}
          columnExtensions={[
            {
              columnName: 'receiptNo',
              sortingEnabled: false,
              width: 120,
            },
            {
              columnName: 'paymentReceivedDate',
              sortingEnabled: false,
              type: 'date',
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
              width: 150,
            },
            {
              columnName: 'remark',
              sortingEnabled: false,
              width: 180,
            },
            {
              columnName: 'cancelDate',
              type: 'date',
              format: dateFormatLong,
              sortingEnabled: false,
              width: 100,
            },
            {
              columnName: 'cancelReason',
              sortingEnabled: false,
              width: 180,
            },
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
        <CommonModal
          open={this.state.open}
          onClose={this.onCloseReport}
          title='Statement'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={53}
            reportParameters={{
              isSaved: true, StatementPaymentId: this.state.statementPaymentId,
            }}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PaymentHistory)
