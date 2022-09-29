import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import moment from 'moment'
import _ from 'lodash'
// material ui
import { withStyles, Divider } from '@material-ui/core'
// common components
import Refresh from '@material-ui/icons/Sync'
import { locationQueryParameters } from '@/utils/utils'
import { getBizSession } from '@/services/queue'
import {
  NumberInput,
  CodeSelect,
  dateFormatLong,
  DatePicker,
  IconButton,
  TextField,
  Switch,
  Tooltip,
} from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import PrintLabLabelButton from './PatientLabelBtn'
import PatientStickyNotesBtn from './PatientStickyNotesBtn'
// assets
import styles from './styles.js'

class PatientInfoSideBanner extends PureComponent {
  state = {
    refreshedSchemeData: {},
    refreshedSchemePayerData: [],
    patientIntoActiveSession: false,
  }

  componentDidMount = () => {
    const { entity, allowChangePatientStatus } = this.props

    if (allowChangePatientStatus && entity)
      this.checkPatientIntoActiveSession(entity.id)
  }

  checkPatientIntoActiveSession = patientId => {
    const bizSessionPayload = {
      'Visit.PatientProfileFK': patientId,
      IsClinicSessionClosed: false,
    }
    getBizSession(bizSessionPayload).then(result => {
      const {
        data: { totalRecords },
      } = result
      this.setState({ patientIntoActiveSession: totalRecords > 0 })
    })
  }

  getSchemeDetails = schemeData => {
    if (
      !_.isEmpty(this.state.refreshedSchemeData) &&
      this.state.refreshedSchemeData.isSuccessful === true
    ) {
      return { ...this.state.refreshedSchemeData }
    }

    let balance = ''
    let acuteVPBal = ''
    let acuteVCBal = ''
    let chronicStatus = ''

    if (!schemeData.isNew) {
      // Scheme Balance
      balance =
        schemeData.patientSchemeBalance.length <= 0
          ? undefined
          : schemeData.patientSchemeBalance[0].balance
      // Patient Acute Visit Patient Balance
      acuteVPBal =
        schemeData.patientSchemeBalance.length <= 0
          ? undefined
          : schemeData.patientSchemeBalance[0].acuteVisitPatientBalance
      // Patient Acute Visit Clinic Balance
      acuteVCBal =
        schemeData.patientSchemeBalance.length <= 0
          ? undefined
          : schemeData.patientSchemeBalance[0].acuteVisitClinicBalance

      chronicStatus =
        schemeData.patientSchemeBalance.length <= 0
          ? undefined
          : schemeData.patientSchemeBalance[0].chronicBalanceStatusCode
    }

    return {
      balance,
      patientCoPaymentSchemeFK: schemeData.id,
      schemeTypeFK: schemeData.schemeTypeFK,
      validFrom: schemeData.validFrom,
      validTo: schemeData.validTo,
      acuteVisitPatientBalance: acuteVPBal,
      acuteVisitClinicBalance: acuteVCBal,
      statusDescription: this.state.refreshedSchemeData.statusDescription,
      acuteBalanceStatusCode:
        !_.isEmpty(this.state.refreshedSchemeData) &&
        this.state.refreshedSchemeData.isSuccessful === false
          ? 'ERROR'
          : undefined,
      chronicBalanceStatusCode:
        !_.isEmpty(this.state.refreshedSchemeData) &&
        this.state.refreshedSchemeData.isSuccessful === false
          ? 'ERROR'
          : chronicStatus,
      isSuccessful:
        this.state.refreshedSchemeData.isSuccessful !== ''
          ? this.state.refreshedSchemeData.isSuccessful
          : '',
    }
  }

