import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import { LinearProgress, withStyles } from '@material-ui/core'
// custom components
import { Button, SimpleAlert, Transition } from '@/components'
// sub components
import DispenseGrid from '../DispenseGrid'
import ItemControls from '../ItemControls'
import Preview from './Preview'

const STYLES = () => ({
  buttonGroup: {
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

class InvoiceView extends PureComponent {
  state = {
    isPreviewing: false,
    isFinalized: false,
    isLoading: false,
    showUnlockAlert: false,
    values: {
      invoiceNo: 'IV-0000280',
      invoiceDate: '24 April 2019',
      status: 'draft',
    },
  }

  togglePreview = () => {
    this.setState({ isPreviewing: true })
  }

  toggleEdit = () => {
    this.setState({ isPreviewing: false })
  }

  onFinalizeClick = () => {
    const { values } = this.state
    this.setState({
      isFinalized: true,
      values: { ...values, status: 'finalized' },
    })
  }

  onUnlockClick = () => {
    // show unlock success prompt and switch view to editview
    const { values } = this.state
    this.setState({ isLoading: true }, () => {
      setTimeout(() => {
        this.setState({
          showUnlockAlert: true,
          isFinalized: false,
          isPreviewing: true,
          isLoading: false,
          values: { ...values, status: 'draft' },
        })
      }, 1000)
    })
  }

  closeUnlockAlert = () => {
    this.setState({ showUnlockAlert: false })
  }

  handlePrint = () => {
    console.log('print invoice')
  }

  render () {
    const {
      isPreviewing,
      isFinalized,
      isLoading,
      showUnlockAlert,
      values,
    } = this.state
    const { classes } = this.props

    return (
      <div>
        {isLoading && <LinearProgress />}
        {!isPreviewing &&
        !isFinalized && (
          <Transition show={!isPreviewing}>
            <div>
              <DispenseGrid />
              <ItemControls />
              <div className={classnames(classes.buttonGroup)}>
                <Button color='primary'>
                  <FormattedMessage id='reception.queue.dispense.common.save' />
                </Button>
                <Button color='primary' onClick={this.togglePreview}>
                  <FormattedMessage id='reception.queue.dispense.preview' />
                </Button>
                <Button color='primary' onClick={this.onFinalizeClick}>
                  <FormattedMessage id='reception.queue.dispense.finalize' />
                </Button>
              </div>
            </div>
          </Transition>
        )}
        {(isPreviewing || isFinalized) && (
          <Transition show={isPreviewing || isFinalized}>
            <Preview
              isFinalized={isFinalized}
              handleEditClick={this.toggleEdit}
              handleUnlockClick={this.onUnlockClick}
              handleFinalizeClick={this.onFinalizeClick}
              handlePrintInvoice={this.handlePrint}
              handlePrintInvoiceWithSummary={this.handlePrint}
              invoiceValues={values}
            />
          </Transition>
        )}
        <SimpleAlert
          title='Invoice is unlocked successfully'
          open={showUnlockAlert}
          confirmBtnText='Ok'
          onOk={this.closeUnlockAlert}
        />
      </div>
    )
  }
}

export default withStyles(STYLES)(InvoiceView)
