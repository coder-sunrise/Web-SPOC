import React, { Component, PureComponent } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { getUniqueGUID } from 'utils'
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
  Checkbox,
} from '@/components'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { compare } from '@/layouts'
import DeleteIcon from '@material-ui/icons/Delete'
import Add from '@material-ui/icons/Add'
import Item from './Item'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

// @compare('diagnosis')
@connect(({ diagnosis }) => ({
  diagnosis,
}))
@withFormik({
  mapPropsToValues: ({ diagnosis }) => {
    console.log(diagnosis)
    return diagnosis.entity ? diagnosis.entity : diagnosis.default
  },
  validationSchema: Yup.object().shape({
    diagnosises: Yup.array().of(
      Yup.object().shape({
        diagnosis: Yup.string().required(),
        complication: Yup.array().of(Yup.string()).required().min(1),
        orderDate: Yup.string().required(),
      }),
    ),
  }),

  handleSubmit: () => {},
  displayName: 'Diagnosis',
})
class Diagnosis extends PureComponent {
  // constructor (props) {
  //   super(props)
  //   // console.log(this.state, props)
  // }

  componentWillReceiveProps (nextProps) {
    if (
      !this.props.diagnosis.shouldAddNew &&
      nextProps.diagnosis.shouldAddNew
    ) {
      console.log('shouldAddNew')
      this.addDiagnosis()
      this.props.dispatch({
        type: 'diagnosis/updateState',
        payload: {
          shouldAddNew: false,
        },
      })
    }
  }

  addDiagnosis = () => {
    this.arrayHelpers.push({
      diagnosis: '',
      complication: [],
      orderDate: '',
      isPersist: false,
      remarks: '',
      // id: getUniqueGUID(),
    })
  }

  render () {
    console.log('diagnosis')
    const { theme, values } = this.props
    return (
      <div>
        <FieldArray
          name='diagnosises'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!values || !values.diagnosises) return null
            return values.diagnosises.map((v, i) => {
              return (
                <div key={i}>
                  <Item {...this.props} index={i} arrayHelpers={arrayHelpers} />
                </div>
              )
            })
          }}
        />

        {/* <div style={{ padding: theme.spacing(1) }}>
          <Button
            size='sm'
            color='info'
            link
            href=''
            onClick={this.addDiagnosis}
          >
            <Add />Add Diagnosis
          </Button>
        </div> */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Diagnosis)
