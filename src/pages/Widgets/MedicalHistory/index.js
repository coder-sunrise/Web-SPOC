import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
} from '@/components'
import Authorized from '@/utils/Authorized'

const styles = theme => ({})

const { Secured } = Authorized
@Secured('queue.consultation.widgets.medicalhistory')
@connect(({ patient }) => ({
  patient,
}))
class MedicalHistory extends PureComponent {
  componentWillReceiveProps() {}

  render() {
    const accessRight = Authorized.check(
      'patientdatabase.patientprofiledetails.medicalhistory',
    )
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
              render={args => {
                return (
                  <TextField
                    label='Medical History'
                    multiline
                    maxLength={9999999}
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
              render={args => {
                return (
                  <TextField
                    label='Family History'
                    multiline
                    maxLength={9999999}
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
              render={args => {
                return (
                  <TextField
                    label='Social History'
                    multiline
                    maxLength={9999999}
                    disabled={disabledByAccessRight}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(MedicalHistory)
