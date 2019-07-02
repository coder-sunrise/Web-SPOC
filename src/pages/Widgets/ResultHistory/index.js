import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
} from '@/components'
import { withStyles, Divider, Paper } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import Grid from './Grid'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

@connect(({ testWidget }) => ({
  testWidget,
}))
@withFormik({
  // mapPropsToValues: ({ testWidget }) => {
  //   console.log(testWidget)
  //   return testWidget.entity ? testWidget.entity : testWidget.default
  // },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFk: Yup.string().required(),
    dialect: Yup.string().required(),
    contact: Yup.object().shape({
      contactAddress: Yup.array().of(
        Yup.object().shape({
          postcode: Yup.number().required(),
          countryFk: Yup.string().required(),
        }),
      ),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'ResultHistory',
})
class ResultHistory extends Component {
  render () {
    const { state, props } = this
    const { theme } = props
    return <div>TBD</div>
  }
}

export default withStyles(styles, { withTheme: true })(ResultHistory)
