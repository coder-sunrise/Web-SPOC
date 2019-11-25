import React, { PureComponent } from 'react'
import { FieldArray, withFormik } from 'formik'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import VisitValidationSchema from './validationScheme'
import model from './models'
import VitalSignCard from './VitalSignCard'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

@connect(({ patientVitalSign }) => ({
  patientVitalSign,
}))
class index extends PureComponent {
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (
      !this.props.patientVitalSign.shouldAddNew &&
      nextProps.patientVitalSign.shouldAddNew
    ) {
      this.addPatientVitalSign()
      this.props.dispatch({
        type: 'patientVitalSign/updateState',
        payload: {
          shouldAddNew: false,
        },
      })
    }
  }

  addPatientVitalSign = () => {
    this.arrayHelpers.push({
      temperatureC: undefined,
      bpSysMMHG: undefined,
      bpDiaMMHG: undefined,
      pulseRateBPM: undefined,
      weightKG: undefined,
      heightCM: undefined,
      bmi: undefined,
    })
  }

  handleCalculateBMI = (i) => () => {
    const { form } = this.arrayHelpers
    const { heightCM, weightKG } = form.values.corPatientNoteVitalSign[i]
    const { setFieldValue, setFieldTouched } = form
    // console.log(heightCM, weightKG, form.values.corPatientNoteVitalSign[i])
    if (heightCM && weightKG) {
      const heightM = heightCM / 100
      const bmi = weightKG / heightM ** 2
      const bmiInTwoDecimal = Math.round(bmi * 100) / 100
      setFieldValue(`corPatientNoteVitalSign[${i}].bmi`, bmiInTwoDecimal)
      setFieldTouched(`corPatientNoteVitalSign[${i}].bmi`, true)
    }
  }

  render () {
    const { theme, values } = this.props
    return (
      <div>
        <FieldArray
          name='corPatientNoteVitalSign'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            return (arrayHelpers.form.values.corPatientNoteVitalSign || [])
              .map((v, i) => {
                if (v.isDeleted === true) return null
                return (
                  <div key={i}>
                    <VitalSignCard
                      {...this.props}
                      index={i}
                      arrayHelpers={arrayHelpers}
                      handleCalculateBMI={this.handleCalculateBMI}
                    />
                  </div>
                )
              })
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
