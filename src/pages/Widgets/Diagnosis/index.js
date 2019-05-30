import React, { Component, PureComponent } from 'react'
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
import { compare } from '@/layouts'
import DeleteIcon from '@material-ui/icons/Delete'

import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({})

@compare('diagnosis')
@connect(({ diagnosis }) => ({
  diagnosis,
}))
@withFormik({
  mapPropsToValues: ({ diagnosis }) => {
    // console.log(diagnosis)
    return diagnosis.entity ? diagnosis.entity : diagnosis.default
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFk: Yup.string().required(),
    dialect: Yup.string().required(),
    contact: Yup.object().shape({
      contactAddress: Yup.array().of(
        Yup.object().shape({
          line1: Yup.string().required(),
          postcode: Yup.number().required(),
          countryFk: Yup.string().required(),
        }),
      ),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'Diagnosis',
})
class Diagnosis extends Component {
  constructor (props) {
    super(props)
    // console.log(this.state, props)
  }

  render () {
    const { theme } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='diagnosis'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Diagnosis'
                    code='PatientAccountNoType'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='complication'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Complication'
                    code='PatientAccountNoType'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='orderDate'
              render={(args) => {
                return <DatePicker label='Order Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='test'
              render={(args) => {
                return <TextField label='Test' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={11}>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <TextField label='Remarks' multiline rowsMax={6} {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={1} style={{ position: 'relative' }}>
            <Button
              style={{ position: 'absolute', bottom: theme.spacing.unit }}
              justIcon
              round
              color='danger'
              size='sm'
            >
              <DeleteIcon />
            </Button>
          </GridItem>
        </GridContainer>
        <Divider light />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Diagnosis)
