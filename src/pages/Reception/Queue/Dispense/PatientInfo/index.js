import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi locale
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom components
import {
  Button,
  Card,
  CardAvatar,
  CardBody,
  CommonModal,
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
} from '@/components'
// sub components
import VisitRemarks from './VisitRemarks'
import InvoiceRemarks from './InvoiceRemarks'
// assets
import avatar from '@/assets/img/faces/marc.jpg'
import { cardTitle } from '@/assets/jss'

const styles = () => ({
  title: {
    ...cardTitle,
    fontWeight: 400,
    textAlign: 'center',
  },
  avatar: {
    marginTop: '10px',
  },
  noMarginTopBottom: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  noMarginBottom: {
    marginBottom: '0px',
  },
})

@withFormik({
  mapPropsToValues: () => ({
    VisitRefNo: '190402-01-1.0',
    QueueNo: '1.0',
    VisitAmount: 0,
    OutstandingBalance: 0,
    Remarks: 'None',
  }),
})
class PatientInfo extends PureComponent {
  state = {
    showVisitRemarks: false,
    showInvoiceRemarks: false,
  }

  toggleVisitRemarks = () => {
    const { showVisitRemarks } = this.state
    this.setState({ showVisitRemarks: !showVisitRemarks })
  }

  toggleInvoiceRemarks = () => {
    const { showInvoiceRemarks } = this.state
    this.setState({ showInvoiceRemarks: !showInvoiceRemarks })
  }

  render () {
    const { showVisitRemarks, showInvoiceRemarks } = this.state
    const { classes } = this.props
    return (
      <div>
        <Card
          profile
          classes={{
            card: classes.noMarginTopBottom,
          }}
        >
          <CardAvatar profile classes={{ cardAvatarProfile: classes.avatar }}>
            <img src={avatar} alt='patient-avatar' />
          </CardAvatar>
          <CardBody profile>
            <React.Fragment>
              <h4>PT-000025A</h4>
              <h5>S1234567D</h5>
              <h5>Test Patient 01</h5>
              <h5>Male / 39</h5>
            </React.Fragment>
          </CardBody>
        </Card>
        <Card classes={{ card: classes.noMarginTopBottom }}>
          <CardBody formHorizontal>
            <h4 className={classnames(classes.title)}>Visit Info</h4>
            <GridContainer direction='column'>
              <GridItem xs>
                <FastField
                  name='VisitRefNo'
                  render={(args) => (
                    <TextField disabled label='Visit Ref No.' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs>
                <FastField
                  name='QueueNo'
                  render={(args) => (
                    <TextField disabled label='Queue No.' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs>
                <FastField
                  name='VisitAmount'
                  render={(args) => (
                    <NumberInput
                      disabled
                      currency
                      label='Visit Amount'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs>
                <FastField
                  name='OutstandingBalance'
                  render={(args) => (
                    <NumberInput
                      disabled
                      currency
                      label='O/S Balance'
                      {...args}
                    />
                  )}
                />
              </GridItem>

              <GridItem xs>
                <Button
                  fullWidth
                  size='sm'
                  color='info'
                  simple
                  onClick={this.toggleVisitRemarks}
                >
                  <FormattedMessage id='reception.queue.dispense.patientInfo.viewVisitRemarks' />
                </Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
        <Card classes={{ card: classes.noMarginTopBottom }}>
          <CardBody formHorizontal>
            <h4 className={classnames(classes.title)}>Finance</h4>
            <GridContainer direction='column'>
              <GridItem xs>
                <h5>
                  This patient is having $0.00 outstanding balance. (Excl this
                  session)
                </h5>
              </GridItem>
              <GridItem xs>
                <Button
                  fullWidth
                  size='sm'
                  simple
                  color='info'
                  onClick={this.toggleInvoiceRemarks}
                >
                  <FormattedMessage id='reception.queue.dispense.patientInfo.viewInvoiceRemarks' />
                </Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
        <CommonModal
          open={showVisitRemarks}
          title={formatMessage({
            id: 'reception.queue.dispense.patientInfo.visitRemarks',
          })}
          onClose={this.toggleVisitRemarks}
          onConfirm={this.toggleVisitRemarks}
          maxWidth='md'
          showFooter={false}
        >
          <VisitRemarks handleCancel={this.toggleVisitRemarks} />
        </CommonModal>
        <CommonModal
          open={showInvoiceRemarks}
          title={formatMessage({
            id: 'reception.queue.dispense.patientInfo.invoiceRemarks',
          })}
          onClose={this.toggleInvoiceRemarks}
          onConfirm={this.toggleInvoiceRemarks}
          maxWidth='sm'
          showFooter={false}
        >
          <InvoiceRemarks />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles)(PatientInfo)
