import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  DatePicker,
} from '@/components'

class Certification extends PureComponent {
  render () {
    return (
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
        <GridItem md={4}>
          <GridContainer>
            <GridItem xs={12}>Signature of Principal Surgeon:</GridItem>
            <GridItem xs={12} style={{ height: 80 }}>
              Show Signature
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem md={4}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='dataContent.doctorName'
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
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='dataContent.doctorMCRNo'
                render={(args) => {
                  return <TextField disabled label='MCR No.' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='dataContent.signatureDate'
                render={(args) => {
                  return (
                    <DatePicker label='Date of Signature' autoFocus {...args} />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer />
        </GridItem>
      </GridContainer>
    )
  }
}
export default Certification
