import React, { PureComponent } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi/locale'
import { withFormik, FastField } from 'formik'
import { Paper, withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  DatePicker,
  NumberInput,
  CustomInput,
  TextField,
} from '@/components'

const styles = () => ({
  root: {
    padding: '10px',
    marginBottom: '10px',
  },
})

@withFormik({
  mapPropsToValues: () => ({
    statementNo: 'SM-000002',
    coPayer: 'AIA/AIA',
    adminCharge: 10,
    paid: 0,
    statementDate: moment().add(-1, 'months'),
    paymentTerm: '30 Days',
    payableAmount: 1233,
    outstandingBalance: 490,
    // paymentDueDate: moment().add(+1, 'months'),
  }),
})
class DetailsHeader extends PureComponent {
  render () {
    const { classes, history } = this.props
    console.log('histroy', this.props)
    const boldFont = {
      fontWeight: 'bold',
    }
    return (
      <Paper className={classes.root}>
        <GridContainer item style={boldFont}>
          <GridItem xs>
            <FastField
              name='statementNo'
              render={(args) => (
                <TextField disabled label='Statement No.' {...args} />
              )}
            />
          </GridItem>

          <GridItem xs>
            <FastField
              name='coPayer'
              render={(args) => (
                <TextField disabled label='Co-Payer' {...args} />
              )}
            />
          </GridItem>

          <GridItem xs>
            <FastField
              name='adminCharge'
              render={(args) => (
                <TextField disabled label='Admin Charge' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='paid'
              render={(args) => <DatePicker disabled label='Paid' {...args} />}
            />
          </GridItem>
          {/* <GridItem xs>
                <FastField
                  name='Company'
                  render={(args) => (
                    <CustomInput
                      disabled
                      label={formatMessage({
                        id: 'finance.statement.company',
                      })}
                      {...args}
                    />
                  )}
                />
              </GridItem> */}
        </GridContainer>

        <GridContainer item style={{ fontWeight: 'bold', paddingBottom: 40 }}>
          {/* <GridItem xs>
                <FastField
                  name='TotalAmount'
                  render={(args) => (
                    <NumberInput
                      currency
                      disabled
                      label={formatMessage({
                        id: 'finance.statement.totalAmount',
                      })}
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
                      currency
                      disabled
                      label={formatMessage({
                        id: 'finance.statement.outstandingBalance',
                      })}
                      {...args}
                    />
                  )}
                />
              </GridItem> */}
          <GridItem xs>
            <FastField
              name='statementDate'
              render={(args) => (
                <DatePicker disabled label='Statement Date' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='paymentTerm'
              render={(args) => (
                <CustomInput disabled label='Payment Term' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='payableAmount'
              render={(args) => (
                <NumberInput
                  currency
                  disabled
                  label='Payable Amount'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='outstandingBalance'
              render={(args) => (
                <NumberInput currency disabled label='O/S Balance' {...args} />
              )}
            />
          </GridItem>

          {/* <GridItem xs>
            <FastField
              name='PaymentDueDate'
              render={(args) => (
                <DatePicker
                  disabled
                  label={formatMessage({
                    id: 'finance.statement.paymentDueDate',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem> */}
          {/* <GridItem xs lg={4}>
            <FastField
              name='Remark'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'finance.statement.details.remarks',
                  })}
                />
              )}
            />
          </GridItem> */}
        </GridContainer>
        <a
          style={{
            float: 'right',
            marginTop: -25,
            marginRight: 6,
          }}
          onClick={() => history.push(`/finance/statement/editstatement`)}
        >
          Edit statement
        </a>
      </Paper>
    )
  }
}

export default withStyles(styles)(DetailsHeader)
