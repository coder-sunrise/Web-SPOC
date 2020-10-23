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

  return (
    <div>
      <GridContainer>
        <GridItem md={12}>
          <span
            style={{ display: 'flex', fontSize: '0.75rem', fontWeight: 500 }}
          >
            I certify and declare that:
          </span>
        </GridItem>
        <GridItem md={12}>
          <ol
            style={{ fontSize: '0.75rem', marginLeft: -10, marginBottom: -10 }}
          >
            <li>
              I am the principal surgeon who performed the surgeries listed
              above. Procedures performed by other principal surgeons are not
              included in this Letter of Certification (LC).
            </li>
            <li>
              Taking into consideration the patient's safety and medical
              condition, it was reasonable and appropriate for the patient to be
              treated as an inpatient, to receive the surgeries and treatments
              provided, and for all the equipment, consumables, etc used in the
              surgery to be used.
            </li>
            <li>
              I am responsible for the accuracy of all information provided in
              this LC (including any Annexes), and it was completed in
              accordance with prevailing guidelines and rules on MediSave and
              MediShield Life claims. Inaccurate information submitted or
              breaches of guidelines/rules may result in regulatory/legal
              action, including the imposition of financial penalties and the
              suspension or revocation of my approval under the MediSave and
              MediShield Life schemes.
            </li>
            <li>
              I agree to the medical institution set out above making MediSave
              and MediShield Life claims for the patient, in respect of the
              surgeries and other items listed in this LC. I further acknowledge
              and agree that I am responsible for all such claims which may be
              made by the medical institution based on the information that I
              have provided in this LC.
            </li>
          </ol>
        </GridItem>
        <GridItem md={12}>
          <GridContainer>
            <GridItem xs={12}>
              <div style={{ marginTop: 10 }}>
                <span>Signature of Principal Surgeon:</span>
              </div>
            </GridItem>
            <div style={{ display: 'flex' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #CCCCCC',
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
