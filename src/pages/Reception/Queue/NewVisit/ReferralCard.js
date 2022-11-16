import React, { PureComponent } from 'react'
import { connect } from 'dva'
// formik
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { Field, FastField } from 'formik'
import service from '@/services/patient'

// custom components
import {
  TextField,
  GridContainer,
  GridItem,
  CodeSelect,
  CommonModal,
  notification,
  Button,
  Select,
  RadioGroup,
} from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Add from '@material-ui/icons/Add'
import Call from '@material-ui/icons/Call'
import Authorized from '@/utils/Authorized'
import Detail from '@/pages/Setting/ReferralSource/Detail'
import ReferralPersonDetail from '@/pages/Setting/ReferralPerson/Detail'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const { queryList, query } = service
const styles = theme => ({
  ...basicStyle(theme),
})
@connect(
  ({
    settingReferralSource,
    settingReferralPerson,
    clinicSettings,
    patient,
  }) => ({
    settingReferralSource,
    settingReferralPerson,
    clinicSettings,
    patient,
  }),
)
class ReferralCard extends PureComponent {
  state = {
    referralData: [],
    referralList: [],
    referralPersonData: [],
    referralPersonList: [],
    showAddReferralSource: false,
    showAddReferralPerson: false,
  }

  componentDidMount = () => {
    this.loadReferralSource()
    this.loadReferralPerson()
  }

  loadReferralSource = () => {
    this.props
      .dispatch({
        type: 'settingReferralSource/query',
        payload: {
          pagesize: 9999,
        },
      })
      .then(response => {
        if (response) {
          let data = response.data.filter(t => t.isActive)
          let result = data.map(m => {
            return { name: m.name, value: m.id }
          })
          this.setState({ referralData: data, referralList: result })
        }
      })
  }

  loadReferralPerson = () => {
    this.props
      .dispatch({
        type: 'settingReferralPerson/query',
        payload: {
          pagesize: 9999,
        },
      })
      .then(response => {
        if (response) {
          let data = response.data.filter(t => t.isActive)
          this.setState({ referralPersonData: data })
          const { referralSourceFK } = this.props.values
          if (referralSourceFK) {
            data = data.filter(t =>
              (t.referralSources || []).find(rs => rs.id === referralSourceFK),
            )
          }
          let result = data.map(m => {
            return { name: m.name, value: m.id }
          })
          this.setState({ referralPersonList: result })
        }
      })
  }

  onReferralByChange = value => {
    let { values, setFieldValue } = this.props
    let { referralPersonData } = this.state
    if (value) {
      referralPersonData = referralPersonData.filter(m =>
        (m.referralSources || []).find(rs => rs.id === value),
      )
    }
    if (
      referralPersonData.findIndex(t => t.id === values.referralPersonFK) < 0
    ) {
      setFieldValue('referralPersonFK', null)
    }
    const result = referralPersonData.map(m => {
      return { name: m.name, value: m.id }
    })
    this.setState({ referralPersonList: result })
  }

  onReferralPersonChange = value => {
    let { referralData } = this.state
    let { values, setFieldValue } = this.props
    if (value) {
      const referralPerson = this.state.referralPersonData.find(
        t => t.id === value,
      )
      referralData = (referralPerson.referralSources || []).map(m => {
        return this.state.referralData.find(t => t.id === m.id)
      })
    }
    referralData = referralData.filter(t => t !== undefined)
    if (referralData.findIndex(t => t.id === values.referralSourceFK) < 0) {
      setFieldValue('referralSourceFK', null)
    }
    const result = referralData.map(m => {
      return { name: m.name, value: m.id }
    })
    this.setState({ referralList: result })
  }

  referralTypeChange = e => {
    if (e.target.value === 'Company') {
      this.props.setFieldValue(
        this.props.mode === 'patientprofile'
          ? 'referredByPatientFK'
          : 'referralPatientProfileFK',
        undefined,
      )
      let { values } = this.props
      let { referralPersonData, referralData } = this.state
      if (!values.referralPersonFK) {
        this.setState({
          referralList: referralData.map(m => {
            return { name: m.name, value: m.id }
          }),
        })
      }
      if (!values.referralSourceFK) {
        this.setState({
          referralPersonList: referralPersonData.map(m => {
            return { name: m.name, value: m.id }
          }),
        })
      }
    } else if (e.target.value === 'Patient') {
      this.props.setFieldValue('referralSourceFK', undefined)
      this.props.setFieldValue('referralPersonFK', undefined)
    } else if (e.target.value === 'None') {
      this.props.setFieldValue('referralSourceFK', undefined)
      this.props.setFieldValue('referralPersonFK', undefined)
      this.props.setFieldValue(
        this.props.mode === 'patientprofile'
          ? 'referredByPatientFK'
          : 'referralPatientProfileFK',
        undefined,
      )
      this.props.setFieldValue('referralRemarks', undefined)
    }
  }

  addNewReferralSource = () => {
    this.props.dispatch({
      type: 'settingReferralSource/updateState',
      payload: {
        entity: undefined,
      },
    })
    this.setState({ showAddReferralSource: true })
  }

  addNewReferralPerson = () => {
    this.props.dispatch({
      type: 'settingReferralPerson/updateState',
      payload: {
        entity: undefined,
      },
    })
    this.setState({ showAddReferralPerson: true })
  }

  onAddReferralSourceClose = () => {
    this.setState({ showAddReferralSource: false })
    this.loadReferralSource()
  }

  onAddReferralPersonClose = () => {
    this.setState({ showAddReferralPerson: false })
    this.loadReferralPerson()
  }

