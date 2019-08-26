import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { FastField, Field, withFormik } from 'formik'
import { Typography, withStyles } from '@material-ui/core'
import { Search, AddBox, Print } from '@material-ui/icons'
import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  Checkbox,
  Button,
  CustomDropdown,
  Tooltip,
  DateRangePicker,
  Select,
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
    StatementDueStartDate: '',
    AllCompanies: 'allCompany',
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
    const { handleSubmit, classes, handleAddNew, history } = this.props

    const {
      allStatementDate,
      isAllDateChecked,
      isAllDueDateChecked,
    } = this.state
    console.log(isAllDateChecked)
    return (
      <GridContainer className={classes.container}>
        <GridItem container xs md={12}>
          <GridItem md={3}>
            <FastField
              name='StatementNo'
              render={(args) => <TextField label='Statement No.' {...args} />}
            />
          </GridItem>
          <GridItem md={6}>
            <Field
              name='statementDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    disabled={isAllDateChecked}
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
                return (
                  <Checkbox
                    label='All Date'
                    checked={isAllDateChecked}
                    onChange={this.handleOnChange(
                      'isAllDateChecked',
                      isAllDateChecked,
                    )}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridItem>
        <GridItem container xs md={12}>
          <GridItem xs sm={3} md={3} style={{ position: 'relative' }}>
            {/* <Field
              name='Company'
              render={(args) => (
                <TextField
                  disabled={allCompanies}
                  label={formatMessage({ id: 'finance.statement.company' })}
                  {...args}
                />
              )}
            /> */}
            {/* <div className={classes.allCompaniesCheck}> */}
            <FastField
              name='AllCompanies'
              render={(args) => {
                return (
                  // <Tooltip title='AllCompanies' placement='top-end'>
                  //   <Checkbox
                  //     simple
                  //     onClick={this.onAllDateClick('allCompanies')}
                  //     {...args}
                  //   />
                  // </Tooltip>
                  <Select
                    {...args}
                    label='Company'
                    options={[
                      { name: 'All Company', value: 'allCompany' },
                      { name: 'AIA', value: 'AIA' },
                      { name: '3M', value: '3M' },
                    ]}
                  />
                )
              }}
            />
            {/* </div> */}
          </GridItem>

          <GridItem md={6}>
            <Field
              name='statementDueDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    disabled={isAllDueDateChecked}
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
                return (
                  <Checkbox
                    label='All Date'
                    onChange={this.handleOnChange(
                      'isAllDueDateChecked',
                      isAllDueDateChecked,
                    )}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs sm={6} md={6} lg={8}>
            <Button color='primary' onClick={handleSubmit}>
              <Search />
              <FormattedMessage id='form.search' />
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
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