  getSchemePayerDetails = schemePayer => {
    const { patientScheme } = this.props.entity
    const schemeData =
      patientScheme.find(row => row.schemeTypeFK === schemePayer.schemeFK) || {}
    const { patientSchemeBalance = [] } = schemeData
    const balanceData = patientSchemeBalance.find(
      row => row.schemePayerFK === schemePayer.id,
    )

    if (
      !_.isEmpty(this.state.refreshedSchemePayerData.payerBalanceList) &&
      this.state.refreshedSchemePayerData.isSuccessful === true
    ) {
      const refreshData = this.state.refreshedSchemePayerData.payerBalanceList.find(
        row => row.schemePayerFK === schemePayer.id,
      )

      if (refreshData)
        return {
          payerName: schemePayer.payerName,
          payerAccountNo: schemePayer.payerID,
          balance:
            refreshData.finalBalance >= 0 ? refreshData.finalBalance : '-',
          patientCoPaymentSchemeFK: balanceData.patientCoPaymentSchemeFK,
          schemeTypeFK: refreshData.schemeTypeFK,
          schemeType: schemePayer.schemeType,
          validFrom: schemeData.validFrom,
          validTo: schemeData.validTo,
          statusDescription: null,
          isSuccessful:
            refreshData.isSuccessful !== '' ? refreshData.isSuccessful : '',
        }
    }

    const errorData = this.state.refreshedSchemePayerData
    return {
      payerName: schemePayer.payerName,
      payerAccountNo: schemePayer.payerID,
      balance: balanceData.balance >= 0 ? balanceData.balance : '-',
      patientCoPaymentSchemeFK: balanceData.patientCopaymentSchemeFK,
      schemeTypeFK: schemePayer.schemeFK,
      schemeType: schemePayer.schemeType,
      validFrom: schemeData.validFrom,
      validTo: schemeData.validTo,
      statusDescription: errorData.statusDescription,
      isSuccessful: errorData.isSuccessful || '',
    }
  }

  render() {
    const {
      height,
      theme,
      classes,
      entity,
      loading,
      clinicSettings,
      allowChangePatientStatus,
      onActiveStatusChange,
      dispatch,
    } = this.props

    const entityNameClass = classnames({
      [classes.cardCategory]: true,
      [classes.entityName]: true,
      [classes.isInActive]: !entity || !entity.isActive,
    })

    return entity && entity.id ? (
      <React.Fragment>
        <h4 className={entityNameClass}>
          <Tooltip
            title={
              entity.isActive ? 'Active' : 'This patient has been inactived'
            }
          >
            <div>
              <CodeSelect
                text
                code='ctSalutation'
                value={entity.salutationFK}
                style={
                  entity.isActive ? {} : { textDecorationLine: 'line-through' }
                }
              />
              &nbsp;
              {entity.name}
            </div>
          </Tooltip>
        </h4>
        <p>{entity.patientReferenceNo}</p>
        <p>
          {entity.patientAccountNo},&nbsp;
          <CodeSelect text code='ctNationality' value={entity.nationalityFK} />
        </p>

        <p>
          <DatePicker text format={dateFormatLong} value={entity.dob} />(
          {Math.floor(moment.duration(moment().diff(entity.dob)).asYears())}
          ,&nbsp;
          <CodeSelect
            code='ctGender'
            // optionLabelLength={1}
            text
            value={entity.genderFK}
          />
          )
          <span
            style={{
              display: 'inline-block',
              position: 'relative',
              top: 3,
            }}
          >
            <PatientStickyNotesBtn
              patientProfileFK={entity.id}
              popperStyle={{
                zIndex: 1500,
                marginTop: 100,
              }}
            />
          </span>
        </p>
        <div style={{ display: 'inline-flex' }}>
          <PrintLabLabelButton
            patientId={entity.id}
            clinicSettings={clinicSettings}
            isEnableScanner
            {...this.props}
          />
          {allowChangePatientStatus &&
            (!this.state.patientIntoActiveSession || !entity.isActive) && (
              <div
                style={{
                  width: 100,
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Switch
                  checked={entity.isActive}
                  checkedChildren='Active'
                  unCheckedChildren='Inactive'
                  onClick={e => {
                    if (e === false) {
                      dispatch({
                        type: 'global/updateAppState',
                        payload: {
                          openConfirm: true,
                          openConfirmContent: `Inactive this patient?`,
                          onConfirmSave: () => onActiveStatusChange(e),
                        },
                      })
                    } else onActiveStatusChange(true)
                  }}
                />
              </div>
            )}
        </div>
        <Divider light />
      </React.Fragment>
    ) : null
  }
}
const ConnectedPatientInfoSideBanner = connect(
  ({ clinicSettings, codetable }) => ({
    clinicSettings: clinicSettings.settings,
    codetable: codetable,
  }),
)(PatientInfoSideBanner)

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientInfoSideBanner',
})(ConnectedPatientInfoSideBanner)
