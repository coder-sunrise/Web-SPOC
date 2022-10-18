import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Call from '@material-ui/icons/Call'
import Add from '@material-ui/icons/Add'
import ReferralCard from '@/pages/Reception/Queue/NewVisit/ReferralCard'

import { withStyles, Paper } from '@material-ui/core'
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
  CheckboxGroup,
  TagPanel,
} from '@/components'
import { getUniqueNumericId } from '@/utils/utils'
import service from '@/services/patient'
import { MobileNumberInput } from '@/components/_medisys'
import Address from './Address'
import clinicSettings from '@/models/clinicSettings'

const { queryList } = service
const styles = () => ({
  contactIcon: {
    width: 15,
    height: 15,
    position: 'relative',
    top: 3,
  },
  autoHeight: {
    height: 'auto',
  },
})

// @Authorized.Secured('patientdatabase.patientprofiledetails')
@connect(({ clinicSettings, streetAddress }) => ({
  streetAddress,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
class Demographic extends PureComponent {
  state = {
    patientTags: [],
  }

  constructor(props) {
    super(props)
    this.fetchCodeTables()
  }

  fetchCodeTables = () => {
    const { dispatch, values } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'cttag',
      },
    }).then(result => {
      if (result) {
        this.setState({
          patientTags: result
            .filter(
              t =>
                t.category === 'Patient' &&
                values.patientTag &&
                values.patientTag.findIndex(st => st.tagFK === t.id) !== -1,
            )
            .map(t => t.displayValue),
        })
      }
    })
  }

  addAddress = () => {
    this.arrayHelpers.unshift({
      id: getUniqueNumericId(),
      contactFK: this.props.values.contact.id,
      postcode: '',
      countryFK: undefined,
      isDeleted: false,
    })
  }

  selectReferralPerson = args => {
    const { values, classes } = this.props
    return (
      <Select
        query={v => {
          return queryList({
            apiCriteria: {
              searchValue: v,
              includeinactive: false,
            },
          })
        }}
        handleFilter={() => true}
        valueField='id'
        label='Patient Name/Account No./Mobile No.'
        renderDropdown={p => {
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
        onChange={v => {
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

  onReferredByChange = event => {
    const { setFieldValue } = this.props
    const { target } = event
    const { value } = target
    if (value === '') {
      setFieldValue('referredByPatientFK', undefined)
    }
  }

  handleTagPanelChange = (value, tags, setFieldValue) => {
    const {
      patientTag: originalTags = [],
      id: patientId,
    } = this.props.initialValues

    const currentTags = tags.map(t => {
      return {
        patientProfileFK: patientId,
        tagFK: t.id,
        isDeleted: false,
      }
    })

    const deletedTags = originalTags
      .filter(t => !value.includes(t.displayValue))
      .map(t => {
        return { ...t, isDeleted: true }
      })

    setFieldValue('patientTag', [...currentTags, ...deletedTags])
  }

  render() {
    const { props } = this
    const { values, theme, setFieldValue, classes, dispatch } = props
    const {
      isPatientNameAutoUpperCase,
      primaryPrintoutLanguage,
      secondaryPrintoutLanguage,
    } = props.clinicSettings
    return (
      <div>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={6} md={8}>
                <FastField
                  name='patientAccountNoTypeFK'
                  render={args => {
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
                  render={args => {
                    return (
                      <TextField
                        label='Account No.'
                        autoFocus
                        uppercase
                        maxLength='20'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6} md={4}>
                <FastField
                  name='salutationFK'
                  render={args => (
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
                  render={args => {
                    return (
                      <TextField
                        label='Full Name'
                        uppercase={isPatientNameAutoUpperCase}
                        maxLength='100'
                        onChange={e => {
                          if (isPatientNameAutoUpperCase) {
                            setFieldValue(
                              'callingName',
                              (e.target.value || '').toUpperCase(),
                            )
                          } else {
                            setFieldValue('callingName', e.target.value)
                          }
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
                  render={args => {
                    return (
                      <TextField
                        uppercase={isPatientNameAutoUpperCase}
                        label='Calling Name'
                        maxLength='100'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dob'
                  render={args => (
                    <DatePicker
                      label='Date of Birth'
                      // showTime
                      dobRestrict
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='genderFK'
                  render={args => {
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
                  render={args => (
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
                  render={args => (
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
                  render={args => (
                    <CodeSelect label='Race' code='ctRace' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='religionFK'
                  render={args => (
                    <CodeSelect label='Religion' code='ctReligion' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='languageFK'
                  render={args => (
                    <CodeSelect
                      label='Spoken Language'
                      code='ctLanguage'
                      localFilter={item => ![5, 6, 9, 11].includes(item?.id)}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dialect'
                  render={args => <TextField label='Dialect' {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='occupationFK'
                  render={args => (
                    <CodeSelect
                      label='Occupation'
                      code='ctoccupation'
                      valueField='id'
                      autoComplete
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='patientRemarks'
                  render={args => (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax={4}
                      maxLength={500}
                      inputProps={{ maxLength: 500 }}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={1} />
          <GridItem xs={12} md={6}>
            <GridContainer className={classes.autoHeight}>
              <GridItem xs={3}>
                <FastField
                  name='contact.mobileContactNumber.countryCodeFK'
                  render={args => (
                    <CodeSelect
                      allowClear={false}
                      label='Country Code'
                      code='ctcountrycode'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridContainer xs={9}>
                <GridItem xs={3}>
                  <FastField
                    name='contact.mobileContactNumber.number'
                    render={args => <MobileNumberInput {...args} />}
                    // render={(args) => <NumberInput label='Mobile' {...args} />}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='contact.homeContactNumber.number'
                    render={args => (
                      <MobileNumberInput label='Home' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='contact.officeContactNumber.number'
                    render={args => (
                      <MobileNumberInput label='Office' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='contact.faxContactNumber.number'
                    render={args => <MobileNumberInput label='Fax' {...args} />}
                  />
                </GridItem>
              </GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='contact.contactEmailAddress.emailAddress'
                  render={args => <TextField label='Email' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='preferredContactMode'
                  render={args => (
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
                  render={args => (
                    <CheckboxGroup
                      // prefix='PDPA Consent: '
                      label='PDPA Consent - Agree to receive marketing material via:'
                      horizontal
                      valueField='id'
                      textField='name'
                      options={[
                        {
                          id: '1',
                          name: 'Phone Call',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: '2',
                          name: 'Text Message',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: '3',
                          name: 'Email',
                          layoutConfig: {
                            style: {},
                          },
                        },
                      ]}
                      onChange={(e, s) => {
                        const { value } = e.target
                        const { patientPdpaConsent } = values
                        let _patientPdpaConsent = []
                        const _intValue = value.map(v => parseInt(v, 10))

                        if (patientPdpaConsent.length < 3) {
                          _patientPdpaConsent = [
                            {
                              pdpaConsentTypeFK: 1,
                              isConsent: _intValue.includes(1),
                            },
                            {
                              pdpaConsentTypeFK: 2,
                              isConsent: _intValue.includes(2),
                            },
                            {
                              pdpaConsentTypeFK: 3,
                              isConsent: _intValue.includes(3),
                            },
                          ]
                        } else
                          _patientPdpaConsent = patientPdpaConsent.reduce(
                            (consents, item) => {
                              if (_intValue.includes(item.pdpaConsentTypeFK)) {
                                return [
                                  ...consents,
                                  { ...item, isConsent: true },
                                ]
                              }

                              return [
                                ...consents,
                                { ...item, isConsent: false },
                              ]
                            },
                            [],
                          )
                        setFieldValue('patientPdpaConsent', _patientPdpaConsent)
                      }}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6} style={{ paddingTop: 3 }}>
                <Field
                  name='patientTag'
                  render={args => (
                    <TagPanel
                      label='Patient Tags:'
                      tagCategory='Patient'
                      defaultTagNames={this.state.patientTags}
                      disabled={values.isActive === false}
                      onChange={(value, tags) =>
                        this.handleTagPanelChange(
                          value,
                          tags,
                          args.form.setFieldValue,
                        )
                      }
                      {...args}
                    ></TagPanel>
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='patientTagRemarks'
                  render={args => (
                    <TextField
                      style={{ top: -28 }}
                      label='Patient Tag Remarks'
                      maxLength={40}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='patientRequest'
                  render={args => (
                    <TextField label='Patient Request' {...args} />
                  )}
                />
              </GridItem>
              {false ?? (
                <GridItem xs={12}>
                  <Field
                    name='translationLinkFK'
                    render={args => {
                      return (
                        <CodeSelect
                          label='Preferred Printout Language'
                          code='ctlanguage'
                          localFilter={item =>
                            item.code === primaryPrintoutLanguage ||
                            item.code === secondaryPrintoutLanguage
                          }
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              )}
              <GridItem xs={12}>
                <ReferralCard
                  dispatch={dispatch}
                  values={values}
                  mode='patientprofile'
                  setFieldValue={setFieldValue}
                />
              </GridItem>
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
                render={arrayHelpers => {
                  this.arrayHelpers = arrayHelpers
                  if (
                    !values ||
                    !values.contact ||
                    !values.contact.contactAddress
                  )
                    return null
                  return (
                    <div>
                      {values.contact.contactAddress.map((val, i) => {
                        return (
                          <Address
                            key={val.id || i}
                            addressIndex={i}
                            theme={theme}
                            arrayHelpers={arrayHelpers}
                            propName='contact.contactAddress'
                            style={{
                              padding: theme.spacing(),
                              marginTop: theme.spacing(),
                              marginBottom: theme.spacing(),
                            }}
                            values={values}
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
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Demographic)
