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

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return (
      consultationDocument.entity || consultationDocument.defaultReferralLetter
    )
  },
  validationSchema: Yup.object().shape({
    referralDate: Yup.date().required(),
    referredByUserFK: Yup.number().required(),
    to: Yup.string().required(),
    address: Yup.string().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, consultationDocument, currentType } = props
    const { rows } = consultationDocument

    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: rows.length,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class ReferralLetter extends PureComponent {
  render () {
    const {
      footer,
      handleSubmit,
      classes,
      codetable,
      rowHeight,
      setFieldValue,
    } = this.props
    const { ctReferralLetterTemplate } = codetable
    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='referralDate'
              render={(args) => {
                return <DatePicker label='Date' {...args} />
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
            <Field
              name='referredByUserFK'
              render={(args) => {
                return <ClinicianSelect label='From' {...args} />
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
          <GridItem xs={9}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>
          <GridItem
            xs={3}
            style={{ lineHeight: rowHeight, textAlign: 'right' }}
          >
            <ButtonSelect
              options={ctReferralLetterTemplate}
              textField='displayValue'
              onClick={(option) => {
                setFieldValue('content', option.templateMessage)
              }}
            >
              Load Template
            </ButtonSelect>
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button> 
            <FastField
              name='content'
              render={(args) => {
                return <RichEditor {...args} />
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
