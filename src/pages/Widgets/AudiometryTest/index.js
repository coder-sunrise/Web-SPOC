import React, { PureComponent } from 'react'
import { FieldArray, withFormik } from 'formik'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { Field } from 'formik'
import { AuthorizedContext, GridContainer, GridItem } from '@/components'
import Authorized from '@/utils/Authorized'
import Grid from './Grid'

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
  getAudiometryTestAccessRight = () => {
    const { isEnableEditOrder = true } = this.props
    let right = Authorized.check(
      'queue.consultation.widgets.audiometrytest',
    ) || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }
  getRows = () => {
    let data = []
    const { form } = this.arrayHelpers
    const { values } = form
    data = [
      {
        id: 1,
        type: 'Right',
        Result1000Hz: values.corAudiometryTest[0].rightResult1000Hz,
        Result4000Hz: values.corAudiometryTest[0].rightResult4000Hz,
      },
      {
        id: 2,
        type: 'Left',
        Result1000Hz: values.corAudiometryTest[0].leftResult1000Hz,
        Result4000Hz: values.corAudiometryTest[0].leftResult4000Hz,
      },
    ]
    return data
  }
  onCommitChanges = p => {
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

      setFieldValue(`corAudiometryTest[0].${type}${updateFiled}`, updateValue)
    }
  }
  render() {
    const { theme, classes } = this.props
    return (
      <div>
        <AuthorizedContext.Provider value={this.getAudiometryTestAccessRight()}>
          <FieldArray
            name='corAudiometryTest'
            render={arrayHelpers => {
              this.arrayHelpers = arrayHelpers
              return (arrayHelpers.form.values.corAudiometryTest || []).map(
                (v, i) => {
                  return (
                    <div key={i}>
                      <Grid
                        {...this.props}
                        rows={this.getRows()}
                        handleCommitChanges={p => {
                          this.onCommitChanges({ ...p })
                        }}
                      />
                    </div>
                  )
                },
              )
            }}
          />
        </AuthorizedContext.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
