import React from 'react'
import { FastField, withFormik, Field } from 'formik'
import { compose } from 'redux'
import moment from 'moment'
import Yup from '@/utils/yup'
import { GridContainer, GridItem, TextField, DatePicker } from '@/components'

const SpectaclePrescription = props => {
  const { footer, handleSubmit } = props
  return (
    <div>
      <div style={{ paddingBottom: 8 }}>
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
              name='dateOfPrescription'
              render={args => {
                return <DatePicker label='Date of Prescription' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
          <div style={{ fontWeight: 'bold' }}>Prescription</div>
          <div style={{ lineHeight: '16px' }}>Left Eye (LE)</div>
          <GridContainer>
            <GridItem xs={2}>
              <FastField
                name='leftSPH'
                render={args => {
                  return <TextField label='SPH' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='leftCYL'
                render={args => {
                  return <TextField label='CYL' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='leftAXIS'
                render={args => {
                  return <TextField label='AXIS' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='leftADD'
                render={args => {
                  return <TextField label='ADD' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='leftVA'
                render={args => {
                  return <TextField label='VA' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='leftPH'
                render={args => {
                  return <TextField label='PH' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
          <div style={{ marginTop: 8, lineHeight: '16px' }}>Right Eye (RE)</div>
          <GridContainer>
            <GridItem xs={2}>
              <FastField
                name='rightSPH'
                render={args => {
                  return <TextField label='SPH' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='rightCYL'
                render={args => {
                  return <TextField label='CYL' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='rightAXIS'
                render={args => {
                  return <TextField label='AXIS' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='rightADD'
                render={args => {
                  return <TextField label='ADD' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='rightVA'
                render={args => {
                  return <TextField label='VA' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2}>
              <FastField
                name='rightPH'
                render={args => {
                  return <TextField label='PH' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='remarks'
              render={args => {
                return <TextField label='Remarks' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
        })}
    </div>
  )
}
export default compose(
  withFormik({
    mapPropsToValues: ({ consultationDocument, patient, user }) => {
      if (consultationDocument.entity) return consultationDocument.entity
      const {
        entity: { name = '', patientReferenceNo = '' },
      } = patient
      return {
        type: consultationDocument.type,
        patientName: name,
        patientReferenceNo,
        dateOfPrescription: moment(),
        issuedByUserFK: user.data.clinicianProfile.userProfileFK,
        issuedByUser: user.data.clinicianProfile.name,
        issuedByUserTitle: user.data.clinicianProfile.title,
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
