import React from 'react'
import { FastField, withFormik, Field } from 'formik'
import { compose } from 'redux'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  MultipleTextField,
} from '@/components'
import { ableToViewByAuthority } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'

const MedicalReport = props => {
  const { footer, handleSubmit } = props
  const editEnable = ableToViewByAuthority(
    'queue.consultation.widgets.consultationdocument.medicalreport',
  )
  return (
    <div>
      <AuthorizedContext.Provider
        value={{
          rights: editEnable ? 'enable' : 'disable',
        }}
      >
        <div style={{ paddingBottom: 8 }}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='patientName'
                render={args => {
                  return <TextField label='Name' disabled {...args} />
                }}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='subject'
                render={args => {
                  return <TextField label='Subject' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='generateDate'
                render={args => {
                  return <DatePicker label='Date' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>

          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Case History</div>
            <FastField
              name='caseHistory'
              render={args => {
                return (
                  <MultipleTextField
                    label=''
                    maxLength={2000}
                    autoSize={{ minRows: 3 }}
                    {...args}
                  />
                )
              }}
            />
          </div>

          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Subjective Refraction</div>
            <div style={{ lineHeight: '16px' }}>Left Eye (LE)</div>
            <GridContainer>
              <GridItem xs={2}>
                <FastField
                  name='leftSPH'
                  render={args => {
                    return <TextField maxLength={500} label='SPH' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='leftCYL'
                  render={args => {
                    return <TextField maxLength={500} label='CYL' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='leftAXIS'
                  render={args => {
                    return <TextField maxLength={500} label='AXIS' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='leftVA'
                  render={args => {
                    return <TextField maxLength={500} label='VA' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='leftADD'
                  render={args => {
                    return <TextField maxLength={500} label='ADD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='leftNVA'
                  render={args => {
                    return <TextField maxLength={500} label='NVA' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
            <div style={{ marginTop: 8, lineHeight: '16px' }}>
              Right Eye (RE)
            </div>
            <GridContainer>
              <GridItem xs={2}>
                <FastField
                  name='rightSPH'
                  render={args => {
                    return <TextField maxLength={500} label='SPH' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='rightCYL'
                  render={args => {
                    return <TextField maxLength={500} label='CYL' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='rightAXIS'
                  render={args => {
                    return <TextField maxLength={500} label='AXIS' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='rightVA'
                  render={args => {
                    return <TextField maxLength={500} label='VA' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='rightADD'
                  render={args => {
                    return <TextField maxLength={500} label='ADD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='rightNVA'
                  render={args => {
                    return <TextField maxLength={500} label='NVA' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>

          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Clinical Finding(s)</div>
            <FastField
              name='clinicalFindings'
              render={args => {
                return (
                  <MultipleTextField
                    label=''
                    maxLength={2000}
                    autoSize={{ minRows: 3 }}
                    {...args}
                  />
                )
              }}
            />
          </div>

          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Management Plan</div>
            <FastField
              name='managementPlan'
              render={args => {
                return (
                  <MultipleTextField
                    label=''
                    maxLength={2000}
                    autoSize={{ minRows: 3 }}
                    {...args}
                  />
                )
              }}
            />
          </div>
        </div>
      </AuthorizedContext.Provider>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: !editEnable,
          },
        })}
    </div>
  )
}
export default compose(
  withFormik({
    mapPropsToValues: ({
      consultationDocument,
      patient,
      user,
      corVisionRefraction = {},
      forDispense,
      consultation,
    }) => {
      if (consultationDocument.entity) return consultationDocument.entity
      const {
        entity: { name = '' },
      } = patient
      const formVisionRefraction =
        (forDispense
          ? consultation.entity?.latestCORVisionRefraction
          : corVisionRefraction) || {}
      return {
        type: consultationDocument.type,
        patientName: name,
        subject:
          'Report on Eye Examination at Singapore Polytechnic Optometry Centre',
        generateDate: moment(),
        issuedByUserFK: user.data.clinicianProfile.userProfileFK,
        issuedByUser: user.data.clinicianProfile.name,
        issuedByUserTitle: user.data.clinicianProfile.title,
        leftSPH: formVisionRefraction.subjectiveRefraction_LE_SPH,
        leftCYL: formVisionRefraction.subjectiveRefraction_LE_CYL,
        leftAXIS: formVisionRefraction.subjectiveRefraction_LE_AXIS,
        leftVA: `${formVisionRefraction.subjectiveRefraction_LE_VA ||
          ''}/${formVisionRefraction.subjectiveRefraction_LE_VA_Comments ||
          ''}`,
        leftADD:
          formVisionRefraction.subjectiveRefraction_NearAddition_LE_Value, //ADD
        leftNVA: formVisionRefraction.subjectiveRefraction_NearAddition_LE_NVA, //NVA
        rightSPH: formVisionRefraction.subjectiveRefraction_RE_SPH,
        rightCYL: formVisionRefraction.subjectiveRefraction_RE_CYL,
        rightAXIS: formVisionRefraction.subjectiveRefraction_RE_AXIS,
        rightVA: `${formVisionRefraction.subjectiveRefraction_RE_VA ||
          ''}/${formVisionRefraction.subjectiveRefraction_RE_VA_Comments ||
          ''}`,
        rightADD:
          formVisionRefraction.subjectiveRefraction_NearAddition_RE_Value, //ADD
        rightNVA: formVisionRefraction.subjectiveRefraction_NearAddition_RE_NVA, //NVA
      }
    },
    validationSchema: Yup.object().shape({}),
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
    displayName: 'MedicalReport',
  }),
)(MedicalReport)
