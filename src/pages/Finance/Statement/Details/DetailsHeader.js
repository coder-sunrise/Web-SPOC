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
    StatementNo: 'SM-000002',
    StatementDate: moment().add(-1, 'months'),
    Company: 'AIA/AIA',
    TotalAmount: 1233,
    OutstandingBalance: 490,
    PaymentTerms: '30 Days',
    PaymentDueDate: moment().add(+1, 'months'),
  }),
})
class DetailsHeader extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <Paper className={classes.root}>
        <GridContainer>
          <GridItem xs md={7} lg={6} container>
            <GridContainer item>
              <GridItem xs>
                <FastField
                  name='StatementDate'
                  render={(args) => (
                    <DatePicker
                      disabled
                      label={formatMessage({
                        id: 'finance.statement.statementDate',
                      })}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs>
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
              </GridItem>
            </GridContainer>
            <GridContainer item>
              <GridItem xs>
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
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs md={5} lg={2} container direction='column'>
            <GridItem xs>
              <FastField
                name='PaymentTerms'
                render={(args) => (
                  <CustomInput
                    disabled
                    label={formatMessage({
                      id: 'finance.statement.paymentTerms',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs>
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
            </GridItem>
          </GridItem>
          <GridItem xs lg={4}>
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
          </GridItem>
        </GridContainer>
      </Paper>
    )
  }
}

export default withStyles(styles)(DetailsHeader)
