import React, { Fragment } from 'react'
// yup
import * as Yup from 'yup'
// formik
import { FastField } from 'formik'
// react-color
import { ChromePicker } from 'react-color'
// common components
import {
  DateRangePicker,
  GridContainer,
  GridItem,
  TextField,
  withFormikExtend,
} from '@/components'

const Form = ({ classes, footer, setFieldValue, handleSubmit, values }) => {
  const onColorChange = (color) => {
    if (color) setFieldValue('tagColorHex', color.hex)
  }
  const isEdit = values.id !== undefined
  return (
    <Fragment>
      <GridContainer alignItems='flex-start'>
        <GridItem container md={6}>
          <GridItem md={12}>
            <FastField
              name='code'
              render={(args) => (
                <TextField {...args} disabled={isEdit} autoFocus label='Code' />
              )}
            />
          </GridItem>

          <GridItem md={12}>
            <FastField
              name='displayValue'
              render={(args) => <TextField {...args} label='Display Value' />}
            />
          </GridItem>

          <GridItem md={12}>
            <FastField
              name='description'
              render={(args) => <TextField {...args} label='Description' />}
            />
          </GridItem>
        </GridItem>
        <GridItem container md={6} justify='center'>
          <GridItem md={12}>
            <FastField
              name='effectiveDates'
              render={(args) => (
                <DateRangePicker
                  {...args}
                  label='Effective Start Date'
                  label2='Effective End Date'
                />
              )}
            />
          </GridItem>
          <GridItem md={12} className={classes.colorPicker}>
            <span className={classes.label}>Appointment Type Color</span>
            <ChromePicker
              color={values.tagColorHex}
              onChangeComplete={onColorChange}
            />
          </GridItem>
        </GridItem>
      </GridContainer>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </Fragment>
  )
}

export default withFormikExtend({
  displayName: 'AppointmentTypeSettingForm',
  notDirtyDuration: 0.5,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date().required()).min(2).required(),
  }),
  mapPropsToValues: ({ settingAppointmentType }) =>
    settingAppointmentType.entity || settingAppointmentType.default,
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingAppointmentType/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((response) => {
      if (response) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingAppointmentType/query',
        })
        // dispatch({
        //   type: 'settingAppointmentType/updateState',
        //   payload: { entity: null },
        // })
      }
    })
  },
})(Form)
