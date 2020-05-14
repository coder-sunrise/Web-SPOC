import React, { Component, PureComponent } from 'react'
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

const styles = (theme) => ({})
class ExaminationForm extends PureComponent {
  componentDidMount = () => {
    const { prefix } = this.props

    window.g_app._store
      .dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'cteyeexaminationtype' },
      })
      .then((response) => {
        let currentFormData = Object.byString(this._form.values, prefix)
        this.setExaminations(true, currentFormData, response)
      })
  }

  setExaminations = (isDefault, currentFormData, examinationTypes) => {
    const { prefix } = this.props

    const examinations = this.buildExaminationsFromTypes(
      examinationTypes,
      currentFormData && currentFormData.EyeExaminations
        ? currentFormData.EyeExaminations
        : undefined,
    )
    const newFormData = {
      EyeExaminations: examinations,
    }

    setTimeout(() => {
      this._form.setFieldValue(prefix, newFormData)
    }, 1)
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
    const { rows = [], form: { setFieldValue } } = p
    const { prefix } = this.props
    if (rows) {
      setFieldValue(`${prefix}.EyeExaminations`, rows)
    }
    return rows
  }

  getRows = (args) => {
    const { prefix } = this.props
    let rows = []
    const { form } = args

    let currentFormData = Object.byString(form.values, prefix)

    if (currentFormData && currentFormData.EyeExaminations) {
      rows = currentFormData.EyeExaminations
    }

    return rows
  }

  render () {
    // const { formData } = this.state
    return (
      <Field
        render={(args) => {
          if (!this.form) this._form = args.form

          return (
            <Grid
              {...this.props}
              EyeExaminations={this.getRows(args)}
              handleCommitChanges={(p) => {
                this.handleCommitChanges({ ...args, ...p })
              }}
            />
          )
        }}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(ExaminationForm)
