import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Iframe from 'react-iframe'

import { withStyles, Divider, Paper } from '@material-ui/core'

// import model from './models'

// window.g_app.replaceModel(model)

const styles = theme => ({})

@connect(({ dentalChartDemo }) => ({
  dentalChartDemo,
}))
@withFormik({
  // mapPropsToValues: ({ dentalChartDemo }) => {
  //   console.log(dentalChartDemo)
  //   return dentalChartDemo.entity ? dentalChartDemo.entity : dentalChartDemo.default
  // },

  handleSubmit: () => {},
  displayName: 'DentalChartDemo',
})
class DentalChartDemo extends Component {
  render() {
    const { state, props } = this
    const { theme } = props
    return (
      <Iframe
        url='https://cdrss.com:8200/Examine/Charts/DentalChart?patientId=664118bc-f92b-4fac-a2cf-3c0d6b1c2243&embedd=1'
        width='100%'
        height='100%'
        id='identalchartdemo'
        className='myClassname'
        display='initial'
        position='relative'
        frameBorder={0}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(DentalChartDemo)
