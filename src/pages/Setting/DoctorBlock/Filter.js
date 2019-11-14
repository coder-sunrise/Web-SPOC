import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import * as Yup from 'yup'
import moment from 'moment'
import {
  GridContainer,
  GridItem,
  Button,
  CodeSelect,
  ProgressButton,
  DatePicker,
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
    dateFrom: moment().subtract(6, 'months'),
    dateTo: moment(),
    recurrence: undefined,
  }),
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date(),
    dateTo: Yup.date().when(
      'dateFrom',
      (dateFrom, schema) =>
        dateFrom &&
        schema.max(
          moment(dateFrom).add(6, 'months'),
          'Maximum 6 months date range.',
        ),
    ),
  }),
  handleSubmit: (values, { props }) => {
    const prefix = values.doctorName.length === 1 ? 'eql_' : 'in_'
    const doctorIDs = values.doctorName.join('|')
    props.dispatch({
      type: 'doctorBlock/query',
      payload: {
        // [`${prefix}name`]: values.doctorName,
        [`${prefix}DoctorBlockGroupFKNavigation.DoctorBlockUserFkNavigation.ClinicianProfile.DoctorProfileFkNavigation.Id`]: doctorIDs,
        lgteql_startDateTime: values.dateFrom
          ? moment(values.dateFrom).formatUTC()
          : undefined,
        lsteql_endDateTime: values.dateTo
          ? moment(values.dateTo).endOf('day').formatUTC(false)
          : undefined,
        'DoctorBlockGroupFKNavigation.DoctorBlockRecurrenceFKNavigation.RecurrencePatternFKNavigation.Id':
          values.recurrence,
        combineCondition: 'and',
      },
    })
  },
})
class Filter extends PureComponent {
  setDateTo = (v) => {
    if (v) {
      this.props.setFieldValue('dateTo', moment(v).add(6, 'months'))
    } else {
      this.props.setFieldValue('dateTo', undefined)
    }
  }

  render () {
    const { classes, values, handleSubmit } = this.props
    // console.log({ values })
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
                    id: -99,
                    clinicianProfile: {
                      name: 'All',
                    },
                  }}
                  labelField='clinicianProfile.name'
                  maxTagCount={values.doctorName.length > 1 ? 0 : 1}
                />
              )}
            />
          </GridItem>

          <GridItem xs={2} md={2}>
            <FastField
              name='dateFrom'
              render={(args) => {
                return (
                  <DatePicker
                    timeFormat={false}
                    label='From date'
                    onChange={(v) => this.setDateTo(v)}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} md={2}>
            <FastField
              name='dateTo'
              render={(args) => {
                return (
                  <DatePicker timeFormat={false} label='To date' {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='recurrence'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Recurrence Type'
                    code='LTRecurrencePattern'
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
                icon={<Search />}
                onClick={handleSubmit}
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
                <Add />
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
