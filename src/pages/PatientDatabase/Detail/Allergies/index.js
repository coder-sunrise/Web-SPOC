import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik, FastField, Field } from 'formik'
import * as Yup from 'yup'
import { withStyles } from '@material-ui/core'
import { notification, Checkbox, CardContainer, CommonHeader, Select, GridContainer, GridItem } from '@/components'
import { status } from '@/utils/codes'
import allergyModal from '../models/allergy'
import AllergyGrid from './AllergyGrid'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'

window.g_app.replaceModel(allergyModal)

const styles = () => ({
  collectPaymentBtn: { float: 'right', marginTop: '22px', marginRight: '10px' },
  item: {},
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})
@connect(({ patient, loading }) => {
  return { patient, loading }
})
@withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ patient }) => {
    console.log('allergy map')
    console.log(patient)
    return patient.entity || patient.default
  },
  validationSchema: Yup.object().shape({
    EditingItems: Yup.array().of(
      Yup.object().shape({
        Description: Yup.string().required('Description is required'),
        UnitPrice: Yup.number().required('Unit Price is required'),
      }),
    ),
  }),

  handleSubmit,
  displayName: 'Allergy',
})

class Allergies extends PureComponent {
  state = {
    height: 0,
    isGridEditable: true
  }

  tableParas_Allergy = {
    columns: [
      { name: 'allergyName', title: 'Allergy Name' },
      { name: 'allergyReaction', title: 'Allergic Reaction' },
      { name: 'onsetDate', title: 'Date' },
      { name: 'patientAllergyStatusFk', title: 'Status' },
    ],
    columnExtensions: [
      {
        columnName: 'onsetDate',
        type: 'date',
      },
      {
        columnName: 'patientAllergyStatusFk',
        type: 'codeSelect',
        code: 'PatientAllergyStatus',
        label: 'Status',
      },
    ]
  }

  tableParas_Alert = {
    columns: [
      { name: 'allergyName', title: 'Allergy Name' },
      { name: 'allergyReaction', title: 'Allergic Reaction' },
      { name: 'onsetDate', title: 'Date' },
      { name: 'patientAllergyStatusFk', title: 'Status' },
    ],
    columnExtensions: [
      {
        columnName: 'onsetDate',
        type: 'date',
      },
      {
        columnName: 'patientAllergyStatusFk',
        type: 'codeSelect',
        code: 'PatientAllergyStatus',
        label: 'Status',
      },

    ]
  }

  onChangeOfCheckBox = (event, checked) => {
    checked == true ? this.setState({ isGridEditable: false }) : this.setState({ isGridEditable: true })
  }
  onSaveClick(values) {
    this.setState(this.state)
    console.log('here update')
    console.log(values)
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  onReset() {
    console.log(this, 'Allergy-onReset')
  }

  resize() {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render() {
    const { height } = this.state
    const { classes, allergy, dispatch, patient, values, ...restProps } = this.props

    if (values.patientAllergyMetaData.length > 0) {
      values.patientAllergyMetaData[0].noAllergies == true ? this.setState({ isGridEditable: false }) : this.setState({ isGridEditable: true })
    }
    console.log('allergy render')
    console.log(values)
    return (
      <CardContainer title={this.titleComponent} hideHeader>
        <GridContainer
          alignItems='flex-start'>
          <GridItem xs md={12}>
            <Field
              name='patientAllergyMetaData[0].noAllergies'
              render={(args) => {
                return (
                  <Checkbox
                    disabled={values.patientAllergy.filter((o) => !o.isDeleted && o.type == 'Allergy').length > 0}
                    simple
                    label={"This patient doesn't has any allergy"}
                    {...args}
                  />

                )
              }}
            />
          </GridItem>
          <GridItem xs md={3} style={{ marginTop: -10 }}>
            <FastField
              name='patientAllergyMetaData[0].isG6PDConfirmed'
              render={(args) => (
                <Select
                  {...args}
                  options={[
                    { name: 'Yes', value: true },
                    { name: 'No', value: false },
                  ]}
                  label={"G6PD Deficiency"}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Drug Allergy
            </h4></GridItem>
          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              rows={values.patientAllergy.filter((o) => !o.isDeleted && o.type == 'Allergy')}
              type='Allergy'
              title='Allergy'
              height={height}
              values={values}
              patient={patient}
              onSaveClick={this.onSaveClick.bind(this)}
              isEditable={this.state.isGridEditable}
              setArrayValue={(items) => {
                let vals = Array.from(values.patientAllergy.filter((o) => !o.isDeleted && o.type == 'NonAllergy'))
                vals = vals.concat(items)
                this.props.setFieldValue('patientAllergy', vals)
              }

              }
              tableParas={this.tableParas_Allergy}
              {...restProps}
            />
          </GridItem>

          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Non-Drug Allergy
            </h4></GridItem>

          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              rows={values.patientAllergy.filter((o) => !o.isDeleted && o.type == 'NonAllergy')}
              type='NonAllergy'
              title='Medical Alert'
              height={height}
              values={values}
              patient={patient}
              isEditable={true}
              setArrayValue={(items) => {
                let vals = Array.from(values.patientAllergy.filter((o) => !o.isDeleted && o.type == 'Allergy'))
                vals = vals.concat(items)
                this.props.setFieldValue('patientAllergy', vals)
              }

              }
              tableParas={this.tableParas_Alert}
              {...restProps}
            />
          </GridItem>
        </GridContainer>
        {getFooter({
          resetable: true,
          allowSubmit: true,
          ...this.props,
        })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Allergies)
