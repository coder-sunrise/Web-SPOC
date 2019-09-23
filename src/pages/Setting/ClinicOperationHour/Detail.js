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
} from '@/components'

const styles = (theme) => ({})

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
      then: Yup.string().laterThan(
        Yup.ref('monFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    tueFromOpHour: Yup.string().nullable(),
    tueToOpHour: Yup.string().nullable().when('tueFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('tueFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    wedFromOpHour: Yup.string().nullable(),
    wedToOpHour: Yup.string().nullable().when('wedFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('wedFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    thursFromOpHour: Yup.string().nullable(),
    thursToOpHour: Yup.string().nullable().when('thursFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('thursFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    friFromOpHour: Yup.string().nullable(),
    friToOpHour: Yup.string().nullable().when('friFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('friFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    satFromOpHour: Yup.string().nullable(),
    satToOpHour: Yup.string().nullable().when('satFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('satFromOpHour'),
        'TO must be later than FROM',
      ),
    }),

    sunFromOpHour: Yup.string().nullable(),
    sunToOpHour: Yup.string().nullable().when('sunFromOpHour', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: Yup.string().laterThan(
        Yup.ref('sunFromOpHour'),
        'TO must be later than FROM',
      ),
    }),
  }),
  handleSubmit: (values, { props }) => {
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
                    {...args}
                    disabled={settingClinicOperationHour.entity ? true : false}
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
                      format='DD MMM YYYY'
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
