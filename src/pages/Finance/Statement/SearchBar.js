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
  }

  onAllDateClick = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
    // if AllDate is checked, set datetime to max range
  }

  render () {
    const { handleSubmit, classes, handleAddNew } = this.props

    const { allCompanies, allStatementDate, allStatementDueDate } = this.state

    return (
      <GridContainer className={classes.container}>
        <GridItem container xs md={12}>
          <GridItem xs sm={3} md={3}>
            <FastField
              name='StatementNo'
              render={(args) => <TextField label='Statement No.' {...args} />}
            />
          </GridItem>
          <GridItem xs sm={2} md={2}>
            <Field
              name='StatementStartDate'
              render={(args) => (
                <DatePicker
                  disabled={allStatementDate}
                  label={formatMessage({
                    id: 'finance.statement.statementDate',
                  })}
                  prefix={formatMessage({ id: 'finance.statement.date.from' })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={2} md={2}>
            <Field
              name='StatementEndDate'
              render={(args) => (
                <DatePicker
                  disabled={allStatementDate}
                  label={formatMessage({
                    id: 'finance.statement.statementDate',
                  })}
                  prefix={formatMessage({ id: 'finance.statement.date.to' })}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={1} md={1}>
            <Checkbox
              label={formatMessage({ id: 'form.date.placeholder.allDate' })}
              checked={allStatementDate}
              onClick={this.onAllDateClick('allStatementDate')}
            />
          </GridItem>
        </GridItem>
        <GridItem container xs md={12}>
          <GridItem xs sm={3} md={3} style={{ position: 'relative' }}>
            <Field
              name='Company'
              render={(args) => (
                <TextField
                  disabled={allCompanies}
                  label={formatMessage({ id: 'finance.statement.company' })}
                  {...args}
                />
              )}
            />
            <div className={classes.allCompaniesCheck}>
              <FastField
                name='AllCompanies'
                render={(args) => {
                  return (
                    <Tooltip title='AllCompanies' placement='top-end'>
                      <Checkbox
                        simple
                        onClick={this.onAllDateClick('allCompanies')}
                        {...args}
                      />
                    </Tooltip>
                  )
                }}
              />
            </div>
          </GridItem>

          <GridItem xs sm={2} md={2}>
            <Field
              name='StatementDueStartDate'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'finance.statement.statementDueDate',
                  })}
                  prefix={formatMessage({ id: 'finance.statement.date.from' })}
                  disabled={allStatementDueDate}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={2} md={2}>
            <Field
              name='StatementDueEndDate'
              render={(args) => (
                <DatePicker
                  label={formatMessage({
                    id: 'finance.statement.statementDueDate',
                  })}
                  prefix={formatMessage({ id: 'finance.statement.date.to' })}
                  disabled={allStatementDueDate}
                  timeFormat={false}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={1} md={1}>
            <Checkbox
              label={formatMessage({ id: 'form.date.placeholder.allDate' })}
              checked={allStatementDueDate}
              onClick={this.onAllDateClick('allStatementDueDate')}
            />
          </GridItem>
          <GridItem xs sm={6} md={6} lg={8}>
            <Button color='primary' onClick={handleSubmit}>
              <Search />
              <FormattedMessage id='form.search' />
            </Button>
          </GridItem>
          <GridItem xs sm={6} md={6} lg={4} container justify='flex-end'>
            <div>
              <Button color='primary' onClick={handleAddNew}>
                <AddBox />
                <FormattedMessage id='form.addNew' />
              </Button>
              <CustomDropdown
                buttonText='Print'
                buttonProps={{
                  color: 'primary',
                  disabled: true,
                }}
                dropdownList={[
                  'By Doctor',
                  'By Item',
                  'By Patient',
                ]}
              />
            </div>
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(SearchBar)
