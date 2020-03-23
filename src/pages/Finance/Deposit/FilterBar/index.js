import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField, Field, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
// matetrial ui
import PersonAdd from '@material-ui/icons/PersonAdd'
import Search from '@material-ui/icons/Search'
import { withStyles, Tooltip } from '@material-ui/core'
// assets
import { standardRowHeight } from 'mui-pro-jss'
// common components
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  ProgressButton,
} from '@/components'
import { FilterBarDate } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'

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
  mapPropsToValues: () => ({
    transactionStartDate: moment().add(-1, 'month'),
    transactionEndDate: moment(),
  }),
})
class FilterBar extends PureComponent {
  componentWillUnmount () {
    this.unmount()
  }

  unmount = () =>
    this.props.dispatch({
      type: 'invoiceList/updateState',
      payload: {
        filter: {},
      },
    })

  render () {
    const { classes, queryDepositListing, values } = this.props
    const { transactionStartDate, transactionEndDate } = values
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs sm={12} md={4}>
            <FastField
              name='patientSearchValue'
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
          <GridItem md={2}>
            <Field
              name='transactionStartDate'
              render={(args) => (
                <FilterBarDate
                  args={args}
                  label='Transaction Date From'
                  formValues={{
                    startDate: transactionStartDate,
                    endDate: transactionEndDate,
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='transactionEndDate'
              render={(args) => (
                <FilterBarDate
                  isEndDate
                  args={args}
                  label='Transaction Date To'
                  formValues={{
                    startDate: transactionStartDate,
                    endDate: transactionEndDate,
                  }}
                />
              )}
            />
          </GridItem>

          <GridItem md={4} />

          <GridItem xs sm={6} md={4}>
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
                    patientSearchValue,
                    transactionOnly,
                  } = this.props.values

                  const showTransactionOnly = transactionOnly === true

                  this.props.dispatch({
                    type: 'deposit/query',
                    payload: {
                      apiCriteria: {
                        searchValue: patientSearchValue || undefined,
                        onlyWithDeposit: showTransactionOnly,
                        startDate: transactionStartDate || undefined,
                        endDate: transactionEndDate || undefined,
                      },
                    },
                  })
                }}
              >
                <Search />
                <FormattedMessage id='form.search' />
              </ProgressButton>
              <Authorized authority='patientdatabase.newpatient'>
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
              </Authorized>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
