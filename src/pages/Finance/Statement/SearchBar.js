import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import { FastField, Field, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
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
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    // submit statementNo, statementDate, statementDueDate and company
    // back to parent component
  },
})
class SearchBar extends PureComponent {
  state = {
    allStatementDate: false,
    allStatementDueDate: false,
    allCompanies: false,
    isAllDateChecked: false,
    isAllDueDateChecked: false,
  }

  handleOnChange = (name, checked) => (event) => {
    console.log('xx')
    this.setState({ [name]: !checked })
    // if AllDate is checked, set datetime to max range
  }

  render () {
    const {
      handleSubmit,
      classes,
      handleAddNew,
      history,
      dispatch,
      values,
    } = this.props

    // const {
    //   allStatementDate,
    //   isAllDateChecked,
    //   isAllDueDateChecked,
    // } = this.state
    // console.log(isAllDateChecked)
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
                return <CodeSelect {...args} label='Company' code='ctCopayer' />
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
              New Statement
            </Button>
          </GridItem>
          <GridItem xs sm={6} md={6} lg={4} container justify='flex-end'>
            <Button color='primary'>Print Statement</Button>
            {/* <Button color='primary' onClick={handleAddNew}>
                <AddBox />
                <FormattedMessage id='form.addNew' />
              </Button> */}
            {/* <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  history.push('/finance/statement/details')
                }}
              >
                {/* <Add /> */}
            {/* Add New
              // </Button> */}
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(SearchBar)
