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
import { getClinicianProfile } from './utils'

@connect(({ patient }) => ({
  patient,
}))
@withFormikExtend({
  mapPropsToValues: ({ consultationDocument, codetable, visitEntity }) => {
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    return {
      ...(consultationDocument.entity ||
        consultationDocument.defaultVaccinationCertificate),
      issuedByUserFK: clinicianProfile.userProfileFK,
    }
  },
  validationSchema: Yup.object().shape({
    issuedByUserFK: Yup.number().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
    certificateDate: Yup.string().required(),
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

  state = {
    editorReferece: {},
  }

  setEditorReference = (ref) => {
    this.setState({ editorReferece: ref })
    // this.editorReferece = ref
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
      height,
    } = this.props

    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='certificateDate'
              render={(args) => {
                return <DatePicker label='Date' autoFocus {...args} />
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
            {templateLoader(
              this.state.editorReferece,
              setFieldValue,
              currentType,
            )}

            <FastField
              name='content'
              render={(args) => {
                const cfg = {}
                if (height && height > 450) {
                  cfg.height = height - 400
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
export default VaccinationCertificate
