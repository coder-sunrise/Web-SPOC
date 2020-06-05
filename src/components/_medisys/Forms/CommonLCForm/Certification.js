import React, { PureComponent, useState } from 'react'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  DatePicker,
  CommonModal,
} from '@/components'
import Signature from '../Signature'
import { FORM_CATEGORY } from '@/utils/constants'

const base64Prefix = 'data:image/jpeg;base64,'

const Certification = ({ values, setFieldValue, formCategory }) => {
  const [
    showSignature,
    setShowSignature,
  ] = useState(false)

  const updateSignature = (signature) => {
    const { thumbnail } = signature
    setFieldValue('formData.signatureThumbnail', thumbnail)
  }

  let src
  if (
    values.formData.signatureThumbnail &&
    values.formData.signatureThumbnail !== ''
  ) {
    src = `${base64Prefix}${values.formData.signatureThumbnail}`
  }

  let borderColor = '1px solid #CCCCCC'
  let showMessage = false
  if (
    (!formCategory || formCategory === FORM_CATEGORY.CORFORM) &&
    !values.formData.signatureThumbnail
  ) {
    borderColor = '1px solid red'
    showMessage = true
  }
  return (
    <div>
      <GridContainer>
        <GridItem>
          <span
            style={{ display: 'flex', fontSize: '0.75rem', fontWeight: 500 }}
          >
            I certify and declare that:
          </span>
        </GridItem>
        <GridItem>
          <div style={{ display: 'flex', fontSize: '0.75rem', marginLeft: 10 }}>
            <span>1. </span>
            <span>
              I am the principal surgeon who performed the surgeries listed
              above. Procedures performed by other principal surgeons are not
              included in this Letter of Certification (LC).
            </span>
          </div>
        </GridItem>
        <GridItem>
          <div style={{ display: 'flex', fontSize: '0.75rem', marginLeft: 10 }}>
            <span>2. </span>
            <span>
              Taking into consideration the patient's safety and medical
              condition, it was reasonable and appropriate for the patient to be
              treated as an inpatient, to receive the surgeries and treatments
              provided, and for all the equipment, consumables, etc used in the
              surgery to be used.
            </span>
          </div>
        </GridItem>
        <GridItem>
          <div style={{ display: 'flex', fontSize: '0.75rem', marginLeft: 10 }}>
            <span>3. </span>
            <span>
              I am responsible for the accuracy of all information provided in
              this LC (including any Annexes), and it was completed in
              accordance with prevailing guidelines and rules on MediSave and
              MediShield Life claims. Inaccurate information submitted or
              breaches of guidelines/rules may result in regulatory/legal
              action, including the imposition of financial penalties and the
              suspension or revocation of my approval under the MediSave and
              MediShield Life schemes.
            </span>
          </div>
        </GridItem>
        <GridItem>
          <div style={{ display: 'flex', fontSize: '0.75rem', marginLeft: 10 }}>
            <span>4. </span>
            <span>
              I agree to the medical institution set out above making MediSave
              and MediShield Life claims for the patient, in respect of the
              surgeries and other items listed in this LC. I further acknowledge
              and agree that I am responsible for all such claims which may be
              made by the medical institution based on the information that I
              have provided in this LC.
            </span>
          </div>
        </GridItem>
        <GridItem md={12}>
          <GridContainer>
            <GridItem xs={12}>
              <span>Signature of Principal Surgeon:</span>
            </GridItem>
            <div style={{ display: 'flex' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: borderColor,
                    width: 240,
                    height: 132,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setShowSignature(true)
                  }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={values.formData.principalSurgeonName}
                      width={238}
                      height={130}
                    />
                  ) : (
                    <span>No Signature</span>
                  )}
                </div>

                {showMessage && (
                  <span style={{ color: 'red' }}>Signature is required</span>
                )}
              </div>

              <div style={{ marginLeft: 10, width: 250 }}>
                <FastField
                  name='formData.principalSurgeonName'
                  render={(args) => {
                    return (
                      <TextField
                        disabled
                        label='Name of Principal Surgeon'
                        {...args}
                      />
                    )
                  }}
                />
                <FastField
                  name='formData.principalSurgeonMCRNo'
                  render={(args) => {
                    return <TextField disabled label='MCR No.' {...args} />
                  }}
                />
                <FastField
                  name='formData.principalSurgeonSignatureDate'
                  render={(args) => {
                    return <DatePicker label='Date of Signature' {...args} />
                  }}
                />
              </div>
            </div>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <CommonModal
        open={showSignature}
        title='Signature'
        observe='Signature'
        onClose={() => {
          setShowSignature(false)
        }}
      >
        <Signature
          signatureName={values.formData.principalSurgeonName}
          updateSignature={updateSignature}
          image={src}
        />
      </CommonModal>
    </div>
  )
}
export default Certification
