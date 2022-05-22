import React, { PureComponent } from 'react'
import { FieldArray, withFormik } from 'formik'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import BasicExaminations from './BasicExaminations'
import { Alert } from 'antd'
import { AuthorizedContext } from '@/components'
import Authorized from '@/utils/Authorized'
import { calculateAgeType } from '@/utils/dateUtils'
import { AGETYPE } from '@/utils/constants'

const styles = theme => ({
  alertStyle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
    paddingTop: 3,
    paddingBottom: 3,
    lineHeight: '25px',
    fontSize: '0.85rem',
  },
})

@connect(({ patientVitalSign, patient, visitRegistration }) => ({
  patientVitalSign,
  patientInfo: patient.entity || {},
  visitRegistration,
}))
class index extends PureComponent {
  handleCalculateBMI = () => {
    const { patientInfo = {}, visitRegistration } = this.props
    const { entity = {} } = visitRegistration
    const { visit = {} } = entity
    const { form } = this.arrayHelpers
    const { heightCM, weightKG } = form.values.corPatientNoteVitalSign[0]
    const { setFieldValue, setFieldTouched } = form
    if (heightCM && weightKG) {
      const getAgeType = calculateAgeType(patientInfo.dob, visit.visitDate)
      if (getAgeType === AGETYPE.ADULT) {
        const heightM = heightCM / 100
        const bmi = weightKG / heightM ** 2
        setFieldValue('corPatientNoteVitalSign[0].bmi', _.round(bmi, 1))
      } else if (getAgeType === AGETYPE.YOUTH) {
        const rohrer = (weightKG / heightCM ** 3) * 10 ** 7
        setFieldValue('corPatientNoteVitalSign[0].rohrer', _.round(rohrer, 1))
      } else if (getAgeType === AGETYPE.CHILD) {
        const kaup = (weightKG / heightCM ** 2) * 10 ** 4
        setFieldValue('corPatientNoteVitalSign[0].kaup', _.round(kaup, 1))
      }
    } else {
      setFieldValue('corPatientNoteVitalSign[0].bmi', undefined)
      setFieldValue('corPatientNoteVitalSign[0].rohrer', undefined)
      setFieldValue('corPatientNoteVitalSign[0].kaup', undefined)
    }
    setFieldTouched(`corPatientNoteVitalSign[0].bmi`, true)
  }

  updateCORVitalSign = vitalSign => {
    const { dispatch } = this.props
    dispatch({
      type: 'orders/updateState',
      payload: {
        corVitalSign: vitalSign,
      },
    })
  }

  getVitalSignAccessRight = () => {
    const { isEnableEditOrder = true } = this.props
    let right = Authorized.check('queue.consultation.widgets.vitalsign') || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  calculateStandardWeight = () => {
    const { patientInfo = {} } = this.props
    const getAgeType = calculateAgeType(patientInfo.dob)
    if (getAgeType !== AGETYPE.ADULT) {
      return
    }
    const { form } = this.arrayHelpers
    const { heightCM } = form.values.corPatientNoteVitalSign[0]
    const { setFieldValue, setFieldTouched } = form
    if (heightCM) {
      const heightM = heightCM / 100
      const standardWeight = heightM ** 2 * 22
      setFieldValue(
        `corPatientNoteVitalSign[0].standardWeight`,
        _.round(standardWeight, 1),
      )
    } else {
      setFieldValue(`corPatientNoteVitalSign[0].standardWeight`, undefined)
    }
  }

  calculateBodyFatMass = () => {
    const { form } = this.arrayHelpers
    const {
      weightKG,
      bodyFatPercentage,
    } = form.values.corPatientNoteVitalSign[0]
    const { setFieldValue, setFieldTouched } = form
    if (weightKG && bodyFatPercentage) {
      const bodyFatMass = weightKG * (bodyFatPercentage / 100)
      setFieldValue(
        `corPatientNoteVitalSign[0].bodyFatMass`,
        _.round(bodyFatMass, 1),
      )
    } else {
      setFieldValue(`corPatientNoteVitalSign[0].bodyFatMass`, undefined)
    }
  }

  render() {
    const { theme, values, classes } = this.props
    return (
      <div>
        <AuthorizedContext.Provider value={this.getVitalSignAccessRight()}>
          <FieldArray
            name='corPatientNoteVitalSign'
            render={arrayHelpers => {
              this.arrayHelpers = arrayHelpers
              return (
                arrayHelpers.form.values.corPatientNoteVitalSign || []
              ).map((v, i) => {
                return (
                  <div key={i}>
                    <BasicExaminations
                      {...this.props}
                      isFromConsultation
                      arrayHelpers={arrayHelpers}
                      handleCalculateBMI={this.handleCalculateBMI}
                      calculateStandardWeight={this.calculateStandardWeight}
                      calculateBodyFatMass={this.calculateBodyFatMass}
                      weightOnChange={() => {
                        this.updateCORVitalSign([
                          ...(this.arrayHelpers.form.values
                            .corPatientNoteVitalSign || []),
                        ])
                      }}
                      fieldName='corPatientNoteVitalSign'
                    />
                  </div>
                )
              })
            }}
          />
        </AuthorizedContext.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
