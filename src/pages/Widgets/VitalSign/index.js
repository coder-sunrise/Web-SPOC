import React, { PureComponent } from 'react'
import { FieldArray, withFormik } from 'formik'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
// import model from './models'
import BasicExaminations from './BasicExaminations'
import { Alert } from 'antd'
import { AuthorizedContext } from '@/components'
import Authorized from '@/utils/Authorized'
// window.g_app.replaceModel(model)

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

@connect(({ patientVitalSign, patient }) => ({
  patientVitalSign,
  patientInfo: patient.entity || {},
}))
class index extends PureComponent {
  state = {
    showWarningMessage: false,
  }

  handleCalculateBMI = () => {
    const { form } = this.arrayHelpers
    const { heightCM, weightKG } = form.values.corPatientNoteVitalSign[0]
    const { setFieldValue, setFieldTouched } = form
    if (heightCM && weightKG) {
      const heightM = heightCM / 100
      const bmi = weightKG / heightM ** 2
      const bmiInTwoDecimal = Math.round(bmi * 100) / 100
      setFieldValue(`corPatientNoteVitalSign[0].bmi`, bmiInTwoDecimal)
    } else {
      setFieldValue('corPatientNoteVitalSign[0].bmi', null)
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
                      arrayHelpers={arrayHelpers}
                      handleCalculateBMI={this.handleCalculateBMI}
                      weightOnChange={() => {
                        this.updateCORVitalSign([
                          ...(this.arrayHelpers.form.values
                            .corPatientNoteVitalSign || []),
                        ])
                        this.setState({ showWarningMessage: true })
                        setTimeout(() => {
                          this.setState({ showWarningMessage: false })
                        }, 3000)
                      }}
                      fieldName='corPatientNoteVitalSign'
                    />
                  </div>
                )
              })
            }}
          />
        </AuthorizedContext.Provider>

        <div>
          {this.state.showWarningMessage && (
            <Alert
              message={`Weight changes will only take effect on new medication's instruction setting.`}
              banner
              className={classes.alertStyle}
            />
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
