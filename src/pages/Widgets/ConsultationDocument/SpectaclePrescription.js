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
import CommonPrescription from './CommonPrescription'

const SpectaclePrescription = props => {
  const { footer, handleSubmit, mainDivHeight } = props
  const editEnable = ableToViewByAuthority(
    'queue.consultation.widgets.consultationdocument.spectacleprescription',
  )
  return (
    <div>
      <AuthorizedContext.Provider
        value={{
          rights: editEnable ? 'enable' : 'disable',
        }}
      >
        <div
          style={{
            paddingBottom: 8,
            maxHeight: mainDivHeight - 130,
            overflowY: 'auto',
          }}
        >
          <GridContainer>
            <GridItem xs={4}>
              <FastField
                name='patientReferenceNo'
                render={args => {
                  return <TextField label='SPOC ID' disabled {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='patientName'
                render={args => {
                  return <TextField label='Name' disabled {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='dateofPrescription'
                render={args => {
                  return <DatePicker label='Date of Prescription' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
          <div style={{ margin: 8 }}>
            <CommonPrescription />
          </div>
          <GridContainer>
            <GridItem xs={12}>
              <div style={{ fontWeight: 500 }}>Remarks:</div>
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remarks'
                render={args => {
                  return (
                    <MultipleTextField
                      label=''
                      maxLength={2000}
                      autoSize={{ minRows: 4 }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
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
      corVisionRefraction,
      forDispense,
      consultation,
    }) => {
      if (consultationDocument.entity) return consultationDocument.entity
      const {
        entity: { name = '', patientReferenceNo = '', id },
      } = patient
      let formVisionRefraction = corVisionRefraction || {}
      if (forDispense) {
        formVisionRefraction =
          consultation.entity?.latestCORVisionRefraction || {}
      }
      return {
        type: consultationDocument.type,
        patientProfileFK: id,
        patientName: name,
        patientReferenceNo,
        dateofPrescription: moment(),
        issuedByUserFK: user.data.clinicianProfile.userProfileFK,
        issuedByUser: user.data.clinicianProfile.name,
        issuedByUserTitle: user.data.clinicianProfile.title,
        leftSPH: formVisionRefraction.subjectiveRefraction_LE_SPH,
        leftCYL: formVisionRefraction.subjectiveRefraction_LE_CYL,
        leftAXIS: formVisionRefraction.subjectiveRefraction_LE_AXIS,
        leftADD:
          formVisionRefraction.subjectiveRefraction_NearAddition_LE_Value,
        leftVA: `${formVisionRefraction.subjectiveRefraction_LE_VA ||
          ''}/${formVisionRefraction.subjectiveRefraction_LE_VA_Comments ||
          ''}`,
        leftPH: formVisionRefraction.subjectiveRefraction_LE_PH,
        rightSPH: formVisionRefraction.subjectiveRefraction_RE_SPH,
        rightCYL: formVisionRefraction.subjectiveRefraction_RE_CYL,
        rightAXIS: formVisionRefraction.subjectiveRefraction_RE_AXIS,
        rightADD:
          formVisionRefraction.subjectiveRefraction_NearAddition_RE_Value,
        rightVA: `${formVisionRefraction.subjectiveRefraction_RE_VA ||
          ''}/${formVisionRefraction.subjectiveRefraction_RE_VA_Comments ||
          ''}`,
        rightPH: formVisionRefraction.subjectiveRefraction_RE_PH,
      }
    },
    validationSchema: Yup.object().shape({}),
    handleSubmit: (values, { props }) => {
      const { dispatch, onConfirm, getNextSequence } = props
      const nextSequence = getNextSequence()
      dispatch({
        type: 'consultationDocument/upsertRow',
        payload: {
          subject: 'Spectacle Prescription',
          sequence: nextSequence,
          ...values,
        },
      })
      if (onConfirm) onConfirm()
    },
    displayName: 'SpectaclePrescription',
  }),
)(SpectaclePrescription)
