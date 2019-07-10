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
  BaseInput,
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
import {
  getUniqueGUID,
  getRemovedUrl,
  getAppendUrl,
  difference,
} from '@/utils/utils'
import { handleSubmit, getFooter, componentDidUpdate } from '../utils'
import Address from './Address'

// window.g_app.replaceModel(model)
const styles = () => ({
  btnContainer: {
    lineHeight: standardRowHeight,
    textAlign: 'right',
  },
  collectPaymentBtn: { float: 'right', marginTop: '22px', marginRight: '10px' },
})

@connect(({ patient }) => ({
  patient,
}))
@withFormik({
  mapPropsToValues: ({ patient }) => patient.entity || patient.default,
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNoTypeFK: Yup.string().required(),
    patientAccountNo: Yup.string().required(),
    genderFK: Yup.string().required(),
    // dialect: Yup.string().required(),
    // contact.mobileContactNumber.number:Yup.string().render(),
    contact: Yup.object().shape({
      // contactAddress: Yup.array().compact((v) => v.isDeleted).of(
      //   Yup.object().shape({
      //     postcode: Yup.number().required(),
      //     countryFK: Yup.string().required(),
      //   }),
      // ),
      mobileContactNumber: Yup.object().shape({
        number: Yup.string().required(),
      }),
    }),
  }),
  handleSubmit,
  displayName: 'Demographic',
})
class Demographic extends PureComponent {
  state = {}

  componentDidMount () {
    if (!this.props.values.id) {
      this.props.validateForm()
    }
  }

  componentDidUpdate = (prevProps) => {
    // console.log(difference(prevProps, this.props))
    // console.log('componentDidUpdate', prevProps, this.props)

    componentDidUpdate(this.props, prevProps)
  }

  componentWillUnmount () {
    this.props.resetForm()
  }

  isValidDate = (current) => {
    let yesterday = moment().subtract(1, 'day')
    return current.isBefore(yesterday)
  }

  addAddress = () => {
    this.arrayHelpers.unshift({
      contactFK: this.props.values.contact.id,
      postcode: '',
      countryFK: 107,
    })
  }

  onReset = () => {
    this.props.resetForm()
  }

  render () {
    console.log('Demographic', this.props)
    const { props, state } = this
    const { values, patient, theme, classes, setValues } = props
    return (
      <CardContainer title='Demographic' hideHeader>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={6} md={8}>
                <FastField
                  name='patientAccountNoTypeFK'
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
                  name='salutationFK'
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
                  name='genderFK'
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
                  name='maritalStatusFK'
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
                  name='nationalityFK'
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
                  name='raceFK'
                  render={(args) => (
                    <CodeSelect label='Race' code='Race' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='religionFK'
                  render={(args) => (
                    <CodeSelect label='Religion' code='Religion' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='languageFK'
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
                  name='occupationFK'
                  render={(args) => (
                    <CodeSelect
                      label='Occupation'
                      code='Occupation'
                      autoComplete
                      // max={10}
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
                  name='patientReferral'
                  render={(args) => (
                    <RadioGroup
                      label="Referral Person"
                      defaultValue='1'
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
              </GridItem>

              {
                values.patientReferral === "2" && 
                  <GridItem xs={12}>
                    <Field
                      name='patientReferralProfile'
                      render={(args) => {
                        return (
                        <TextField label='Patient Name/Account No./Mobile No.' {...args} />
                      )}}
                    />
                  </GridItem>
              }
              {
                values.patientReferral && 
                  <GridItem xs={12}>
                    <Field
                      name='patientReferralRemarks'
                      render={(args) => {
                        return (
                        <TextField label='Remarks' multiline rowsMax={4} {...args} />
                      )}}
                    />
                  </GridItem>
              }
              

            </GridContainer>
          </GridItem>
        </GridContainer>
        <Paper
          style={{
            padding: theme.spacing.unit,
            marginTop: theme.spacing.unit,
            marginBottom: theme.spacing.unit,
          }}
        >
          <GridContainer>
            <GridItem xs={12}>
              <FieldArray
                name='contact.contactAddress'
                render={(arrayHelpers) => {
                  this.arrayHelpers = arrayHelpers
                  if (!values || !values.contact) return null
                  return (
                    <div>
                      {values.contact.contactAddress
                        .filter((o) => !o.isDeleted)
                        .map((val, i) => {
                          return (
                            <Address
                              addressIndex={i}
                              // form={form}
                              theme={theme}
                              arrayHelpers={arrayHelpers}
                              propName='contact.contactAddress'
                              style={{
                                padding: theme.spacing.unit,
                                marginTop: theme.spacing.unit,
                                marginBottom: theme.spacing.unit,
                              }}
                              {...props}
                            />
                          )
                        })}
                    </div>
                  )
                }}
              />
            </GridItem>
            <GridItem xs={3} md={5}>
              <Button
                link
                href=''
                // className={classes.modalCloseButton}
                key='addAddress'
                aria-label='Reset'
                color='danger'
                onClick={this.addAddress}
              >
                <Add />
                Add Address
              </Button>
            </GridItem>
          </GridContainer>
        </Paper>
        {getFooter({
          ...props,
          // extraBtn: (
          //   <Button
          //     // className={classes.modalCloseButton}
          //     key='addAddress'
          //     aria-label='Reset'
          //     color='primary'
          //     onClick={this.addAddress}
          //     style={{ right: 0, position: 'absolute' }}
          //   >
          //     <Add />
          //     Add Address
          //   </Button>
          // ),
        })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Demographic)
