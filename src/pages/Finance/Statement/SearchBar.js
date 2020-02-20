import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import { FastField, Field, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import moment from 'moment'
import {
  GridContainer,
  GridItem,
  TextField,
  Checkbox,
  Button,
  DateRangePicker,
  DatePicker,
  CodeSelect,
  ProgressButton,
} from '@/components'
// utils
import { roundTo } from '@/utils/utils'

const styles = () => ({
  container: {
    marginBottom: '10px',
  },
  addNewBtn: {
    textAlign: 'right',
  },
  allCompaniesCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
})

@withFormik({
  mapPropsToValues: () => ({
    copayerFK: 'All Company',
    statementStartDate: moment().subtract(1, 'months').startOf('month'),
    statementEndDate: moment().endOf('month'),
    dueStartDate: moment().subtract(1, 'months').startOf('month'),
    dueEndDate: moment().add(3, 'months').endOf('month'),
    // statementDates: [
    //   moment().subtract(1, 'months').startOf('month'),
    //   moment().endOf('month'),
    // ],
    // statementDueDates: [
    //   moment().subtract(1, 'months').startOf('month'),
    //   moment().add(3, 'months').endOf('month'),
    // ],
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const {
      statementNo,
      copayerFK,
      isAllDateChecked,
      isAllDueDateChecked,
      // statementDates,
      // statementDueDates,
      statementStartDate,
      statementEndDate,
      dueStartDate,
      dueEndDate,
    } = values
    let statementDateFrom
    let statementDateTo
    let statementDueDateFrom
    let statementDueDateTo

    if (!isAllDateChecked && statementStartDate && statementEndDate) {
      // const [
      //   fromDate,
      //   toDate,
      // ] = statementDates
      statementDateFrom = statementStartDate
      statementDateTo = statementEndDate
    }

    if (!isAllDueDateChecked && dueStartDate && dueEndDate) {
      // const [
      //   from,
      //   to,
      // ] = statementDueDates
      statementDueDateFrom = dueStartDate
      statementDueDateTo = dueEndDate
    }
    props.dispatch({
      type: 'statement/query',
      payload: {
        statementNo,
        copayerFK: typeof copayerFK === 'number' ? copayerFK : undefined,
        lgteql_statementDate: statementDateFrom,
        lsteql_statementDate: statementDateTo,
        isCancelled: false,
        apiCriteria: {
          DueDateFrom: statementDueDateFrom,
          DueDateTo: statementDueDateTo,
        },
      },
    })
  },
})
class SearchBar extends PureComponent {
  state = {
    showReport: false,
    showReportSelection: false,
  }

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

  handleOnChange = (name, checked) => (event) => {
    this.setState({ [name]: !checked })
    // if AllDate is checked, set datetime to max range
  }

  toggleReport = (v) => {
    this.setState((preState) => ({ showReport: !preState.showReport }))
  }

  toggleReportSelection = () => {
    this.setState((preState) => ({
      showReportSelection: !preState.showReportSelection,
    }))
  }

  render () {
    const { classes, history, dispatch, values, handleSubmit } = this.props
    const {
      statementStartDate,
      statementEndDate,
      dueStartDate,
      dueEndDate,
      isAllDateChecked,
      isAllDueDateChecked,
    } = values
    return (
      <GridContainer className={classes.container}>
        <GridItem container xs md={12}>
          <GridItem md={3}>
            <FastField
              name='statementNo'
              render={(args) => <TextField label='Statement No.' {...args} />}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='statementStartDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label='Statement From Date'
                  disabled={isAllDateChecked}
                  disabledDate={(d) => {
                    const endDate = statementEndDate
                      ? moment(statementEndDate)
                      : undefined
                    if (endDate) {
                      const range = moment.duration(d.diff(endDate))
                      const years = roundTo(range.asYears())
                      return !d || d.isAfter(endDate) || years > 1.0
                    }
                    return !d
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='statementEndDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label='Statement To Date'
                  disabled={isAllDateChecked}
                  disabledDate={(d) => {
                    const startDate = statementStartDate
                      ? moment(statementStartDate)
                      : undefined
                    if (startDate) {
                      const range = moment.duration(d.diff(startDate))
                      const years = roundTo(range.asYears())
                      return !d || d.isBefore(startDate) || years < -1.0
                    }
                    return !d
                  }}
                />
              )}
            />
          </GridItem>

          <GridItem xs sm={1} md={1} style={{ marginTop: 13 }}>
            <FastField
              name='isAllDateChecked'
              render={(args) => {
                return <Checkbox label='All Date' {...args} />
              }}
            />
          </GridItem>
        </GridItem>
        <GridItem container xs md={12}>
          <GridItem xs sm={3} md={3} style={{ position: 'relative' }}>
            <FastField
              name='copayerFK'
              render={(args) => {
                return (
                  <CodeSelect
                    {...args}
                    label='Company'
                    code='ctCopayer'
                    labelField='displayValue'
                    localFilter={(item) => item.coPayerTypeFK === 1}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='dueStartDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label='Statement Due From Date'
                  disabled={isAllDueDateChecked}
                  disabledDate={(d) => {
                    const endDate = dueEndDate ? moment(dueEndDate) : undefined
                    if (endDate) {
                      const range = moment.duration(d.diff(endDate))
                      const years = roundTo(range.asYears())
                      return !d || d.isAfter(endDate) || years < -1.0
                    }
                    return !d
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='dueEndDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  label='Statement Due To Date'
                  disabled={isAllDueDateChecked}
                  disabledDate={(d) => {
                    const startDate = dueStartDate
                      ? moment(dueStartDate)
                      : undefined
                    if (startDate) {
                      const range = moment.duration(d.diff(startDate))
                      const years = roundTo(range.asYears())
                      return !d || d.isBefore(startDate) || years > 1.0
                    }
                    return !d
                  }}
                />
              )}
            />
          </GridItem>

          <GridItem xs sm={1} md={1} style={{ marginTop: 13 }}>
            <FastField
              name='isAllDueDateChecked'
              render={(args) => {
                return <Checkbox label='All Date' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs sm={6} md={6} lg={8}>
            <ProgressButton color='primary' icon={<p />} onClick={handleSubmit}>
              <Search />
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                dispatch({
                  type: 'statement/updateState',
                  payload: {
                    entity: undefined,
                  },
                })
                history.push('/finance/statement/newstatement')
              }}
            >
              <Add />
              New Statement
            </Button>
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(SearchBar)
