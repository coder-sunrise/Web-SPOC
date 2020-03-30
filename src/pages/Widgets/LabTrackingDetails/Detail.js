import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
  CodeSelect,
} from '@/components'
import DatePicker from '@/components/DatePicker'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ labTrackingDetails }) =>
    labTrackingDetails.entity,
  handleSubmit: (values, { props, resetForm }) => {
    const { ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'labTrackingDetails/upsert',
      payload: {
        ...restValues,
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'labTrackingDetails/query',
        })
      }
    })
  },
  displayName: 'labTrackingDetails',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { theme, footer, labTrackingDetails } = props

    // TODO: Accordion for lab tracking details and Lab Results

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={4}>
              <FastField
                name='patientAccountNo'
                render={(args) => (
                  <TextField
                    label='Patient Acc No.'
                    {...args}
                    disabled
                  />
                )}
              />
            </GridItem>

            <GridItem md={4}>
              <FastField
                name='patientName'
                render={(args) => <TextField label='Patient Name' {...args} disabled />}
              />
            </GridItem>

            <GridItem md={4}>
              <FastField
                name='DoctorProfileFK'
                render={(args) => {
                  // TODO: Change to code table
                  return <TextField label='Doctor' {...args} />
                }}
              />
            </GridItem>

            <GridItem md={4}>
              <FastField
                name='visitDate'
                render={(args) => {
                  return (
                    <DatePicker
                      label='Visit Date'
                      {...args}
                      disabled
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='serviceName'
                render={(args) => (
                  <TextField label='Service Name' {...args} disabled />
                )}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='labTrackingStatusFK'
                render={(args) => (
                  <TextField label='Status' {...args} disabled />
                )}
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
