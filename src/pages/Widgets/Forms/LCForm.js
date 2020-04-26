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
  Button,
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
  displayName: 'AddForm',
})
class LCForm extends PureComponent {
  saveLCForm = () => {
    const { dispatch, onConfirm, getNextSequence, user, values } = this.props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'forms/upsertRow',
      payload: {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
        statusFK: 2,
      },
    }).then(() => {
      if (onConfirm) onConfirm()
    })
  }

  confirmLCForm = () => {
    const { dispatch, onConfirm, getNextSequence, user, values } = this.props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'forms/upsertRow',
      payload: {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
        statusFK: 3,
      },
    }).then(() => {
      if (onConfirm) onConfirm()
    })
  }

  cancelLCForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const { values } = this.props
    const { statusFK } = values
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
        <GridContainer
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button color='danger' icon={null} onClick={this.cancelLCForm}>
            cancel
          </Button>
          {statusFK === 1 && (
            <Button color='primary' icon={null} onClick={this.saveLCForm}>
              finalize
            </Button>
          )}

          {(statusFK === 1 || statusFK === 2) && (
            <Button color='success' icon={null} onClick={this.confirmLCForm}>
              submit
            </Button>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default LCForm
