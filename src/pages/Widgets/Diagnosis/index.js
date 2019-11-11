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
//     corDiagnosis: Yup.array().of(
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
@connect(({ diagnosis, components, codetable }) => ({
  diagnosis,
  components,
  codetable,
}))
class Diagnosis extends PureComponent {
  // constructor (props) {
  //   super(props)
  //   console.log(this.state, props, 'constructor')
  // }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctComplication',
      },
    })
  }

  componentWillReceiveProps (nextProps) {
    if (
      !this.props.diagnosis.shouldAddNew &&
      nextProps.diagnosis.shouldAddNew
    ) {
      // console.log('shouldAddNew')

      let index = 0
      if (this.diagnosises.length === 0) {
        index = 1
      } else {
        index = this.diagnosises[this.diagnosises.length - 1].sequence
      }
      this.addDiagnosis(index + 1)
      this.props.dispatch({
        type: 'diagnosis/updateState',
        payload: {
          shouldAddNew: false,
        },
      })
    }
  }

  addDiagnosis = (index) => {
    this.arrayHelpers.push({
      onsetDate: moment(),
      uid: getUniqueGUID(),
      sequence: index,
      isNew: true,
    })
  }

  render () {
    const { theme, components, diagnosis } = this.props
    return (
      <div>
        <FieldArray
          name='corDiagnosis'
          render={(arrayHelpers) => {
            const { form } = arrayHelpers
            const { values } = form
            this.diagnosises = values.corDiagnosis || []

            this.arrayHelpers = arrayHelpers
            // if (!values || !values.corDiagnosis) return null

            // if (values.corDiagnosis.length <= 0) {
            //   this.addDiagnosis()
            // }

            if (this.diagnosises.length === 0) {
              // if(!values.disabled)
              if (
                components &&
                components.ConsultationPage &&
                components.ConsultationPage.rights === 'enable'
              ) {
                this.addDiagnosis(1)
                return null
              }
            }

            return this.diagnosises.map((v, i) => {
              if (v.isDeleted === true) return null
              return (
                <div key={v.uid}>
                  <Item
                    {...this.props}
                    ctCompilation={this.props.codetable}
                    index={i}
                    arrayHelpers={arrayHelpers}
                    diagnosises={this.diagnosises}
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
