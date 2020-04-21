import React, { Component, PureComponent } from 'react'

import Yup from '@/utils/yup'

import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  RichEditor,
  withFormikExtend,
  FastField,
  ClinicianSelect,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ forms, codetable }) => {
    const values = {
      ...(forms.entity || forms.defaultLCForm),
    }

    return values
  },
  validationSchema: Yup.object().shape({
    referralDate: Yup.date().required(),
    referredByUserFK: Yup.number().required(),
    to: Yup.string().required(),
    subject: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence, user } = props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'forms/upsertRow',
      payload: {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddForm',
})
class LCForm extends PureComponent {
  render () {
    const { footer, handleSubmit } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='referralDate'
              render={(args) => {
                return <DatePicker label='Date' autoFocus {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='to'
              render={(args) => {
                return <TextField label='To' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='referredByUserFK'
              render={(args) => {
                return <ClinicianSelect label='From' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='address'
              render={(args) => {
                return (
                  <TextField label='Address' multiline rowsMax={3} {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
          })}
      </div>
    )
  }
}
export default LCForm
