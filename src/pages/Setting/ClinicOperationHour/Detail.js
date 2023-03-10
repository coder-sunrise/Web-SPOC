import React, { PureComponent } from 'react'
import { FastField } from 'formik'
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
  withFormikExtend,
  dateFormatLong,
} from '@/components'

const styles = (theme) => ({})
const DATEERRORMSG = 'TO must be later than FROM'

@withFormikExtend({
  mapPropsToValues: ({ settingClinicOperationHour }) =>
    settingClinicOperationHour.entity || settingClinicOperationHour.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).required().min(2),
    monFromOpHour: Yup.string().nullable(),
    monToOpHour: Yup.string().nullable().when('monFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('monFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    tueFromOpHour: Yup.string().nullable(),
    tueToOpHour: Yup.string().nullable().when('tueFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('tueFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    wedFromOpHour: Yup.string().nullable(),
    wedToOpHour: Yup.string().nullable().when('wedFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('wedFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    thursFromOpHour: Yup.string().nullable(),
    thursToOpHour: Yup.string().nullable().when('thursFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('thursFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    friFromOpHour: Yup.string().nullable(),
    friToOpHour: Yup.string().nullable().when('friFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('friFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    satFromOpHour: Yup.string().nullable(),
    satToOpHour: Yup.string().nullable().when('satFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('satFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),

    sunFromOpHour: Yup.string().nullable(),
    sunToOpHour: Yup.string().nullable().when('sunFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(Yup.ref('sunFromOpHour'), DATEERRORMSG),
      otherwise: Yup.string().nullable().max('', DATEERRORMSG),
    }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'settingClinicOperationHour/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingClinicOperationHour/query',
        })
      }
    })
  },
  displayName: 'ClinicOperationHourDetail',
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
    const { classes, theme, footer, values, settingClinicOperationHour } = props
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
                    autoFocus
                    {...args}
                    disabled={!!settingClinicOperationHour.entity}
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
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      format={dateFormatLong}
                      label='Effective Start Date'
                      label2='Effective End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6} />
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
                name='monFromOpHour'
                render={(args) => {
                  return <TimePicker label='Monday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='monToOpHour'
                render={(args) => {
                  return <TimePicker label='Monday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tueFromOpHour'
                render={(args) => {
                  return <TimePicker label='Tuesday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='tueToOpHour'
                render={(args) => {
                  return <TimePicker label='Tuesday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedFromOpHour'
                render={(args) => {
                  return <TimePicker label='Wednesday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='wedToOpHour'
                render={(args) => {
                  return <TimePicker label='Wednesday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursFromOpHour'
                render={(args) => {
                  return <TimePicker label='Thursday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='thursToOpHour'
                render={(args) => {
                  return <TimePicker label='Thursday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friFromOpHour'
                render={(args) => {
                  return <TimePicker label='Friday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='friToOpHour'
                render={(args) => {
                  return <TimePicker label='Friday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satFromOpHour'
                render={(args) => {
                  return <TimePicker label='Saturday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='satToOpHour'
                render={(args) => {
                  return <TimePicker label='Saturday To' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunFromOpHour'
                render={(args) => {
                  return <TimePicker label='Sunday From' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sunToOpHour'
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