  selectReferralPerson = args => {
    const { classes, patient } = this.props
    const { disabled } = args
    return (
      <Select
        disabled={disabled}
        query={v => {
          if (typeof v === 'number') {
            return query({ id: v })
          }
          return queryList({
            apiCriteria: {
              searchValue: v,
              includeinactive: false,
            },
          })
        }}
        handleFilter={() => true}
        valueField='id'
        label='Patient Name/Account No./Mobile No./Ref. No.'
        renderDropdown={p => {
          const { contact = {} } = p
          const {
            mobileContactNumber = {},
            officeContactNumber = {},
            homeContactNumber = {},
          } = contact
          p.mobileNo = mobileContactNumber.number || p.mobileNo
          p.officeNo = officeContactNumber.number || p.officeNo
          p.homeNo = homeContactNumber.number || p.homeNo
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
          if (patient.entity && v === patient.entity.id) {
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

  render() {
    const {
      attachments,
      values,
      handleUpdateAttachments,
      clinicSettings,
      mode,
      patient,
    } = this.props
    let { disabled } = this.props
    const {
      referralList,
      referralPersonList,
      showAddReferralSource,
      showAddReferralPerson,
    } = this.state
    const isPatientProfileEdit = mode === 'patientprofile'

    if (isPatientProfileEdit) {
      disabled = false
    }
    const cfg = {
      onAddReferralPersonClose: this.onAddReferralPersonClose,
      onAddReferralSourceClose: this.onAddReferralSourceClose,
    }
    let referralTypeOptions = [
      {
        value: 'None',
        label: 'None',
      },
      {
        value: 'Company',
        label: 'Referral Source',
      },
      {
        value: 'Patient',
        label: 'Patient',
      },
    ]
    if (
      clinicSettings.settings.isVisitReferralSourceMandatory &&
      !isPatientProfileEdit
    ) {
      referralTypeOptions = referralTypeOptions.filter(t => t.value !== 'None')
      if (values.referredBy === 'None') {
        this.props.setFieldValue('referredBy', 'Company')
      }
    }
    let padding = isPatientProfileEdit ? { padding: 0 } : { padding: '0 8px' }
    // console.log(disabled)
    return (
      <div>
        <GridContainer>
          <GridItem md={12} style={padding}>
            <Field
              name='referredBy'
              render={args => (
                <RadioGroup
                  {...args}
                  label='Referral'
                  authority='none'
                  disabled={disabled}
                  simple={!isPatientProfileEdit}
                  onChange={this.referralTypeChange}
                  options={referralTypeOptions}
                />
              )}
            />
          </GridItem>
          {values.referredBy === 'Company' && (
            <GridContainer>
              <GridItem xs md={isPatientProfileEdit ? 8 : 6} style={padding}>
                <Field
                  name='referralSourceFK'
                  render={args => (
                    <CodeSelect
                      {...args}
                      options={referralList}
                      labelField='name'
                      valueField='value'
                      disabled={disabled}
                      label='Referral Source'
                      onChange={v => {
                        this.onReferralByChange(v)
                      }}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs md={isPatientProfileEdit ? 4 : 6}>
                <Authorized authority='settings.contact.referralsource'>
                  <Button
                    color='primary'
                    style={{ marginTop: '15px' }}
                    onClick={this.addNewReferralSource}
                    disabled={disabled}
                    size='sm'
                  >
                    <Add /> New Referral Source
                  </Button>
                </Authorized>
              </GridItem>
              <GridItem xs md={isPatientProfileEdit ? 8 : 6} style={padding}>
                <Field
                  name='referralPersonFK'
                  render={args => (
                    <CodeSelect
                      {...args}
                      labelField='name'
                      disabled={disabled}
                      label='Ref. Person Name'
                      options={referralPersonList}
                      onChange={this.onReferralPersonChange}
                      valueField='value'
                      disableAll
                    />
                  )}
                />
              </GridItem>
              <GridItem xs md={isPatientProfileEdit ? 4 : 6}>
                <Authorized authority='settings.contact.referralperson'>
                  <Button
                    color='primary'
                    style={{ marginTop: '15px' }}
                    onClick={this.addNewReferralPerson}
                    disabled={disabled}
                    size='sm'
                  >
                    <Add /> New Referral Person
                  </Button>
                </Authorized>
              </GridItem>
              <GridItem xs md={12} style={padding}>
                <FastField
                  name='referralRemarks'
                  render={args => (
                    <TextField
                      label='Remarks'
                      disabled={disabled}
                      multiline
                      maxLength={400}
                      inputProps={{ maxLength: 400 }}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          )}
          {values.referredBy === 'Patient' && (
            <GridContainer>
              <GridItem xs md={isPatientProfileEdit ? 12 : 6} style={padding}>
                <Field
                  disabled
                  name={
                    isPatientProfileEdit
                      ? 'referredByPatientFK'
                      : 'referralPatientProfileFK'
                  }
                  render={this.selectReferralPerson}
                />
              </GridItem>
              <GridItem xs md={12} style={padding}>
                <FastField
                  name='referralRemarks'
                  render={args => (
                    <TextField
                      label='Remarks'
                      disabled={disabled}
                      multiline
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          )}
        </GridContainer>

        <CommonModal
          open={showAddReferralSource}
          title='New Referral Source'
          cancelText='Cancel'
          maxWidth='md'
          observe='ReferralSourceDetail'
          onClose={this.onAddReferralSourceClose}
          onConfirm={this.onAddReferralSourceClose}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
        <CommonModal
          open={showAddReferralPerson}
          title='New Referral Person'
          cancelText='Cancel'
          maxWidth='md'
          onClose={this.onAddReferralPersonClose}
          onConfirm={this.onAddReferralPersonClose}
        >
          <ReferralPersonDetail
            {...cfg}
            {...this.props}
            referralSource={this.state.referralData}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ReferralCard)
