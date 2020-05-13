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
  Select,
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
    const { formSearchStartDate, formSearchEndDate } = values

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
              name='statusFK'
              render={(args) => {
                return <Select label='Status' options={formStatus} {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='formTypeFK'
              render={(args) => {
                return (
                  <Select label='Form Type' options={formTypes} {...args} />
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
                  label='From'
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
                  label='To'
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
                    const {
                      patientSearchValue,
                      statusFK,
                      formTypeFK,
                    } = this.props.values
                    this.props.dispatch({
                      type: 'formListing/query',
                      payload: {
                        apiCriteria: {
                          searchValue: patientSearchValue,
                          visitDateFrom: formSearchStartDate,
                          visitDateTo: formSearchEndDate,
                          formType: formTypeFK,
                          formStatus: statusFK,
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
