import React, { PureComponent } from 'react'
import { FieldArray, withFormik } from 'formik'
import { connect } from 'dva'
import VisitValidationSchema from './validationScheme'
import model from './models'
import VitalSignCard from './VitalSignCard'
import { withStyles } from '@material-ui/core'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

@connect(({ patientVitalSign }) => ({
  patientVitalSign,
}))
@withFormik({
  displayName: 'patientVitalSign',
  mapPropsToValues: ({ patientVitalSign }) => {
    return patientVitalSign.entity || patientVitalSign.default
  },
  validationSchema: VisitValidationSchema,
  handleSubmit: () => {},
})
class index extends PureComponent {
  componentWillReceiveProps (nextProps) {
    if (
      !this.props.patientVitalSign.shouldAddNew &&
      nextProps.patientVitalSign.shouldAddNew
    ) {
      console.log('shouldAddNew')
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

  handleCalculateBMI = (index) => {
    const { heightCM, weightKG } = this.props.values.patientVitalSign[index]
    const { setFieldValue, setFieldTouched } = this.props
    if (heightCM && weightKG) {
      const heightM = heightCM / 100
      const bmi = weightKG / heightM ** 2
      const bmiInTwoDecimal = Math.round(bmi * 100) / 100
      setFieldValue(`patientVitalSign[${index}].bmi`, bmiInTwoDecimal)
      setFieldTouched(`patientVitalSign[${index}].bmi`, true)
    }
  }

  render () {
    const { theme, values } = this.props
    return (
      <div>
        <FieldArray
          name='patientVitalSign'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            return values.patientVitalSign.map((v, i) => {
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
        >
          {/* <VitalSignCard handleCalculateBMI={this.calculateBMI} /> */}
        </FieldArray>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
