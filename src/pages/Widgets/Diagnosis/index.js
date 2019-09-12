import React, { Component, PureComponent } from 'react'
import moment from 'moment'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { getUniqueGUID } from 'utils'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Add from '@material-ui/icons/Add'
import { compare } from '@/layouts'
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
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'
import Item from './Item'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

// @compare('diagnosis')
// @withFormikExtend({
//   mapPropsToValues: ({ diagnosis }) => {
//     console.log(diagnosis)
//     return diagnosis.entity ? diagnosis.entity : diagnosis.default
//   },
//   validationSchema: Yup.object().shape({
//     diagnosises: Yup.array().of(
//       Yup.object().shape({
//         diagnosisFK: Yup.number().required(),
//         // complication: Yup.array().of(Yup.string()).required().min(1),
//         onsetDate: Yup.string().required(),
//       }),
//     ),
//   }),

//   handleSubmit: () => {},
//   displayName: 'Diagnosis',
// })
@connect(({ diagnosis }) => ({
  diagnosis,
}))
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
      // console.log('shouldAddNew')
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
      onsetDate: moment(),
      uid: getUniqueGUID(),
    })
  }

  render () {
    console.log('diagnosis')
    const { theme } = this.props
    return (
      <div>
        <FieldArray
          name='corDiagnosis'
          render={(arrayHelpers) => {
            const { form } = arrayHelpers
            const { values } = form
            this.arrayHelpers = arrayHelpers
            if (!values || !values.corDiagnosis) return null
            return values.corDiagnosis
              .filter((o) => !o.isDeleted)
              .map((v, i) => {
                return (
                  <div key={i}>
                    <Item
                      {...this.props}
                      index={i}
                      arrayHelpers={arrayHelpers}
                    />
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
