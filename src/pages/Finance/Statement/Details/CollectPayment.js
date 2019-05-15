import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from 'umi/locale'
import { FastField, withFormik } from 'formik'
import { Paper, withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  NumberInput,
  Select,
  TextField,
} from '@/components'

const styles = () => ({
  root: {
    padding: '10px',
    marginTop: '10px',
    marginBottom: '10px',
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
        <GridItem xs sm={12} md={6} lg={12}>
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
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
      )}
      {showCardNo && (
        <GridItem xs sm={12} md={6} lg={12}>
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
        <GridItem xs sm={12} md={6} lg={12}>
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
        <GridItem xs sm={12} md={6} lg={12}>
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
        <GridItem xs sm={12} md={6} lg={12}>
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

const PaymentComponent = ({ paymentMode }) => {
  // paymentMode || { value: '' } -> set paymentMode = { value: '' } as default when paymentMode = null
  // { value = '' } = paymentMode -> set value = '' as default when paymentMode = undefined
  const { value = '' } = paymentMode || { value: '' }

  switch (value.toLowerCase()) {
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
  mapPropsToValues: () => ({
    PaymentMode: undefined,
  }),
  handleSubmit: ({ values, props: { onSubmit } }) =>
    onSubmit !== undefined && onSubmit(values),
})
class CollectPayment extends PureComponent {
  render () {
    const { values, classes } = this.props

    return (
      <React.Fragment>
        <GridContainer direction='column' alignItems='flex-end'>
          <GridItem container xs={12} lg={8}>
            <NumberInput
              currency
              disabled
              prefix={formatMessage({
                id: 'finance.statement.details.collectedAmount',
              })}
            />
          </GridItem>
          <GridItem container xs={12} lg={8}>
            <NumberInput
              currency
              disabled
              prefix={formatMessage({
                id: 'finance.statement.details.currentOutstanding',
              })}
            />
          </GridItem>
        </GridContainer>
        <Paper className={classes.root}>
          <GridContainer spacing={8} alignItems='center' justify='center'>
            <GridItem lg={12}>
              <FastField
                name='amount'
                render={(args) => (
                  <NumberInput
                    currency
                    {...args}
                    prefix={formatMessage({
                      id: 'finance.statement.details.amount',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs sm={12} md={6} lg={12}>
              <FastField
                name='PaymentMode'
                render={(args) => {
                  return (
                    <Select
                      fullWidth
                      label={formatMessage({
                        id: 'finance.statement.details.paymentMode',
                      })}
                      options={[
                        { name: 'Cash', value: 'cash' },
                        { name: 'Nets', value: 'nets' },
                        { name: 'Credit card', value: 'creditCard' },
                        { name: 'Cheque', value: 'cheque' },
                        { name: 'TT', value: 'tt' },
                        { name: 'Giro', value: 'giro' },
                      ]}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <PaymentComponent
              paymentMode={values.PaymentMode}
              {...this.props}
            />
          </GridContainer>
        </Paper>
      </React.Fragment>
    )
  }
}

CollectPayment.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default withStyles(styles)(CollectPayment)
