import React, { PureComponent } from 'react'
import { withFormik, FastField } from 'formik'
import { formatMessage } from 'umi/locale'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { GridContainer, GridItem } from 'mui-pro-components'
import { DatePicker, Select, NumberInput, TextField } from '@/components'

const styles = (theme) => ({
  formContainer: {
    margin: '0 20px 20px 20px',
    textAlign: 'left',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  amountButton: {
    paddingTop: '27px',
  },
})

@withFormik({
  mapPropsToValues: () => {},
})
class ExpenseDetail extends PureComponent {
  render () {
    const { footer, onConfirm, classes } = this.props

    return (
      <React.Fragment>
        <Paper className={classes.formContainer}>
          <GridContainer spacing={8}>
            <GridItem xs sm={12} md={12}>
              <FastField
                name='Date'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({ id: 'finance.doctor-expense.date' })}
                    timeFormat={false}
                    autoFocus
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs sm={12} md={12}>
              <FastField
                name='ExpenseType'
                render={(args) => {
                  return (
                    <Select
                      label={formatMessage({
                        id: 'finance.doctor-expense.type',
                      })}
                      options={[
                        { name: 'Chris', value: 'Chris' },
                        { name: 'Patrik', value: 'Patrik' },
                        { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                        { name: 'Jack', value: 'Jack' },
                        { name: 'Jason', value: 'Jason' },
                        { name: 'Dave', value: 'Dave' },
                      ]}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs sm={12} md={12}>
              <FastField
                name='ExpenseType'
                render={(args) => {
                  return (
                    <Select
                      label={formatMessage({
                        id: 'finance.doctor-expense.doctor',
                      })}
                      options={[
                        { name: 'Chris', value: 'Chris' },
                        { name: 'Patrik', value: 'Patrik' },
                        { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                        { name: 'Jack', value: 'Jack' },
                        { name: 'Jason', value: 'Jason' },
                        { name: 'Dave', value: 'Dave' },
                      ]}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs sm={12} md={12}>
              <FastField
                name='Invoice Date'
                render={(args) => (
                  <DatePicker
                    label={formatMessage({
                      id: 'finance.doctor-expense.invoiceDate',
                    })}
                    timeFormat={false}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs sm={12} md={12}>
              <FastField
                name='Amount'
                render={(args) => (
                  <NumberInput
                    className={classes.amountButton}
                    prefix='Amount'
                    currency
                    {...args}
                  />
                )}
              />
            </GridItem>

            <GridItem xs sm={12} md={12}>
              <FastField
                name='Description'
                render={(args) => (
                  <TextField
                    label={formatMessage({
                      id: 'finance.doctor-expense.description',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>

            <GridItem xs sm={12} md={12}>
              <FastField
                name='Patient'
                render={(args) => {
                  return (
                    <Select
                      label={formatMessage({
                        id: 'finance.doctor-expense.patient',
                      })}
                      options={[
                        { name: 'Chris', value: 'Chris' },
                        { name: 'Patrik', value: 'Patrik' },
                        { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                        { name: 'Jack', value: 'Jack' },
                        { name: 'Jason', value: 'Jason' },
                        { name: 'Dave', value: 'Dave' },
                      ]}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </Paper>

        {footer &&
          footer({
            onConfirm,
            confirmBtnText: formatMessage({
              id: 'form.save',
            }),
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ExpenseDetail)
