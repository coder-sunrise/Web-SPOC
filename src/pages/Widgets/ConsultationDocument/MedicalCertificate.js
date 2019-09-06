import React, { Component, PureComponent } from 'react'
import moment from 'moment'
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
  DateRangePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  NumberInput,
  RichEditor,
  dateFormatLong,
  withFormikExtend,
  FastField,
  Field,
  ClinicianSelect,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return (
      consultationDocument.entity ||
      consultationDocument.defaultMedicalCertificate
    )
  },
  validationSchema: Yup.object().shape({
    mcIssueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    mcDays: Yup.number().required(),
    mcStartEndDate: Yup.array().of(Yup.date()).min(2).required(),
    unfitTypeFK: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, consultationDocument, currentType } = props
    const { mcStartEndDate } = values
    const { rows } = consultationDocument
    const data = {
      sequence: rows.length,
      ...values,
      mcStartDate: mcStartEndDate[0],
      mcEndDate: mcStartEndDate[1],
    }
    data.subject = currentType.getSubject(data)
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class MedicalCertificate extends PureComponent {
  onDaysChange = (e) => {
    const { values, setFieldValue } = this.props
    if (e.target.value) {
      const startDate = moment(values.mcStartEndDate[0])
      setFieldValue('mcStartEndDate', [
        startDate,
        startDate.clone().add(e.target.value, 'days'),
      ])
    }
  }

  render () {
    const { footer, handleSubmit, classes, values } = this.props
    return (
      <div>
        {values.mcReferenceNo && (
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='mcReferenceNo'
                render={(args) => {
                  return <TextField disabled label='Reference No' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
        )}
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='mcIssueDate'
              render={(args) => {
                return <DatePicker label='Issue Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect label='Issue By' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='mcDays'
              render={(args) => {
                return (
                  <NumberInput
                    step={0.5}
                    min={1}
                    label='Day(s)'
                    onChange={this.onDaysChange}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='mcStartEndDate'
              render={(args) => {
                return <DateRangePicker label='From' label2='To' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='unfitTypeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    code='ctUnfitType'
                    label='Description'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <FastField
              name='remarks'
              render={(args) => {
                return <RichEditor placeholder='Remarks' {...args} />
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
export default MedicalCertificate
