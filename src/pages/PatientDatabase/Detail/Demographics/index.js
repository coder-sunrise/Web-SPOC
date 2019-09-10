import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  Field,
  FastField,
  FieldArray,
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  CheckboxGroup,
} from '@/components'
import Call from '@material-ui/icons/Call'
import { Add } from '@material-ui/icons'
import { withStyles, Paper } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import { getUniqueNumericId } from '@/utils/utils'
import { queryList } from '@/services/patient'
import { widgets } from '@/utils/widgets'
import Address from './Address'

const styles = () => ({
  contactIcon: {
    width: 15,
    height: 15,
    position: 'relative',
    top: 3,
  },
})

@connect(({ streetAddress }) => ({
  streetAddress,
}))
@Authorized.Secured('patient.view')
class Demographic extends PureComponent {
  state = {}

  addAddress = () => {
    this.arrayHelpers.unshift({
      id: getUniqueNumericId(),
      contactFK: this.props.values.contact.id,
      postcode: '',
      countryFK: 107,
    })
  }

  selectReferralPerson = (args) => {
    const { values, classes } = this.props
    console.log({ values })
    return (
      <Select
        remote
        query={(v) => {
          const search = {}
          if (typeof v === 'number') {
            search.id = v // for default getter based on id
          } else {
            search.name = v
            search.patientAccountNo = v
            search['contactFkNavigation.contactNumber.number'] = v
          }
          return queryList({
            ...search,
            combineCondition: 'or',
          })
        }}
        label='Patient Name/Account No./Mobile No.'
        renderDropdown={(p) => {
          // console.log(p)
          return (
            <div>
              <p>
                {p.patientAccountNo} / {p.name}
              </p>
              <p>
                Ref No. {p.patientReferenceNo}
                <span style={{ float: 'right' }}>
                  <Call className={classes.contactIcon} />
                  {p.mobileNo || p.officeNo || p.homeNo}
                </span>
              </p>
            </div>
          )
        }}
        filterOption={(input, option) => {
          // console.log(input, option.props)
          const { data } = option.props
          const search = input.toLowerCase()
          return (
            (data.name || '').toLowerCase().indexOf(search) >= 0 ||
            (data.patientAccountNo || '').toLowerCase().indexOf(search) >= 0 ||
            (data.mobileNo || '').toLowerCase().indexOf(search) >= 0 ||
            (data.officeNo || '').toLowerCase().indexOf(search) >= 0 ||
            (data.homeNo || '').toLowerCase().indexOf(search) >= 0
          )
        }}
        onChange={(v) => {
          if (v === values.id) {
            notification.error({
              message: 'Can not use this patient as referral person',
            })
            return false
          }
          return true
        }}
        {...args}
      />
    )
  }

  render () {
    const { props } = this
    const { values, theme, setFieldValue } = props

    return (
      <React.Fragment>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={6} md={8}>
                <FastField
                  name='patientAccountNoTypeFK'
                  render={(args) => {
                    return (
                      <CodeSelect
                        // hideIfNoEditRights
                        label='Account Type'
                        code='ctPatientAccountNoType'
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
                    return (
                      <TextField
                        label='Account No.'
                        uppercase
                        inputProps={{ maxLength: 9 }}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6} md={4}>
                <FastField
                  name='salutationFK'
                  render={(args) => (
                    <CodeSelect
                      // authority='none'
                      label='Title'
                      code='ctSalutation'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6} md={8}>
                <FastField
                  name='name'
                  render={(args) => {
                    return (
                      <TextField
                        label='Full Name'
                        onChange={(e) => {
                          if (
                            !values.callingName ||
                            e.target.value.indexOf(values.callingName) === 0
                          )
                            setFieldValue('callingName', e.target.value)
                        }}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='callingName'
                  render={(args) => {
                    return <TextField label='Calling Name' {...args} />
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
                      dobRestrict
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
                        code='ctGender'
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
                      code='ctMaritalStatus'
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
                      code='ctNationality'
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
                    <CodeSelect label='Race' code='ctRace' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='religionFK'
                  render={(args) => (
                    <CodeSelect label='Religion' code='ctReligion' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='languageFK'
                  render={(args) => (
                    <CodeSelect label='Language' code='ctLanguage' {...args} />
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
                      code='ctOccupation'
                      autoComplete
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='patientRemarks'
                  render={(args) => (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax={4}
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
                      code='ctContactMode'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='pdpaConsent'
                  render={(args) => (
                    <CheckboxGroup
                      // style={{
                      //   margin: theme.spacing(2),
                      // }}
                      label='PDPA Consent'
                      horizontal
                      simple
                      // value={currentLayout.widgets}
                      valueField='id'
                      textField='name'
                      options={[
                        {
                          id: '1',
                          name: 'Phone Call',
                          // component: Loadable({
                          //   loader: () =>
                          //     import('@/pages/Widgets/ResultHistory'),
                          //   loading: Loading,
                          // }),
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: '2',
                          name: 'Text Message',
                          // component: Loadable({
                          //   loader: () => import('@/pages/Widgets/TestWidget'),
                          //   loading: Loading,
                          // }),
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: '3',
                          name: 'Email',
                          // component: Loadable({
                          //   loader: () => import('@/pages/Widgets/TestWidget'),
                          //   loading: Loading,
                          // }),
                          layoutConfig: {
                            style: {},
                          },
                        },
                      ]}
                      onChange={(e, s) => {
                        // console.log(e)
                        // dispatch({
                        //   type: 'consultation/updateState',
                        //   payload: {
                        //     selectedWidgets: e.target.value,
                        //   },
                        // })
                        // console.log(e.target.value, s)
                        // this.updateWidget(e.target.value, s)
                      }}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='referredBy'
                  render={(args) => (
                    <RadioGroup
                      label='Referral Person'
                      options={[
                        {
                          value: 'Company',
                          label: 'Company',
                        },
                        {
                          value: 'Patient',
                          label: 'Patient',
                        },
                      ]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              {values.referredBy === 'Patient' && (
                <GridItem xs={12}>
                  <Field
                    name='referredByPatientFK'
                    render={this.selectReferralPerson}
                  />
                </GridItem>
              )}
              {values.referredBy === 'Company' && (
                <GridItem xs={12}>
                  <Field
                    name='referralCompanyReferenceNo'
                    render={(args) => (
                      <TextField label='Company Ref. No.' {...args} />
                    )}
                  />
                </GridItem>
              )}
              {values.referredBy && (
                <GridItem xs={12}>
                  <Field
                    name='referralRemarks'
                    render={(args) => {
                      return (
                        <TextField
                          label='Remarks'
                          multiline
                          rowsMax={4}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              )}
            </GridContainer>
          </GridItem>
        </GridContainer>
        <Paper
          style={{
            padding: theme.spacing.unit,
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
                      {values.contact.contactAddress.map((val, i) => {
                        return (
                          <Address
                            key={val.id}
                            addressIndex={i}
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
            <GridItem xs={12}>
              <Button
                link
                href=''
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
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Demographic)
