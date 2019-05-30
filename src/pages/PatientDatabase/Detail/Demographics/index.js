import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

import { Save, Close, Clear, FilterList, Search, Add } from '@material-ui/icons'
import {
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Divider,
  Paper,
} from '@material-ui/core'
import { Affix } from 'antd'
import { formatMessage } from 'umi/locale'
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
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import avatar from '@/assets/img/faces/marc.jpg'
import { titles, finTypes, gender } from '@/utils/codes'
import { standardRowHeight } from 'mui-pro-jss'
// import model from '../models/demographic'
import { getUniqueGUID, getRemovedUrl, getAppendUrl } from '@/utils/utils'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'
import Address from './Address'

// window.g_app.replaceModel(model)
const styles = () => ({
  btnContainer: {
    lineHeight: standardRowHeight,
    textAlign: 'right',
  },
})

@connect(({ patient }) => ({
  patient,
}))
@withFormik({
  mapPropsToValues: ({ patient }) => {
    // console.log(patient)
    return patient.entity ? patient.entity : patient.default
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

  handleSubmit,
  displayName: 'Demographic',
})
class Demographic extends PureComponent {
  state = {}

  componentDidMount () {
    const { props, value } = this

    // if (props.patient.currentId) {
    //   setCurrentPatient(props, props.setValues, () => {
    //     if (value && value.contact.contactAddress.length === 0) {
    //       this.addAddress()
    //     }
    //   })
    // } else {
    //   props.setValues(props.demographic.default)
    // }
    // props.setValues(props.patient.entity)
  }

  componentDidUpdate = (prevProps) => {
    componentDidUpdate(this.props, prevProps)
  }

  isValidDate = (current) => {
    let yesterday = moment().subtract(1, 'day')
    return current.isBefore(yesterday)
  }

  addAddress = () => {
    this.arrayHelpers.push({
      // id: getUniqueGUID(),
      contactFk: this.props.values.contact.id,
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      postcode: '',
      countryFk: '',
    })
  }

  onReset = () => {
    this.props.resetForm()
  }

  render () {
    // console.log(this.props)
    const { props, state } = this
    const { values, patient, theme, classes, setValues } = props
    return (
      <CardContainer title='Demographic'>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={6} md={8}>
                <FastField
                  name='patientAccountNoTypeFk'
                  render={(args) => {
                    return (
                      <CodeSelect
                        label='Account Type'
                        code='PatientAccountNoType'
                        width={350}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6} md={4}>
                <FastField
                  name='patientAccountNo'
                  render={(args) => {
                    return <TextField label='Account No.' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={6} md={4}>
                <FastField
                  name='salutationFk'
                  render={(args) => (
                    <CodeSelect label='Title' code='Salutation' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6} md={8}>
                <FastField
                  name='name'
                  render={(args) => {
                    return <TextField label='Full Name' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dob'
                  render={(args) => (
                    <DatePicker
                      label='Date of Birth'
                      timeFormat={false}
                      isValidDate={this.isValidDate}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='genderFk'
                  render={(args) => {
                    // console.log('args', args)
                    return (
                      <CodeSelect
                        label='Gender'
                        code='Gender'
                        // defaultMenuIsOpen
                        // closeMenuOnSelect={false}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='maritalStatusFk'
                  render={(args) => (
                    <CodeSelect
                      label='Maritial Status'
                      code='MaritalStatus'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='nationalityFk'
                  render={(args) => (
                    <CodeSelect
                      label='Nationality'
                      code='Nationality'
                      max={5}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='raceFk'
                  render={(args) => (
                    <CodeSelect label='Race' code='Race' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='religionFk'
                  render={(args) => (
                    <CodeSelect label='Religion' code='Religion' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='languageFk'
                  render={(args) => (
                    <CodeSelect label='Language' code='Language' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dialect'
                  render={(args) => <TextField label='Dialect' {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='occupationFk'
                  render={(args) => (
                    <CodeSelect
                      label='Occupation'
                      code='Occupation'
                      width={600}
                      max={10}
                      // defaultMenuIsOpen
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={2} />
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={4}>
                <FastField
                  name='contact.mobileContactNumber.number'
                  render={(args) => <TextField label='Mobile' {...args} />}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='contact.homeContactNumber.number'
                  render={(args) => <TextField label='Home' {...args} />}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='contact.officeContactNumber.number'
                  render={(args) => <TextField label='Office' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='contact.faxContactNumber.number'
                  render={(args) => <TextField label='Fax' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='contact.contactEmailAddress.emailAddress'
                  render={(args) => <TextField label='Email' {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='preferredContactMode'
                  render={(args) => (
                    <CodeSelect
                      label='Preferred Contact Mode'
                      code='ContactMode'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              {/* <GridItem xs={12}>
                <FastField
                  name='Address'
                  render={(args) => (
                    <TextField
                      label='Address'
                      multiline
                      rowsMax={2}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={8}>
                <FastField
                  name='Country'
                  render={(args) => <TextField label='Country' {...args} />}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='Postcode'
                  render={(args) => <TextField label='Postcode' {...args} />}
                />
              </GridItem> */}
              {/* <GridItem xs={12}>
                <FastField
                  name='referral'
                  render={(args) => (
                    <RadioGroup
                      prefix='Referral'
                      label=' '
                      options={[
                        {
                          value: '1',
                          label: 'Company',
                        },
                        {
                          value: '2',
                          label: 'Patient',
                        },
                      ]}
                      {...args}
                    />
                  )}
                />
              </GridItem> */}
              <GridItem xs={12}>
                <FastField
                  name='doctorRemarks'
                  render={(args) => (
                    <TextField label='Remark' multiline rowsMax={4} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        <FieldArray
          name='contact.contactAddress'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!values || !values.contact) return null
            return (
              <div>
                {values.contact.contactAddress.map((c, i) => {
                  return (
                    <Address
                      addressIndex={i}
                      // form={form}
                      theme={theme}
                      arrayHelpers={arrayHelpers}
                      {...props}
                    />
                  )
                })}
              </div>
            )
          }}
        />
        {getFooter({
          ...props,
          extraBtn: (
            <Button
              // className={classes.modalCloseButton}
              key='addAddress'
              aria-label='Reset'
              color='primary'
              onClick={this.addAddress}
              style={{ right: 0, position: 'absolute' }}
            >
              <Add />
              Add Address
            </Button>
          ),
        })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Demographic)
