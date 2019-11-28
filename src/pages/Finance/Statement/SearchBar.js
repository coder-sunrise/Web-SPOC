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
  CodeSelect,
  ProgressButton,
} from '@/components'

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
    statementDates: [
      moment().startOf('month'),
      moment().endOf('month'),
    ],
    statementDueDates: [
      moment().startOf('month'),
      moment().endOf('month'),
    ],
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    // submit statementNo, statementDate, statementDueDate and company
    // back to parent component
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
    const { classes, history, dispatch, values } = this.props

    return (
      <GridContainer className={classes.container}>
        <GridItem container xs md={12}>
          <GridItem md={3}>
            <FastField
              name='statementNo'
              render={(args) => <TextField label='Statement No.' {...args} />}
            />
          </GridItem>
          <GridItem md={6}>
            <Field
              name='statementDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    disabled={values.isAllDateChecked}
                    label='Statement From Date'
                    label2='Statement To Date'
                    {...args}
                  />
                )
              }}
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
                  />
                )
              }}
            />
          </GridItem>

          <GridItem md={6}>
            <Field
              name='statementDueDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    disabled={values.isAllDueDateChecked}
                    label='Statement Due From Date'
                    label2='Statement Due To Date'
                    {...args}
                  />
                )
              }}
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
            <ProgressButton
              color='primary'
              icon={<p />}
              onClick={() => {
                const {
                  statementNo,
                  copayerFK,
                  isAllDateChecked,
                  isAllDueDateChecked,
                  statementDates,
                  statementDueDates,
                } = this.props.values
                let statementDateFrom
                let statementDateTo
                let statementDueDateFrom
                let statementDueDateTo

                if (!isAllDateChecked && statementDates) {
                  const [
                    from,
                    to,
                  ] = statementDates
                  statementDateFrom = from
                  statementDateTo = to
                }

                if (!isAllDueDateChecked && statementDueDates) {
                  const [
                    from,
                    to,
                  ] = statementDueDates
                  statementDueDateFrom = from
                  statementDueDateTo = to
                }

                this.props.dispatch({
                  type: 'statement/query',
                  payload: {
                    statementNo,
                    copayerFK: Number.isNaN(copayerFK) ? copayerFK : undefined,
                    lgteql_statementDate: statementDateFrom,
                    lsteql_statementDate: statementDateTo,
                    isCancelled: false,
                    apiCriteria: {
                      DueDateFrom: statementDueDateFrom,
                      DueDateTo: statementDueDateTo,
                    },
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
