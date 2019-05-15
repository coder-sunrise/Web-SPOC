import React from 'react'
import classnames from 'classnames'
// umi formatMessage
import { formatMessage } from 'umi/locale'
// formik
import { FastField, Field } from 'formik'
// devexpress-react-scheduler
// material ui
import { Chip, Paper, withStyles } from '@material-ui/core'
// custom component
import {
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  OutlinedTextField,
  Select,
  TextField,
  RadioGroup,
} from '@/components'
// custom components
import {
  defaultColorOpts,
  colorNameOptions,
  getColorMapping,
  getColorClassByColorName,
  reduceColorToClass,
} from '../ColorMapping'

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
})

const chipStyle = () => ({
  ...getColorMapping().reduce(reduceColorToClass, {}),
})

const ColorChipBase = ({ classes, value }) => {
  return (
    <Chip
      color='primary'
      key={value}
      label='SAMPLE'
      className={classnames([
        classes.chip,
        value === ''
          ? classes.defaultColor
          : getColorClassByColorName(value, classes),
      ])}
    />
  )
}

const ColorChip = withStyles(chipStyle, { name: 'ColorChip' })(ColorChipBase)

const DATETIME_KEY = {
  START: 'start',
  END: 'end',
}

const Form = ({ classes, values, onDateChange, onTimeChange }) => {
  const onStartDateChange = (value) => onDateChange(DATETIME_KEY.START, value)
  const onStartTimeChange = ({ target }) =>
    onTimeChange(DATETIME_KEY.START, target.value)

  const onEndDateChange = (value) => onDateChange(DATETIME_KEY.END, value)
  const onEndTimeChange = ({ target }) =>
    onTimeChange(DATETIME_KEY.END, target.value)

  return (
    <Paper className={classnames(classes.content)}>
      <GridContainer
        className={classnames(classes.formContent)}
        alignItems='flex-start'
      >
        <GridItem container xs md={7}>
          <GridItem xs md={12}>
            <Field
              name='patientName'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.appt.form.patientName',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name='contactNo'
              render={(args) => (
                <TextField
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

          <GridItem xs md={5}>
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

          <GridItem xs md={5}>
            <FastField
              name='colorTag'
              render={(args) => (
                <Select
                  {...args}
                  options={colorNameOptions}
                  label={formatMessage({ id: 'reception.appt.form.colorTag' })}
                />
              )}
            />
          </GridItem>
          <GridItem
            xs
            md={2}
            className={classnames(classes.colorChipContainer)}
          >
            <ColorChip value={values.colorTag} />
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
                render={(args) => (
                  <DatePicker
                    {...args}
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
          <GridItem
            container
            xs
            md={12}
            className={classnames(classes.rowContainer)}
          >
            <GridItem xs md={7}>
              <Field
                name='endDate'
                render={(args) => (
                  <DatePicker
                    {...args}
                    oonChange={onEndDateChange}
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
                      defaultValue={values.recurrenceRange}
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
