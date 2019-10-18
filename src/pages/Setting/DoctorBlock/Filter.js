import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import {
  GridContainer,
  GridItem,
  Button,
  Select,
  ProgressButton,
  DateRangePicker,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'

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
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})

const recurrenceTypes = [
  {
    id: 'daily',
    name: 'Daily',
  },
  {
    id: 'weekly',
    name: 'Weekly',
  },
  {
    id: 'monthly',
    name: 'Monthly',
  },
]

@withFormik({
  mapPropsToValues: () => ({
    doctorName: [],
  }),
  handleSubmit: () => {},
})
class Filter extends PureComponent {
  render () {
    const { classes, values } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='doctorName'
              render={(args) => (
                <DoctorProfileSelect
                  mode='multiple'
                  {...args}
                  allValue={-99}
                  allValueOption={{
                    clinicianProfile: {
                      name: 'All',
                      id: -99,
                    },
                  }}
                  labelField='clinicianProfile.name'
                  valueField='clinicianProfile.id'
                  maxTagCount={values.doctorName.length > 1 ? 0 : 1}
                />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='dates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Start Date'
                    label2='End Date'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={6} md={2}>
            <FastField
              name='recurrence'
              render={(args) => {
                return (
                  <Select
                    label='Recurrence Type'
                    options={recurrenceTypes}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.props.dispatch({
                    type: 'doctorBlock/query',
                    payload: {
                      // [`${prefix}name`]: values.doctorName
                      lgteql_startDateTime: values.dates[0],
                      lsteql_endDateTime: values.dates[1],
                      combineCondition: 'and',
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.toggleModal()
                  this.props.dispatch({
                    type: 'settingDoctorBlock/reset',
                  })
                }}
              >
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'DoctorBlockSetting' })(Filter)
