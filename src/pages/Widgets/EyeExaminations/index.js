import React, { PureComponent } from 'react'
import { withFormik, FieldArray } from 'formik'
import { connect } from 'dva'
import _ from 'lodash'
import numeral from 'numeral'
import { withStyles } from '@material-ui/core'
import { AuthorizedContext, GridContainer, GridItem } from '@/components'
import Authorized from '@/utils/Authorized'
import { hasValue } from '../PatientHistory/config'
import Details from './Details'

const styles = theme => ({
  detail: {
    margin: `${theme.spacing(1)}px 0px`,
    border: '1px solid #ccc',
    borderRadius: 3,
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
})

@connect(({ patient }) => ({
  patientInfo: patient.entity || {},
}))
class index extends PureComponent {
  getEyeExaminationsAccessRight = () => {
    const { isEnableEditOrder = true } = this.props
    let right = Authorized.check(
      'queue.consultation.widgets.eyeexaminations',
    ) || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  getVisualAcuityTestRows = () => {
    let data = []
    const { form } = this.arrayHelpers
    const { values } = form
    data = [
      {
        id: 1,
        type: 'Right Eye',
        BareEye5: values.corEyeExaminations[0].rightBareEye5,
        CorrectedVision5: values.corEyeExaminations[0].rightCorrectedVision5,
        BareEye50: values.corEyeExaminations[0].rightBareEye50,
        CorrectedVision50: values.corEyeExaminations[0].rightCorrectedVision50,
      },
      {
        id: 2,
        type: 'Left Eye',
        BareEye5: values.corEyeExaminations[0].leftBareEye5,
        CorrectedVision5: values.corEyeExaminations[0].leftCorrectedVision5,
        BareEye50: values.corEyeExaminations[0].leftBareEye50,
        CorrectedVision50: values.corEyeExaminations[0].leftCorrectedVision50,
      },
    ]
    return data
  }

  getIntraocularPressureTestRows = () => {
    let data = []
    const { form } = this.arrayHelpers
    const { values } = form
    data = [
      {
        id: 1,
        type: 'Right Eye',
        FirstResult: values.corEyeExaminations[0].rightFirstResult,
        SecondResult: values.corEyeExaminations[0].rightSecondResult,
        ThirdResult: values.corEyeExaminations[0].rightThirdResult,
        AverageResult: values.corEyeExaminations[0].rightAverageResult,
      },
      {
        id: 2,
        type: 'Left Eye',
        FirstResult: values.corEyeExaminations[0].leftFirstResult,
        SecondResult: values.corEyeExaminations[0].leftSecondResult,
        ThirdResult: values.corEyeExaminations[0].leftThirdResult,
        AverageResult: values.corEyeExaminations[0].leftAverageResult,
      },
    ]
    return data
  }

  onVisualAcuityTestCommitChanges = p => {
    const { form } = this.arrayHelpers
    const { changed } = p
    const { setFieldValue } = form
    if (changed) {
      const key = Object.keys(changed)[0]
      const obj = changed[key]
      const updateFiled = Object.keys(obj)[0]
      const updateValue =
        obj[updateFiled] === null ? undefined : obj[updateFiled]
      const type = key === '1' ? 'right' : 'left'
      setFieldValue(`corEyeExaminations[0].${type}${updateFiled}`, updateValue)
    }
  }

  onIntraocularPressureTestChanges = p => {
    const { form } = this.arrayHelpers
    const { changed } = p
    const { setFieldValue, values } = form
    if (changed) {
      const key = Object.keys(changed)[0]
      const obj = changed[key]
      const updateFiled = Object.keys(obj)[0]
      const updateValue =
        obj[updateFiled] === null ? undefined : obj[updateFiled]
      const type = key === '1' ? 'right' : 'left'

      const newValue = {
        ...values.corEyeExaminations[0],
        [`${type}${updateFiled}`]: updateValue,
      }

      // let newAverageResult = undefined
      // const firstResult = newValue[`${type}FirstResult`]
      // const secondResult = newValue[`${type}SecondResult`]
      // const thirdResult = newValue[`${type}ThirdResult`]
      // if (
      //   hasValue(firstResult) &&
      //   hasValue(secondResult) &&
      //   hasValue(thirdResult)
      // ) {
      //   newAverageResult = _.round(
      //     (firstResult + secondResult + thirdResult) / 3,
      //     1,
      //   )
      // }

      // setFieldValue(
      //   `corEyeExaminations[0].${type}AverageResult`,
      //   newAverageResult,
      // )
      setFieldValue(`corEyeExaminations[0].${type}${updateFiled}`, updateValue)
    }
  }

  render() {
    const { theme, values, classes } = this.props
    return (
      <AuthorizedContext.Provider value={this.getEyeExaminationsAccessRight()}>
        <FieldArray
          name='corEyeExaminations'
          render={arrayHelpers => {
            this.arrayHelpers = arrayHelpers
            return (arrayHelpers.form.values.corEyeExaminations || []).map(
              (v, i) => {
                return (
                  <div key={i}>
                    <Details
                      {...this.props}
                      rowsVisualAcuityTest={this.getVisualAcuityTestRows()}
                      rowsIntraocularPressureTest={this.getIntraocularPressureTestRows()}
                      onVisualAcuityTestCommitChanges={
                        this.onVisualAcuityTestCommitChanges
                      }
                      onIntraocularPressureTestChanges={
                        this.onIntraocularPressureTestChanges
                      }
                    />
                  </div>
                )
              },
            )
          }}
        />
      </AuthorizedContext.Provider>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
