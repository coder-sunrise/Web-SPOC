import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import * as Yup from 'yup'
import {
  TextField,
  NumberInput,
  GridContainer,
  GridItem,
  Button,
  FastField,
  Field,
  Checkbox,
  OutlinedTextField,
  CardContainer,
  FieldArray,
} from '@/components'

import Grid from './Grid'

const styles = (theme) => ({
  // table: {
  //   '& th': {
  //     textAlign: 'center',
  //   },
  //   '& td,th': {
  //     border: '1px solid rgba(0, 0, 0, 0.42)',
  //     // verticalAlign: 'top',
  //   },
  // },
})
class ExaminationForm extends PureComponent {
  state = {
    formData: undefined,
    examinationTypes: undefined,
  }

  componentWillReceiveProps (nextProps) {
    const { prefix } = this.props
    const { examinationTypes, formData } = this.state
    let nextFormData = Object.byString(nextProps.values, prefix)

    if (
      examinationTypes &&
      nextFormData &&
      (!formData || formData.isDefault !== nextFormData.isDefault)
    ) {
      this.setExaminations(false, nextFormData)
    }
  }

  componentDidMount = () => {
    const { dispatch, prefix } = this.props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cteyeexaminationtype' },
    }).then((response) => {
      this.setState({
        examinationTypes: response,
      })
      let currentFormData = Object.byString(this.props.values, prefix)

      this.setExaminations(true, currentFormData)
    })
  }

  setExaminations = (isDefault, nextFormData) => {
    const { prefix, values, setFieldValue } = this.props
    const { examinationTypes } = this.state

    if (nextFormData)
      nextFormData = this.convertEyeExaminationForm(nextFormData) || {}

    const examinationsFroms = this.buildExaminationsFromTypes(
      examinationTypes,
      nextFormData && nextFormData.EyeExaminations
        ? nextFormData.EyeExaminations
        : undefined,
    )
    const newFormData = {
      isDefault,
      EyeExaminations: examinationsFroms,
    }

    setTimeout(() => {
      setFieldValue(prefix, newFormData)
    }, 1)
    this.setState({
      formData: newFormData,
    })

    console.log('setExaminations', newFormData)
  }

  buildExaminationsFromTypes = (examinationTypes, originalData) => {
    let newData = examinationTypes.reduce((p, c) => {
      let left
      let right
      if (originalData) {
        const data = originalData.find((f) => f.EyeExaminationTypeFK === c.id)
        if (data) {
          left = data.LeftEye
          right = data.RightEye
        }
      }
      return [
        ...p,
        {
          id: p.length + 1,
          EyeExaminationTypeFK: c.id,
          EyeExaminationType: c.name,
          RightEye: right,
          LeftEye: left,
        },
      ]
    }, [])
    return newData
  }

  handleCommitChanges = (p) => {
    const { rows = [], deleted } = p
    const { prefix, setFieldValue } = this.props
    let { formData } = this.state
    if (rows) {
      setFieldValue(`${prefix}.EyeExaminations`, rows)
      this.setState({
        formData: {
          ...formData,
          EyeExaminations: rows,
        },
      })
      return rows
    }
  }

  convertEyeExaminationForm = (formData) => {
    if (formData && typeof formData === 'string') {
      let parseJson = JSON.parse(formData)

      return parseJson
    }
    return formData
  }

  render () {
    const { formData } = this.state

    let rows
    if (formData && formData.EyeExaminations) rows = formData.EyeExaminations

    return (
      <Grid
        {...this.props}
        EyeExaminations={rows}
        handleCommitChanges={this.handleCommitChanges}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(ExaminationForm)
