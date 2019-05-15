import React, { PureComponent } from 'react'
import { withFormik ,Formik, Form, Field,FastField, ErrorMessage } from 'formik'

class FormField extends PureComponent {
  render ({ field, form }) {
    const { label,name, render } = this.props

    const control = render()
    console.log(control)
    return control 

  }
}

export default FormField
