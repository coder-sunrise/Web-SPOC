import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import {
  GridContainer,
  withFormikExtend,
  ProgressButton,
  WarningSnackbar,
  Button,
} from '@/components'
import { INVOICE_STATUS } from '@/utils/constants'
import { navigateDirtyCheck } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'
import Authorized from '@/utils/Authorized'
import Grid from './Grid'
import Header from './Header'

const styles = theme => ({
  ...basicStyle(theme),
})

const { Secured } = Authorized
@Secured('receivinggoods.receivinggoodsdetails')
@connect(({ rgPayment, receivingGoodsDetails, global }) => ({
  rgPayment,
  receivingGoodsDetails,
  mainDivHeight: global.mainDivHeight,
}))
@withFormikExtend({
  displayName: 'rgPayment',
  enableReinitialize: true,
  mapPropsToValues: ({ rgPayment }) => {
    let newReceivingGoodsPayment = []
    if (rgPayment) {
      const { receivingGoodsPayment } = rgPayment
      newReceivingGoodsPayment = receivingGoodsPayment.map(o => {
        let tempOutstandingAmount = {}
        if (o.id) {
          tempOutstandingAmount = {
            outstandingAmt: o.paymentAmount,
          }
        }
        return {
          ...o,
          ...tempOutstandingAmount,
        }
      })
    }

    return {
      ...rgPayment,
      receivingGoodsPayment: newReceivingGoodsPayment,
    }
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props
    const { receivingGoodsPayment, currentBizSessionInfo } = values

    let paymentData = receivingGoodsPayment.map((x, index) => {
      if (_.has(x, 'isNew')) {
        return {
          receivingGoodsFK: values.id,
          sequence: index + 1,
          clinicPaymentDto: {
            ...x,
            id: x.cpId,
            concurrencyToken: x.cpConcurrencyToken,
            createdOnBizSessionFK: currentBizSessionInfo.id,
            clinicPaymentTypeFK: 1,
            transactionOnBizSessionFK: currentBizSessionInfo.id,
            isCancelled: x.isCancelled,
            paymentMode: x.paymentModeTypeName,
            creditCardType: x.creditCardTypeName,
          },
        }
      }

      return {
        ...x,
        clinicPaymentDto: {
          ...x.clinicPaymentDto,
          cancelReason: x.cancelReason,
          isCancelled: x.isCancelled,
        },
      }
    })

    paymentData.forEach(o => {
      o.clinicPaymentDto.paymentModeFK =
        o.clinicPaymentDto.creditCardId || undefined
      o.clinicPaymentDto.creditCardTypeFK =
        o.clinicPaymentDto.typeId || undefined
    })

    dispatch({
      type: 'rgPayment/upsertRGPayment',
      payload: {
        receivingGoodsId: values.id,
        paymentData,
      },
    }).then(r => {
      if (r) {
        if (onConfirm) onConfirm()
        if (r) {
          dispatch({
            type: 'receivingGoodsDetails/queryReceivingGoods',
            payload: {
              id: props.receivingGoodsDetails.id,
            },
          }).then(v => {
            dispatch({
              type: 'rgPayment/queryRGPayment',
              payload: {
                ...v,
              },
            })
          })
        }
      }
    })
  },
})
class index extends PureComponent {
  componentDidMount = () => {
    this.refreshRGPayment()
  }

  refreshRGPayment = () => {
    this.props.dispatch({
      type: 'rgPayment/queryRGPayment',
      payload: this.props.receivingGoodsDetails,
    })
  }

  onClickCancelPayment = () => {
    const { dispatch, values, resetForm, history } = this.props
    resetForm()
    dispatch({
      type: 'receivingGoodsDetails/refresh',
      payload: {
        id: values.id,
      },
    }).then(() => {
      setTimeout(() => this.refreshRGPayment(), 500)
      history.push('/inventory/rg')
    })
  }

  getTotalPaid = () => {
    const activeRows = this.props.values.receivingGoodsPayment.filter(
      payment => !payment.isDeleted && !payment.isCancelled,
    )
    return _.sumBy(activeRows, 'paymentAmount') || 0
  }

  isPaymentUpdated = () => {
    const {
      values: { receivingGoodsPayment },
    } = this.props
    if (receivingGoodsPayment.find(item => item.id <= 0 || item.isUpdate))
      return true
    return false
  }

  render() {
    const {
      receivingGoodsDetails,
      rights,
      values: { currentBizSessionInfo },
      mainDivHeight = 700,
    } = this.props
    const { receivingGoods: rg } = receivingGoodsDetails
    const isWriteOff = rg
      ? rg.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false
    const hasActiveSession =
      currentBizSessionInfo && currentBizSessionInfo.id > 0

    let height =
      mainDivHeight -
      170 -
      ($('.filterReceivingGoodsPaymentBar').height() || 0) -
      ($('.footerReceivingGoodsPaymentBar').height() || 0)
    if (height < 300) height = 300
    return (
      <AuthorizedContext.Provider
        value={{
          rights: isWriteOff === true || !hasActiveSession ? 'disable' : rights,
        }}
      >
        <div>
          <div className='filterReceivingGoodsPaymentBar'>
            {!hasActiveSession && (
              <div style={{ paddingTop: 5 }}>
                <WarningSnackbar
                  variant='warning'
                  message='Action(s) is not allowed due to no active session was found.'
                />
              </div>
            )}
            <Header {...this.props} getTotalPaid={this.getTotalPaid} />
          </div>

          <Grid
            {...this.props}
            getTotalPaid={this.getTotalPaid}
            height={height}
          />

          <div className='footerReceivingGoodsPaymentBar'>
            {this.isPaymentUpdated() && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  color='danger'
                  icon={null}
                  onClick={navigateDirtyCheck({
                    onProceed: this.onClickCancelPayment,
                  })}
                >
                  Cancel
                </Button>
                <ProgressButton onClick={this.props.handleSubmit} />
              </div>
            )}
          </div>
        </div>
      </AuthorizedContext.Provider>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
