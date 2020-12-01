import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { FieldArray } from 'formik'
import { getUniqueGUID } from 'utils'
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import {
  AuthorizedContext,
  Button,
  GridContainer,
  GridItem,
  FastField,
  TextField,
} from '@/components'
import Authorized from '@/utils/Authorized'
import withFormikExtend from '@/components/Decorator/withFormikExtend'

const styles = (theme) => ({
})

const { Secured } = Authorized
@Secured('queue.consultation.widgets.medicalhistory')
@connect(({ patient, components, codetable }) => ({
  codetable,
  patient,
}))

class MedicalHistory extends PureComponent {
  componentDidMount () {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'codetable/fetchCodes',
    //   payload: {
    //     code: 'ctComplication',
    //   },
    // })
  }

  componentWillReceiveProps () {
  }

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
                  <TextField
                    label='Medical History'
                    multiline
                    maxLength={4000}
                    rowsMax={5}
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
                  <TextField
                    label='Family History'
                    multiline
                    maxLength={4000}
                    rowsMax={5}
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
                  <TextField
                    label='Social History'
                    multiline
                    maxLength={4000}
                    rowsMax={5}
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
