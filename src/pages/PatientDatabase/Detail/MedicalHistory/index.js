import React, { PureComponent } from 'react'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  FastField,
  OutlinedTextField,
} from '@/components'

class MedicalHistory extends PureComponent {
  render () {
    const accessRight = Authorized.check('patientdatabase.patientprofiledetails.medicalhistory')
    let disabledByAccessRight = true
    if (accessRight) {
      disabledByAccessRight = accessRight.rights === 'disable'
    }
    return (
      <div>
        <GridContainer alignItems='flex-start'>
          <GridItem xs={12} md={12}>
            <FastField
              name='patientMedicalHistory.medicalHistory'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Medical History'
                    multiline
                    rowsMax={5}
                    rows={5}
                    disabled={disabledByAccessRight}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} md={12}>
            <FastField
              name='patientMedicalHistory.familyHistory'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Family History'
                    multiline
                    rowsMax={5}
                    rows={5}
                    disabled={disabledByAccessRight}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} md={12}>
            <FastField
              name='patientMedicalHistory.socialHistory'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Social History'
                    multiline
                    rowsMax={5}
                    rows={5}
                    disabled={disabledByAccessRight}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>)
  }
}

export default MedicalHistory
