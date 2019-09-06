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

@withFormik({
  mapPropsToValues: ({ settingClinicBreakHour }) =>
    settingClinicBreakHour.entity || settingClinicBreakHour.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).required().min(2),
    monFromBreak: Yup.string().required(),
    monToBreak: Yup.string()
      .laterThan(Yup.ref('monFromBreak'), 'TO must be later than FROM')
      .required(),
    tueFromBreak: Yup.string().required(),
    tueToBreak: Yup.string()
      .laterThan(Yup.ref('tueFromBreak'), 'TO must be later than FROM')
      .required(),
    wedFromBreak: Yup.string().required(),
    wedToBreak: Yup.string()
      .laterThan(Yup.ref('wedFromBreak'), 'TO must be later than FROM')
      .required(),
    thursFromBreak: Yup.string().required(),
    thursToBreak: Yup.string()
      .laterThan(Yup.ref('thursFromBreak'), 'TO must be later than FROM')
      .required(),
    friFromBreak: Yup.string().required(),
    friToBreak: Yup.string()
      .laterThan(Yup.ref('friFromBreak'), 'TO must be later than FROM')
      .required(),
    satFromBreak: Yup.string().required(),
    satToBreak: Yup.string()
      .laterThan(Yup.ref('satFromBreak'), 'TO must be later than FROM')
      .required(),
    sunFromBreak: Yup.string().required(),
    sunToBreak: Yup.string()
      .laterThan(Yup.ref('sunFromBreak'), 'TO must be later than FROM')
      .required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'settingClinicBreakHour/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingClinicBreakHour/query',
        })
      }
    })
  },
  displayName: 'ClinicBreakHourModal',
})
class Detail extends PureComponent {
  state = {}

  // state = {
  //   editingRowIds: [],
  //   rowChanges: {},
  // }

  // changeEditingRowIds = (editingRowIds) => {
  //   this.setState({ editingRowIds })
  // }

  // changeRowChanges = (rowChanges) => {
  //   this.setState({ rowChanges })
  // }

  // commitChanges = ({ rows, added, changed, deleted }) => {
  //   const { setFieldValue } = this.props
  //   setFieldValue('items', rows)
  // }

  render () {
    const { props } = this
    const { classes, theme, footer, values, settingClinicBreakHour } = props
    // console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    {...args}
                    disabled={settingClinicBreakHour.entity ? true : false}
                  />
                )}
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
            {/* <GridItem xs md={12}>
              <FastField
                name='clinicName'
                render={(args) => (
                  <Select
                    {...args}
                    allowClear
                    label='Clinic'
                    options={clinics}
                  />
                )}
              />
            </GridItem> */}
            <GridItem md={6}>
              <FastField
                name='monFromBreak'
                render={(args) => {
                  return <TimePicker label='Monday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='monToBreak'
                render={(args) => {
                  return <TimePicker label='Monday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tueFromBreak'
                render={(args) => {
                  return <TimePicker label='Tuesday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tueToBreak'
                render={(args) => {
                  return <TimePicker label='Tuesday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedFromBreak'
                render={(args) => {
                  return <TimePicker label='Wednesday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedToBreak'
                render={(args) => {
                  return <TimePicker label='Wednesday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursFromBreak'
                render={(args) => {
                  return <TimePicker label='Thursday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursToBreak'
                render={(args) => {
                  return <TimePicker label='Thursday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friFromBreak'
                render={(args) => {
                  return <TimePicker label='Friday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friToBreak'
                render={(args) => {
                  return <TimePicker label='Friday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satFromBreak'
                render={(args) => {
                  return <TimePicker label='Saturday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satToBreak'
                render={(args) => {
                  return <TimePicker label='Saturday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunFromBreak'
                render={(args) => {
                  return <TimePicker label='Sunday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunToBreak'
                render={(args) => {
                  return <TimePicker label='Sunday To' {...args} />
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
