import React, { Fragment, useEffect } from 'react'
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
  Tooltip,
  Switch,
} from '@/components'

import { TagTwoTone } from '@ant-design/icons'
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const AppointmentStageColors = {
  Draft: '#E36C0A',
  Confirmed: '#548DD4',
  Registered: '#47CFFF',
  Consultation: '#FF5353',
  Billing: '#97E551',
  Completed: '#00B853',
}

const AppointmentSlotPreview = ({color}) =>{
  return (
    <div>
      {Object.entries(AppointmentStageColors).map(x=> {
      return (
        <div style={{background:color,marginBottom:6,paddingTop:2}}>
          <span style={{color:'white',fontSize:'80%',marginLeft:5,display:'inline-block'}}>
            <div style={{fontWeight:'bold'}}>09:00AM - 10:00AM</div>
            <div style={{lineHeight:'1em'}}>Jenny Moon</div>
          </span>
          <span style={{float:'right',marginTop:6,marginRight:6}}>
            <Tooltip title={x[0]}>
                <LocalOfferIcon
                  style={{ color: x[1], float: 'right'}}
                />
              </Tooltip>
          </span>
        </div>
      )
    })}
    </div>
  )
}

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

          <GridItem md={6}>
            <FastField
              name='sortOrder'
              render={(args) => <TextField {...args} label='Sort Order' />}
            />
          </GridItem>

          <GridItem md={6}>
            <FastField
              name='isDefault'
              render={args => {
                return <Switch label='Set Appointment Type as default' {...args}/>
              }}
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
          <GridItem md={6} className={classes.colorPicker}>
            <span className={classes.label}>Appointment Type Color</span>
            <ChromePicker
              color={values.tagColorHex}
              onChangeComplete={onColorChange}
            />
          </GridItem>
          <GridItem md={6} className={classes.colorPicker}>
            <span className={classes.label}>Appointment Slot Preview</span>
            <AppointmentSlotPreview
              color={values.tagColorHex}
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
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date().required()).min(2).required(),
    sortOrder: Yup.number().required(),
  }),
  mapPropsToValues: ({ settingAppointmentType }) =>
    ({...settingAppointmentType.entity || settingAppointmentType.default, list: settingAppointmentType.list}),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    const saveData = () => {
      dispatch({
        type: 'settingAppointmentType/upsert',
        payload: {
          ...{ ...restValues, list: null },
          effectiveStartDate: effectiveDates[0],
          effectiveEndDate: effectiveDates[1],
        },
      }).then(response => {
        if (response) {
          resetForm()
          if (onConfirm) onConfirm()
          dispatch({
            type: 'settingAppointmentType/query',
            payload:{
              sorting: [
                { columnName: 'isDefault', direction: 'desc' },
                { columnName: 'displayValue', direction: 'asc' },
              ],
            }
          })
        }
      })
    }
    const defaultAppt =　restValues.isDefault && restValues.list.find(x => x.isDefault && x.id !== restValues.id)
    if (defaultAppt) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent:
            `${defaultAppt.displayValue.length > 20 ? `${defaultAppt.displayValue.substr(0,20)}...` : defaultAppt.displayValue} is currently set as the default appointment type. Confirm to overwrite?`,
          onConfirmSave: saveData,
        },
      })
    } else {
      saveData()
    }
  },
})(Form)
