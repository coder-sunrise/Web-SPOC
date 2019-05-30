import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
// umi formatMessage
import { formatMessage } from 'umi/locale'
// formik
import { FastField, Field } from 'formik'
// devexpress-react-scheduler
// material ui
import { CircularProgress, Paper, withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  OutlinedTextField,
  Select,
  TextField,
  AntdInput,
  RadioGroup,
  Primary,
  Danger,
} from '@/components'
// custom components
import AppointmentTypeSelector from './AppointmentTypeSelector'
import { defaultColorOpts } from '../setting'

const doctors = [
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  { value: 'tan', name: 'Tan' },
  { value: 'tan1', name: 'Tan1' },
  { value: 'tan2', name: 'Tan2' },
  { value: 'tan3', name: 'Tan3' },
  { value: 'tan4', name: 'Tan4' },
  { value: 'tan5', name: 'Tan5' },
]

const recurrencePattern = [
  { name: 'None', value: 'none' },
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'wonthly' },
]

const RECURRENCE_RANGE = {
  AFTER: 'after',
  BY: 'by',
}

const styles = (theme) => ({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    zIndex: 99999,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  formContent: {
    padding: `${theme.spacing.unit}px 0`,
  },
  content: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    padding: `0px ${theme.spacing.unit}px`,
  },
  rowContainer: {
    padding: '0px !important',
  },
  colorChipContainer: {
    marginTop: 'auto',
    marginBottom: '10px',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  dateTimePreview: {
    fontSize: '1rem',
    textAlign: 'center',
  },
  buttonGroup: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const DATETIME_KEY = {
  START: 'start',
  END: 'end',
}

const _dateTimeFormat = 'DD MMM YYYY'

const Form = ({
  classes,
  values,
  onDateChange,
  onTimeChange,
  handleCreatePatientClick,
  handleSearchClick,
  isLoading,
}) => {
  const onStartDateChange = (value) => {
    onDateChange(DATETIME_KEY.START, value)
  }
  const onStartTimeChange = ({ target }) =>
    onTimeChange(DATETIME_KEY.START, target.value)

  const onEndDateChange = (value) => {
    onDateChange(DATETIME_KEY.END, value)
  }
  const onEndTimeChange = ({ target }) =>
    onTimeChange(DATETIME_KEY.END, target.value)

  const startDateValidation = (value) => {
    if (value === '') return 'Start date is required'
    if (!moment(value).isValid()) return 'Invalid date'

    // start date should be lower than end date
    const endDate = moment(values.endDate).isValid()
      ? moment(values.endDate)
      : ''
    if (endDate === '') return ''

    if (endDate.isBefore(moment(value)))
      return 'Start Date must be before End Date'

    return ''
  }

  const endDateValidation = (value) => {
    if (value === '') return 'End Date is required'
    if (!moment(value).isValid()) return 'Invalid date'

    // end date should be greater than start date
    const startDate = moment(values.startDate).isValid()
      ? moment(values.startDate)
      : ''
    if (startDate === '') return ''

    if (startDate.isAfter(moment(value)))
      return 'End Date must be after Start Date'

    return ''
  }

  const invalidStartDate = !moment(values.startDate).isValid()
  const invalidEndDate = !moment(values.endDate).isValid()
  console.log({ invalidStartDate, invalidEndDate })
  return (
    <Paper className={classnames(classes.content)}>
      {isLoading && (
        <div className={classnames(classes.loading)}>
          <CircularProgress />
          <Primary>
            <h3 style={{ fontWeight: 400 }}>Populating patient info...</h3>
          </Primary>
        </div>
      )}

      <GridContainer
        className={classnames(classes.formContent)}
        alignItems='flex-start'
      >
        <GridItem container xs md={7}>
          <GridItem xs md={7}>
            <Field
              name='patientName'
              render={(args) => (
                <AntdInput
                  {...args}
                  autoFocus
                  onPressEnter={handleSearchClick}
                  helpText='Press enter to search'
                  label={formatMessage({
                    id: 'reception.appt.form.patientName',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={5}>
            <div className={classnames(classes.buttonGroup)}>
              <Button size='sm' color='primary' onClick={handleSearchClick}>
                Search
              </Button>
              <Button
                size='sm'
                color='primary'
                onClick={handleCreatePatientClick}
              >
                Create Patient
              </Button>
            </div>
          </GridItem>
          <GridItem xs md={7}>
            <Field
              name='contactNo'
              render={(args) => (
                <AntdInput
                  {...args}
                  label={formatMessage({ id: 'reception.appt.form.contactNo' })}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={12}>
            <FastField
              name='remarks'
              render={(args) => (
                <OutlinedTextField
                  {...args}
                  multiline
                  rowsMax={6}
                  rows={4}
                  label={formatMessage({ id: 'reception.appt.form.remarks' })}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={6}>
            <FastField
              name='doctor'
              render={(args) => (
                <Select
                  {...args}
                  options={doctors}
                  label={formatMessage({ id: 'reception.appt.form.doctor' })}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={6}>
            <FastField
              name='appointmentType'
              render={(args) => (
                <AppointmentTypeSelector {...args} label='Appointment Type' />
              )}
            />
          </GridItem>
        </GridItem>

        <GridItem container xs md={5}>
          <GridItem
            container
            xs
            md={12}
            className={classnames(classes.rowContainer)}
          >
            <GridItem xs md={7}>
              <Field
                name='startDate'
                validate={startDateValidation}
                render={(args) => (
                  <DatePicker
                    {...args}
                    format={_dateTimeFormat}
                    onChange={onStartDateChange}
                    label={formatMessage({
                      id: 'reception.appt.form.startDate',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={5}>
              <Field
                name='startTime'
                render={(args) => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.appt.form.startTime',
                    })}
                    onChange={onStartTimeChange}
                    time
                    number={false}
                    suffix='hour'
                  />
                )}
              />
            </GridItem>
          </GridItem>
          <GridItem xs md={12}>
            {invalidStartDate ? (
              <Danger>
                <p className={classnames(classes.dateTimePreview)}>
                  {values.startDate}
                </p>
              </Danger>
            ) : (
              <p className={classnames(classes.dateTimePreview)}>
                {values.startDate}
              </p>
            )}
          </GridItem>

          <GridItem
            container
            xs
            md={12}
            className={classnames(classes.rowContainer)}
          >
            <GridItem xs md={7}>
              <Field
                name='endDate'
                validate={endDateValidation}
                render={(args) => (
                  <DatePicker
                    {...args}
                    format={_dateTimeFormat}
                    onChange={onEndDateChange}
                    label={formatMessage({ id: 'reception.appt.form.endDate' })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={5}>
              <Field
                name='endTime'
                render={(args) => (
                  <NumberInput
                    {...args}
                    label={formatMessage({ id: 'reception.appt.form.endTime' })}
                    onChange={onEndTimeChange}
                    time
                    number={false}
                    suffix='hour'
                  />
                )}
              />
            </GridItem>
          </GridItem>
          <GridItem xs md={12}>
            {invalidEndDate ? (
              <Danger>
                <p className={classnames(classes.dateTimePreview)}>
                  {values.endDate}
                </p>
              </Danger>
            ) : (
              <p className={classnames(classes.dateTimePreview)}>
                {values.endDate}
              </p>
            )}
          </GridItem>

          <GridItem xs md={12}>
            <FastField
              name='recurrencePattern'
              render={(args) => (
                <Select
                  {...args}
                  options={recurrencePattern}
                  label={formatMessage({
                    id: 'reception.appt.form.recurrencePattern',
                  })}
                />
              )}
            />
          </GridItem>
          {values.recurrencePattern !== 'none' && (
            <React.Fragment>
              <GridItem xs md={12}>
                <FastField
                  name='recurrenceRange'
                  render={(args) => (
                    <RadioGroup
                      {...args}
                      simple
                      options={[
                        {
                          value: RECURRENCE_RANGE.AFTER,
                          label: formatMessage({
                            id: 'reception.appt.form.endAfter',
                          }),
                        },
                        {
                          value: RECURRENCE_RANGE.BY,
                          label: formatMessage({
                            id: 'reception.appt.form.endBy',
                          }),
                        },
                      ]}
                      label={formatMessage({
                        id: 'reception.appt.form.recurrenceRange',
                      })}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs md={6}>
                {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
                  <Field
                    name='occurence'
                    render={(args) => (
                      <NumberInput
                        {...args}
                        label={formatMessage({
                          id: 'reception.appt.form.occurence',
                        })}
                      />
                    )}
                  />
                )}
                {values.recurrenceRange === RECURRENCE_RANGE.BY && (
                  <FastField
                    name='stopDate'
                    render={(args) => (
                      <DatePicker
                        {...args}
                        label={formatMessage({
                          id: 'reception.appt.form.stopDate',
                        })}
                      />
                    )}
                  />
                )}
              </GridItem>
            </React.Fragment>
          )}
        </GridItem>
      </GridContainer>
    </Paper>
  )
}

const FormComponent = withStyles(styles, { name: 'AppointmentFormComponent' })(
  Form,
)

export default FormComponent
