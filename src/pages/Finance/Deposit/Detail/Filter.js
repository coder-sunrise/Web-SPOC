import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Paper, Typography, Divider } from '@material-ui/core'
import { FilterList } from '@material-ui/icons'
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'

const styles = (theme) => ({
  root: {
    padding: '10px',
  },
  filterBtn: {
    paddingTop: '13px',
    textAlign: 'left',
  },
})

@withFormik({
  mapPropsToValues: () => {},
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <Paper className={classes.root}>
        <GridContainer zeroMinWidth spacing={8}>
          <GridItem xs sm={8} md={10}>
            <GridContainer spacing={8}>
              <GridItem xs sm={5} md={3}>
                <FastField
                  name='OutstandingBalance'
                  render={(args) => (
                    <Checkbox {...args} prefix='Outstanding Invoice' />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='OverpayInvoice'
                  render={(args) => (
                    <Checkbox {...args} prefix='Overpay Invoice' />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='InvoiceDate'
                  render={(args) => (
                    <Checkbox {...args} prefix='Invoice Date' />
                  )}
                />
              </GridItem>
            </GridContainer>
            <GridContainer spacing={8}>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='StartDate'
                  render={(args) => (
                    <DatePicker
                      label={formatMessage({
                        id: 'form.date.placeholder.start',
                      })}
                      timeFormat={false}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='EndDate'
                  render={(args) => (
                    <DatePicker
                      label={formatMessage({ id: 'form.date.placeholder.end' })}
                      timeFormat={false}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
            <GridContainer spacing={8}>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='Patient'
                  render={(args) => (
                    <TextField
                      label={formatMessage({
                        id: 'finance.doctor-expense.patient',
                      })}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={3}>
                <FastField
                  name='InvoiceNo'
                  render={(args) => (
                    <TextField
                      label={formatMessage({
                        id: 'finance.corporate-billing.invoiceNo',
                      })}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs sm={3} md={2}>
                <div className={classes.filterBtn}>
                  <Button color='rose'>
                    <FilterList />
                    <FormattedMessage id='form.filter' />
                  </Button>
                </div>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs sm={4} md={2}>
            <GridContainer
              direction='column'
              justify='space-evenly'
              spacing={16}
            >
              <GridItem xs>
                <Typography variant='h5' align='right'>
                  Company
                </Typography>
              </GridItem>
              <GridItem xs>
                <Typography variant='h6' gutterBottom align='right'>
                  Singapore Airline
                </Typography>
              </GridItem>
              <Divider />
              <GridItem xs>
                <Typography variant='h5' color='secondary' align='right'>
                  Outstanding Balance
                </Typography>
              </GridItem>
              <GridItem xs>
                <Typography variant='h6' align='right'>
                  $1160.00
                </Typography>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </Paper>
    )
  }
}

export default withStyles(styles)(Filter)
