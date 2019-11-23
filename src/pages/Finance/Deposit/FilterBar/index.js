import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, PersonAdd } from '@material-ui/icons'
import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  DateRangePicker,
  ProgressButton,
} from '@/components'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    // paddingTop: '13px',
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 14,
  },
})

@withFormik({
  mapPropsToValues: () => {},
})
class FilterBar extends PureComponent {
  render () {
    const { classes, dispatch, theme, queryDepositListing } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs sm={12} md={4}>
            <FastField
              name='ExpenseType'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'reception.queue.patientSearchPlaceholder',
                    })}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={6} md={3}>
            <FastField
              name='transactionDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Transaction Date From'
                    label2='To'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={3} />

          <GridItem xs sm={6} md={3}>
            <FastField
              name='transactionOnly'
              render={(args) => {
                return (
                  <Tooltip
                    title={formatMessage({
                      id: 'finance.deposit.search.tansaction',
                    })}
                    placement='bottom'
                  >
                    <Checkbox
                      label={formatMessage({
                        id: 'finance.deposit.search.tansaction',
                      })}
                      simple
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>

          <GridItem xs={12} md={12}>
            <div className={classes.filterBtn}>
              <ProgressButton
                icon={null}
                variant='contained'
                color='primary'
                onClick={() => {
                  const {
                    transactionDates,
                    ExpenseType,
                    transactionOnly,
                  } = this.props.values

                  const showTransactionOnly = transactionOnly === true
                  // console.log('showTransactionOnly', showTransactionOnly)
                  this.props.dispatch({
                    type: 'deposit/query',
                    payload: {
                      keepFilter: false,
                      'lgteql_PatientDeposit.PatientDepositTransaction.TransactionDate': transactionDates
                        ? transactionDates[0]
                        : undefined,
                      'lsteql_PatientDeposit.PatientDepositTransaction.TransactionDate': transactionDates
                        ? transactionDates[1]
                        : undefined,
                      apiCriteria: {
                        OnlyWithDeposit: showTransactionOnly,
                      },
                      group: [
                        {
                          'contactFkNavigation.contactNumber.number': ExpenseType,
                          patientReferenceNo: ExpenseType,
                          patientAccountNo: ExpenseType,
                          name: ExpenseType,
                          combineCondition: 'or',
                        },
                      ],
                    },
                  })
                }}
              >
                <Search />
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'patient/openPatientModal',
                    payload: {
                      callback: () => {
                        this.props.dispatch({
                          type: 'patient/closePatientModal',
                        })
                        queryDepositListing()
                      },
                    },
                  })
                }}
              >
                <PersonAdd />
                <FormattedMessage id='reception.queue.patientSearch.registerNewPatient' />
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
