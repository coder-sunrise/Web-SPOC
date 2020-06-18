import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField, withFormik, Field } from 'formik'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import Authorized from '@/utils/Authorized'
import { formTypes, formStatus } from '@/utils/codes'
import {
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
  CodeSelect,
} from '@/components'
import { FilterBarDate } from '@/components/_medisys'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

@withFormik({
  mapPropsToValues: () => ({
    formSearchStartDate: moment().add(-1, 'month'),
    formSearchEndDate: moment(),
  }),
})
class FilterBar extends PureComponent {
  render () {
    const { classes, dispatch, simple, values } = this.props
    const {
      formSearchStartDate,
      formSearchEndDate,
      status = [],
      formType = [],
    } = values
    const maxformstatusCount = status.length <= 1 ? 1 : 0
    const maxformtypesCount = formType.length <= 1 ? 1 : 0
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <Authorized authority='patientdatabase/searchpatient'>
            <GridItem sm={12} md={4} style={{ position: 'relative' }}>
              <FastField
                name='patientSearchValue'
                render={(args) => {
                  return (
                    <TextField
                      autoFocus={!simple}
                      label={formatMessage({
                        id: 'reception.queue.patientSearchPlaceholder',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </Authorized>
          <GridItem xs={6} md={2}>
            <FastField
              name='status'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Status'
                    options={formStatus.filter((o) => o.value !== 1)}
                    {...args}
                    mode='multiple'
                    valueField='value'
                    all={-99}
                    defaultOptions={[
                      {
                        isExtra: true,
                        id: -99,
                        displayValue: 'All form status',
                      },
                    ]}
                    maxTagCount={maxformstatusCount}
                    maxTagPlaceholder='form status'
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='formType'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Form Type'
                    options={formTypes}
                    {...args}
                    mode='multiple'
                    valueField='value'
                    all={-99}
                    defaultOptions={[
                      {
                        isExtra: true,
                        id: -99,
                        displayValue: 'All form types',
                      },
                    ]}
                    maxTagCount={maxformtypesCount}
                    maxTagPlaceholder='form types'
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={12} />
          <GridItem md={2}>
            <Field
              name='formSearchStartDate'
              render={(args) => (
                <FilterBarDate
                  args={args}
                  label='Visit Date From'
                  formValues={{
                    startDate: formSearchStartDate,
                    endDate: formSearchEndDate,
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='formSearchEndDate'
              render={(args) => (
                <FilterBarDate
                  isEndDate
                  args={args}
                  label='Visit Date To'
                  formValues={{
                    startDate: formSearchStartDate,
                    endDate: formSearchEndDate,
                  }}
                />
              )}
            />
          </GridItem>

          <GridItem md={12} lg={5}>
            <div className={classes.filterBtn}>
              <Authorized authority='patientdatabase/searchpatient'>
                <ProgressButton
                  variant='contained'
                  color='primary'
                  icon={<Search />}
                  onClick={() => {
                    const { patientSearchValue } = this.props.values
                    this.props.dispatch({
                      type: 'formListing/query',
                      payload: {
                        apiCriteria: {
                          searchValue: patientSearchValue,
                          visitDateFrom: moment(
                            formSearchStartDate,
                          ).formatUTC(),
                          visitDateTo: moment(formSearchEndDate).formatUTC(
                            false,
                          ),
                          formType:
                            formType.length > 0 ? formType.join() : undefined,
                          formStatus:
                            status.length > 0 ? status.join() : undefined,
                        },
                      },
                    })
                  }}
                >
                  Search
                </ProgressButton>
              </Authorized>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
