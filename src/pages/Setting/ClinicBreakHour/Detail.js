import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
// import Edit from '@material-ui/icons/Edit'
// import Delete from '@material-ui/icons/Delete'
import {
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  TimePicker,
  notification,
  Select,
} from '@/components'

const styles = (theme) => ({})

const clinics = [
    { value: 'angmokioave1', name: 'Ang Mo Kio Ave 1' },
    { value: 'bedokave3', name: 'Bedok Ave 3' },
  ]

@withFormik({
  mapPropsToValues: ({ settingClinicBreakHour }) =>
  settingClinicBreakHour.entity || settingClinicBreakHour.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    clinicName: Yup.string().required(),
    monFromTiming: Yup.string().required(),
    monToTiming: Yup.string().required(),
    tuesFromTiming: Yup.string().required(),
    tuesToTiming: Yup.string().required(),
    wedFromTiming: Yup.string().required(),
    wedToTiming: Yup.string().required(),
    thursFromTiming: Yup.string().required(),
    thursToTiming: Yup.string().required(),
    friFromTiming: Yup.string().required(),
    friToTiming: Yup.string().required(),
    satFromTiming: Yup.string().required(),
    satToTiming: Yup.string().required(),
    sunFromTiming: Yup.string().required(),
    sunToTiming: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'settingClinicBreakHour/upsert',
        payload: values,
      })
      .then((r) => {
        if (r && r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'ClinicBreakHourModal',
})
class Detail extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.props
    setFieldValue('items', rows)
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values } = props
    console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => <TextField label='Code' {...args} />}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='Effective End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs md={12}>
            <FastField
              name='clinicName'
              render={(args) => (
                <Select {...args} allowClear label='Clinic' options={clinics} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
              <FastField
                name='monFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Monday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='monToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Monday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tuesFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Tuesday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tuesToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Tuesday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Wednesday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Wednesday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Thursday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Thursday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Friday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Friday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Saturday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Saturday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunFromTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Sunday From'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunToTiming'
                render={(args) => {
                  return (
                    <TimePicker
                      label='Sunday To'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
