import React, { Component, PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
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
  ClinicianSelect,
} from '@/components'

@connect(({ patient }) => ({
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return (
      consultationDocument.entity ||
      consultationDocument.defaultVaccinationCertificate
    )
  },
  validationSchema: Yup.object().shape({
    issuedByUserFK: Yup.number().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
    certificateDate: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, consultationDocument } = props
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
class VaccinationCertificate extends PureComponent {
  constructor (props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctgender',
      },
    })
  }

  setEditorReference = (ref) => {
    this.editorReferece = ref
  }

  render () {
    const {
      footer,
      handleSubmit,
      classes,
      patient,
      templateLoader,
      currentType,
      setFieldValue,
      codetable,
    } = this.props

    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='certificateDate'
              render={(args) => {
                return <DatePicker label='Date' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect label='From' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='subject'
              render={(args) => {
                const { form, field } = args
                if (!field.value) {
                  const { entity } = patient
                  const { name, patientAccountNo, genderFK, dob } = entity

                  const { ctgender = [] } = codetable
                  if (ctgender.length > 0) {
                    const gender = ctgender.find((o) => o.id === genderFK) || {}
                    const v = `Vaccination Certificate - ${name}, ${patientAccountNo}, ${gender.code ||
                      ''}, ${Math.floor(
                      moment.duration(moment().diff(dob)).asYears(),
                    )}`
                    form.setFieldValue(field.name, v)
                  }
                }
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            {templateLoader(this.editorReferece, setFieldValue, currentType)}

            <FastField
              name='content'
              render={(args) => {
                return (
                  <RichEditor editorRef={this.setEditorReference} {...args} />
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
export default VaccinationCertificate
