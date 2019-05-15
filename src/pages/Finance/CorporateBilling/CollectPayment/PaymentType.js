import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import { withFormik, Field, FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { paymentMethods } from '@/utils/codes'
import {
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  GridContainer,
  GridItem,
  Select,
  TextField,
  NumberInput,
} from '@/components'

const styles = () => ({
  cardTitle: {
    display: 'inline-block',
    paddingTop: '20px',
    paddingLeft: '15px',
    fontWeight: 400,
    color: 'black',
  },
  cardSubTitle: {
    display: 'inline-block',
    float: 'right',
    width: '50%',
  },
  cardContainer: {
    marginTop: '10px',
  },
  cardBodyContent: {
    width: '50vh',
    paddingTop: '0px',
    maxWidth: '50vh',
  },
})

const PaymentComponentBase = ({
  showCardType,
  showCardNo,
  showReferenceNo,
  showChequeNo,
  showRemarks,
}) => {
  return (
    <React.Fragment>
      {showCardType && (
        <GridItem xs sm={12} md={12}>
          <FastField
            name='CreditCardType'
            render={(args) => (
              <Select
                label={formatMessage({
                  id: 'finance.collectPayment.cardType',
                })}
                options={[
                  { name: 'Visa', value: 'visa' },
                  { name: 'Master', value: 'master' },
                  { name: 'Amex', value: 'amex' },
                  { name: 'Visa/Master', value: 'visa/master' },
                  { name: 'DINER', value: 'diner' },
                  { name: 'Visa1', value: 'visa1' },
                  { name: 'Master1', value: 'master1' },
                  { name: 'Amex1', value: 'amex1' },
                  { name: 'Visa/Master1', value: 'visa/master1' },
                  { name: 'DINER1', value: 'diner1' },
                  { name: 'Visa2', value: 'visa2' },
                  { name: 'Master2', value: 'master2' },
                  { name: 'Amex2', value: 'amex2' },
                  { name: 'Visa/Master2', value: 'visa/master2' },
                  { name: 'DINER2', value: 'diner2' },
                  { name: 'Visa3', value: 'visa3' },
                  { name: 'Master3', value: 'master3' },
                  { name: 'Amex3', value: 'amex3' },
                  { name: 'Visa/Master3', value: 'visa/master3' },
                  { name: 'DINER3', value: 'diner3' },
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
      )}
      {showCardNo && (
        <GridItem xs sm={12} md={12}>
          <FastField
            name='CardNo'
            render={(args) => (
              <TextField
                label={formatMessage({
                  id: 'finance.collectPayment.cardNo',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
      )}

      {showReferenceNo && (
        <GridItem xs sm={12} md={12}>
          <FastField
            name='ReferenceNo'
            render={(args) => (
              <TextField
                label={formatMessage({
                  id: 'finance.collectPayment.referenceNo',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
      )}
      {showChequeNo && (
        <GridItem xs sm={12} md={12}>
          <FastField
            name='ChequeNo'
            render={(args) => (
              <TextField
                label={formatMessage({
                  id: 'finance.collectPayment.chequeNo',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
      )}

      {showRemarks && (
        <GridItem xs sm={12} md={12}>
          <FastField
            name='Remark'
            render={(args) => (
              <TextField
                label={formatMessage({
                  id: 'finance.collectPayment.remarks',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
      )}
    </React.Fragment>
  )
}

const PaymentComponent = ({ paymentMode = '' }) => {
  switch (paymentMode.toLowerCase()) {
    case 'cash':
    case 'nets':
      return <PaymentComponentBase showRemarks />
    case 'creditcard':
      return <PaymentComponentBase showCardType showCardNo showRemarks />
    case 'cheque':
      return <PaymentComponentBase showChequeNo showRemarks />
    case 'tt':
    case 'giro':
      return <PaymentComponentBase showReferenceNo showRemarks />
    default:
      return null
  }
}

@withFormik({
  mapPropsToValues: (props) => {
    const { totalAmount } = props
    return {
      PaymentMode: undefined,
      TotalAmount: totalAmount,
    }
  },
})
class PaymentType extends PureComponent {
  render () {
    const { totalAmount, values, classes } = this.props
    return (
      <div
        className='centerizedContent'
        style={{
          width: '100%',
        }}
      >
        <Card raised className={classes.cardContainer}>
          <CardHeader stats>
            <h3 className={classes.cardTitle}>Payments</h3>
            <Field
              name='TotalAmount'
              render={() => (
                <NumberInput
                  className={classes.cardSubTitle}
                  disabled
                  label='Total Amount'
                  value={totalAmount}
                  showErrorIcon
                  currency
                />
              )}
            />
          </CardHeader>
          <CardBody className={classes.cardBodyContent}>
            <GridContainer>
              <GridItem xs sm={12} md={6}>
                <FastField
                  name='StartDate'
                  render={(args) => (
                    <DatePicker
                      label={formatMessage({
                        id: 'form.date.placeholder',
                      })}
                      timeFormat={false}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs sm={12} md={6}>
                <FastField
                  name='PaymentMode'
                  render={(args) => (
                    <div className='select-up'>
                      <Select
                        label={formatMessage({
                          id: 'finance.corporate-billing.paymentMode',
                        })}
                        className='select-up'
                        options={paymentMethods}
                        {...args}
                      />
                    </div>
                  )}
                />
              </GridItem>
              <PaymentComponent
                paymentMode={values.PaymentMode}
                {...this.props}
              />
            </GridContainer>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PaymentType)
