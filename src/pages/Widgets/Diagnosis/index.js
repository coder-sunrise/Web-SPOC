import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { FieldArray } from 'formik'
import { getUniqueGUID } from 'utils'
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { AuthorizedContext, Button } from '@/components'
import Item from './Item'
// import model from './models'

// window.g_app.replaceModel(model)

const styles = (theme) => ({
  diagnosisRow: {
    margin: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
})

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
@connect(({ diagnosis, components, codetable, consultation }) => ({
  diagnosis,
  codetable,
  consultation,
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

  handleAddDiagnosisClick = () => {
    let index = 0
    if (this.diagnosises.length === 0) {
      index = 1
    } else {
      index = this.diagnosises[this.diagnosises.length - 1].sequence
    }
    this.addDiagnosis(index + 1)
  }

  render () {
    const { theme, diagnosis, rights } = this.props

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
              if (rights === 'enable') {
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

        <AuthorizedContext>
          {(r) => {
            if (r.rights !== 'enable') return null
            return (
              <div style={{ padding: theme.spacing(1) }}>
                <Button
                  size='sm'
                  color='primary'
                  onClick={this.handleAddDiagnosisClick}
                >
                  <Add />Add Diagnosis
                </Button>
              </div>
            )
          }}
        </AuthorizedContext>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Diagnosis)
