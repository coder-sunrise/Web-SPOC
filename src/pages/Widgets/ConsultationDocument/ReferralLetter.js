import React, { Component, PureComponent } from 'react'

import Yup from '@/utils/yup'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
  withFormikExtend,
  FastField,
  Field,
  ButtonSelect,
  ClinicianSelect,
} from '@/components'
import { getClinicianProfile } from './utils'

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument, codetable, visitEntity }) => {
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    const values = {
      ...(consultationDocument.entity ||
        consultationDocument.defaultReferralLetter),
      referredByUserFK: clinicianProfile.userProfileFK,
    }

    return values
  },
  validationSchema: Yup.object().shape({
    referralDate: Yup.date().required(),
    referredByUserFK: Yup.number().required(),
    to: Yup.string().required(),
    // address: Yup.string().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence } = props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: nextSequence,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class ReferralLetter extends PureComponent {
  state = {
    editorReferece: {},
  }

  setEditorReference = (ref) => {
    this.setState({ editorReferece: ref })
    // this.editorReferece = ref
  }

  render () {
    const {
      currentType,
      footer,
      handleSubmit,
      classes,
      setFieldValue,
      templateLoader,
      height,
    } = this.props
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

          <GridItem xs={12} className={classes.editor}>
            {templateLoader(
              this.state.editorReferece,
              setFieldValue,
              currentType,
            )}

            <FastField
              name='content'
              render={(args) => {
                const cfg = {}
                if (height && height > 495) {
                  cfg.height = height - 545
                }
                return (
                  <RichEditor
                    editorRef={this.setEditorReference}
                    {...cfg}
                    {...args}
                  />
                )
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
export default ReferralLetter
