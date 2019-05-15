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
  Card,
  CardHeader,
  CardBody,
  CardText,
} from '@/components'
// assets
import { cardTitle } from 'assets/jss'

const styles = (theme) => ({
  root: {
    padding: '10px',
  },
  filterBtn: {
    paddingTop: '13px',
    textAlign: 'left',
  },
  cardContainer: {
    marginBottom: 10,
  },
  cardBody: {
    padding: '0 !important',
  },
  cardTitle: { ...cardTitle, color: 'white' },
  companyName: {
    fontWeight: '600',
    color: 'white',
  },
  outstandingBalanceText: {
    color: 'red',
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
              <GridItem xs sm={5} md={2}>
                <FastField
                  name='OutstandingBalance'
                  render={(args) => (
                    <Checkbox {...args} label='Outstanding Invoice' />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={2}>
                <FastField
                  name='OverpayInvoice'
                  render={(args) => (
                    <Checkbox {...args} label='Overpay Invoice' />
                  )}
                />
              </GridItem>
              <GridItem xs sm={4} md={2}>
                <FastField
                  name='InvoiceDate'
                  render={(args) => <Checkbox {...args} label='Invoice Date' />}
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
            <Card pricing raised className={classes.cardContainer}>
              <CardHeader contact stats color='danger'>
                <h4 className={classes.cardTitle}>Company</h4>
                <h5 className={classes.companyName}>Singapore Airline</h5>
              </CardHeader>
              <CardBody pricing className={classes.cardBody}>
                <h5>Outstanding Balance</h5>
                <h5 className={classes.outstandingBalanceText}>$1160.00</h5>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Paper>
    )
  }
}

export default withStyles(styles)(Filter)
