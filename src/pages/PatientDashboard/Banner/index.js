import React, { PureComponent } from 'react'
import { Link, history } from 'umi'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import { Drawer, Row, Col } from 'antd'
import { Paper } from '@material-ui/core'
import { headerHeight } from 'mui-pro-jss'
import Warning from '@material-ui/icons/Error'
import Edit from '@material-ui/icons/Edit'
import Refresh from '@material-ui/icons/Sync'
import ExpandMoreTwoTone from '@material-ui/icons/ExpandMoreTwoTone'
import ExpandLessTwoTone from '@material-ui/icons/ExpandLessTwoTone'
import { getAppendUrl } from '@/utils/utils'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import PatientNurseNotes from '@/pages/PatientDatabase/Detail/PatientNurseNotes'
import PatientStickyNotesBtn from '@/components/_medisys/PatientInfoSideBanner/PatientStickyNotesBtn'
import PatientDetail from '@/pages/PatientDatabase/Detail'
import { MoreButton, LoadingWrapper } from '@/components/_medisys'
import PatientLabelBtn from '@/components/_medisys/PatientInfoSideBanner/PatientLabelBtn'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  DatePicker,
  dateFormatLong,
  Skeleton,
  Tooltip,
  IconButton,
  Popover,
  NumberInput,
  CommonModal,
  notification,
} from '@/components'

import Authorized from '@/utils/Authorized'
import { currencySymbol } from '@/utils/config'
import { control } from '@/components/Decorator'
import Block from './Block'
import HistoryDiagnosis from './HistoryDiagnosis'
import { SwitcherTwoTone } from '@ant-design/icons'
import { SCHEME_TYPE } from '@/utils/constants'
import CopayerDetails from '@/pages/Setting/Company/CopayerDetails'
import ExternalTracking from '@/pages/PatientDatabase/Detail/Results/ExternalTracking'

const headerStyles = {
  color: 'darkblue',
  fontWeight: 500,
  position: 'relative',
}

const styles = theme => ({
  header: {
    color: 'darkblue',
    fontWeight: 500,
    height: 26,
    display: 'inline-block',
    position: 'relative',
  },
  // cell: {
  //   margin: '3px 0',
  // },
  part: {
    display: 'inline-block',
  },
  contentWithWrap: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingLeft: '5px',
    wordBreak: 'break-word',
  },
  contentWithoutWrap: {
    paddingLeft: '5px',
    wordBreak: 'break-word',
  },
  contents: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
})

@control()
@connect(
  ({
    patient,
    codetable,
    loading,
    visitRegistration,
    clinicSettings,
    global,
  }) => ({
    patient,
    codetable,
    visitRegistration,
    ctschemetype: codetable.ctschemetype || [],
    clinicSettings: clinicSettings.settings || clinicSettings.default,
    mainDivHeight: global.mainDivHeight,
  }),
)
class Banner extends PureComponent {
  state = {
    refreshedSchemeData: {},
    refreshedSchemePayerData: {},
    currPatientCoPaymentSchemeFK: 0,
    currentSchemeType: 0,
    showNotesModal: false,
    showSchemeModal: false,
    isExpanded: false,
  }

  constructor(props) {
    super(props)
    this.fetchCodeTables()
  }

  componentWillUnmount() {
    const { dispatch, isDisposePatientEntity = true } = this.props
    if (isDisposePatientEntity) {
      dispatch({
        type: 'patient/updateState',
        payload: { entity: null },
      })
    }
  }

  fetchCodeTables = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctsalutation',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctschemetype',
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
      },
    })
  }

  openNotes = () => this.setState({ showNotesModal: true })
  openEditVisit = () => {
    const parameter = {
      md: 'visreg',
    }
    parameter.vis = this.props.visitRegistration?.entity?.visit?.id
    parameter.visitMode = 'edit'
    history.push(getAppendUrl(parameter))
  }
  closeNotes = () => this.setState({ showNotesModal: false })
  openScheme = coPayerFK => {
    const { dispatch } = this.props
    dispatch({
      type: 'copayerDetail/queryCopayerDetails',
      payload: {
        id: coPayerFK,
      },
    })

    this.setState({ showSchemeModal: true })
  }
  closeScheme = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'copayerDetail/updateState',
      payload: {
        entity: undefined,
      },
    })
    this.setState({ showSchemeModal: false })
  }
  confirmCopayer = () => {
    const { dispatch, patient } = this.props
    const { entity } = patient
    dispatch({
      type: 'patient/query',
      payload: {
        id: entity.id,
      },
    })

    dispatch({
      type: 'copayerDetail/updateState',
      payload: {
        entity: undefined,
      },
    })
    this.setState({ showSchemeModal: false })
  }
  openPatientProfile = () => {
    if (this.props.from !== 'Appointment') return
    const { dispatch, patient } = this.props
    const { entity } = patient
    this.setState({ showPatientProfile: true })
  }
  closePatientProfile = () => {
    const { dispatch, patient } = this.props
    const { entity } = patient
    dispatch({
      type: 'patient/query',
      payload: {
        id: entity.id,
      },
    })
    this.setState({ showPatientProfile: false })
  }

  getSchemeList = schemeDataList => {
    const chasOrMedisave = (schemeDataList || []).filter(
      o => o.schemeTypeFK <= 6 || this.isMedisave(o.schemeTypeFK),
    )
    const { patient, clinicSettings } = this.props
    const { entity } = patient
    const { patientScheme } = entity
    if (schemeDataList.length === 0) return '-'
    const { schemeInsuranceDisplayColorCode = '' } = clinicSettings
    return schemeDataList.map((s, i, arr) => {
      var scheme =
        patientScheme.find(
          ps => ps.coPaymentSchemeFK === s.coPaymentSchemeFK,
        ) || {}
      return (
        <span style={{ paddingRight: 5 }}>
          {chasOrMedisave &&
          chasOrMedisave.find(list => s.schemeTypeFK === list.schemeTypeFK) ? (
            <Popover
              icon={null}
              content={
                <div>
                  <div>
                    {s.coPaymentSchemeFK ||
                    schemeDataList.filter(p =>
                      this.isMedisave(p.schemeTypeFK),
                    )[0] === s
                      ? s.copaymentSchemeName
                      : s.schemeTypeName}
                    <span style={{ bottom: -2 }}>
                      {s.schemeTypeFK <= 6 && (
                        <IconButton onClick={this.refreshChasBalance}>
                          <Refresh />
                        </IconButton>
                      )}
                      {this.isMedisave(s.schemeTypeFK) &&
                        schemeDataList.filter(p =>
                          this.isMedisave(p.schemeTypeFK),
                        )[0] === s && (
                          <IconButton onClick={this.refreshMedisaveBalance}>
                            <Refresh />
                          </IconButton>
                        )}
                    </span>
                  </div>
                  {s.schemeType && (
                    <div style={{ marginTop: 15 }}>{s.schemeType}</div>
                  )}
                  {this.isMedisave(s.schemeTypeFK) && (
                    <div>
                      Payer: {s.payerName} ({s.payerAccountNo})
                    </div>
                  )}
                  {s.validFrom && (
                    <div>
                      Validity:{' '}
                      {s.validFrom ? (
                        <DatePicker
                          text
                          format={dateFormatLong}
                          value={s.validFrom}
                        />
                      ) : (
                        ''
                      )}
                      &nbsp;-&nbsp;
                      {s.validTo ? (
                        <DatePicker
                          text
                          format={dateFormatLong}
                          value={s.validTo}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                  {s.schemeTypeFK !== 15 ? (
                    <div>
                      Balance: <NumberInput text currency value={s.balance} />
                    </div>
                  ) : (
                    ''
                  )}
                  {s.schemeTypeFK <= 6 ? (
                    <div>
                      Patient Acute Visit Balance:{' '}
                      <NumberInput
                        text
                        currency
                        value={s.acuteVisitPatientBalance}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {s.schemeTypeFK <= 6 ? (
                    <div>
                      Patient Acute Clinic Balance:{' '}
                      <NumberInput
                        text
                        currency
                        value={s.acuteVisitClinicBalance}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              }
              trigger='click'
              placement='bottom'
            >
              <Link>
                <span
                  style={{
                    color: scheme.isExpired ? 'red' : 'black',
                    textDecoration: 'underline',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.copaymentSchemeName || s.schemeTypeName}
                  {s.validTo
                    ? ` (Exp: ${moment(s.validTo).format('DD MMM YYYY')})`
                    : ' (Exp: -)'}
                  {i < arr.length - 1 ? ',' : ''}
                </span>
              </Link>
            </Popover>
          ) : (
            <span
              style={{
                cursor: 'pointer',
                color: scheme.isExpired
                  ? 'red'
                  : scheme.schemeTypeFK === SCHEME_TYPE.INSURANCE
                  ? `#${schemeInsuranceDisplayColorCode}`
                  : 'black',
                textDecoration: 'underline',
                wordBreak: 'break-word',
              }}
              onClick={e => {
                const editDetailAccessRight = Authorized.check(
                  'copayer.copayerdetails',
                ) || {
                  rights: 'hidden',
                }
                if (editDetailAccessRight.rights === 'hidden') return
                if (scheme.copayerFK) {
                  this.openScheme(scheme.copayerFK)
                }
              }}
            >
              {s.copaymentSchemeName || s.schemeTypeName}
              {s.validTo
                ? ` (Exp: ${moment(s.validTo).format('DD MMM YYYY')})`
                : ' (Exp: -)'}
              {i < arr.length - 1 ? ',' : ''}
            </span>
          )}
        </span>
      )
    })
  }

  getTagData = () => {
    const { patient } = this.props
    const { entity } = patient
    let tagData = ''
    if (entity.patientTag.length > 0) {
      tagData = entity.patientTag.map(t => t.tagName).join(', ')
    }
    if (entity.patientTagRemarks) {
      if (tagData === '') {
        tagData = entity.patientTagRemarks
      } else {
        tagData += ' -' + entity.patientTagRemarks
      }
    }
    if (!!tagData) return tagData
    return '-'
  }

  isMedisave = schemeTypeFK => {
    if (schemeTypeFK) return [12, 13, 14].indexOf(schemeTypeFK) >= 0
    return false
  }

  getSchemeDetails = schemeData => {
    const { refreshedSchemeData } = this.state

    if (
      !_.isEmpty(refreshedSchemeData) &&
      refreshedSchemeData.isSuccessful === true
    ) {
      return { ...refreshedSchemeData }
    }
    // Scheme Balance
    schemeData.patientSchemeBalance = schemeData.patientSchemeBalance || []
    const balance =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].balance
    // Patient Acute Visit Patient Balance
    const acuteVPBal =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].acuteVisitPatientBalance
    // Patient Acute Visit Clinic Balance
    const acuteVCBal =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].acuteVisitClinicBalance

    const chronicStatus =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].chronicBalanceStatusCode

    this.setState({
      currPatientCoPaymentSchemeFK: schemeData.id,
      currentSchemeType: schemeData.schemeTypeFK,
    })

    const { codetable } = this.props
    const { ctschemetype = [], copaymentscheme = [] } = codetable
    const schemeType = ctschemetype.find(o => o.id === schemeData.schemeTypeFK)
    const copaymentScheme = copaymentscheme.find(
      o => o.id === schemeData.coPaymentSchemeFK,
    )
    return {
      balance,
      patientCoPaymentSchemeFK: schemeData.id,
      schemeTypeFK: schemeData.schemeTypeFK,
      coPaymentSchemeFK: schemeData.coPaymentSchemeFK,
      validFrom: schemeData.validFrom,
      validTo: schemeData.validTo,
      acuteVisitPatientBalance: acuteVPBal,
      acuteVisitClinicBalance: acuteVCBal,
      statusDescription: refreshedSchemeData.statusDescription,
      acuteBalanceStatusCode:
        !_.isEmpty(refreshedSchemeData) &&
        refreshedSchemeData.isSuccessful === false
          ? 'ERROR'
          : undefined,
      chronicBalanceStatusCode:
        !_.isEmpty(refreshedSchemeData) &&
        refreshedSchemeData.isSuccessful === false
          ? 'ERROR'
          : chronicStatus,
      isSuccessful:
        refreshedSchemeData.isSuccessful !== ''
          ? refreshedSchemeData.isSuccessful
          : '',
      schemeTypeName: schemeType ? schemeType.name : undefined,
      copaymentSchemeName: copaymentScheme ? copaymentScheme.name : undefined,
    }
  }

  getSchemePayerDetails = schemePayer => {
    const { patientScheme } = this.props.patient.entity
    const schemeData = patientScheme.find(
      row => row.schemeTypeFK === schemePayer.schemeFK,
    )
    const balanceData = schemeData.patientSchemeBalance.find(
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
          balance: balanceData.balance >= 0 ? balanceData.balance : '-',
          patientCoPaymentSchemeFK: refreshData.finalBalance,
          schemeTypeFK: refreshData.schemeTypeFK,
          schemeType: schemePayer.schemeType,
          validFrom: schemeData.validFrom,
          validTo: schemeData.validTo,
          statusDescription: refreshData.statusDescription,
          isSuccessful:
            refreshData.isSuccessful !== '' ? refreshData.isSuccessful : '',
          schemeTypeName: '',
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
      statusDescription:
        errorData.statusDescription || schemeData.statusDescription,
      isSuccessful: errorData.isSuccessful || schemeData.isSuccessful,
      schemeTypeName: '',
    }
  }

  displayMedicalProblemData(entity = { patientHistoryDiagnosis: [] }) {
    let medicalProblemData = '-'
    const { patientHistoryDiagnosis = [] } = entity

    if (patientHistoryDiagnosis.length > 0) {
      if (patientHistoryDiagnosis.length >= 2) {
        medicalProblemData = `${patientHistoryDiagnosis[0].diagnosisDescription}, ${patientHistoryDiagnosis[1].diagnosisDescription}`
      } else {
        medicalProblemData = `${patientHistoryDiagnosis[0].diagnosisDescription}`
      }
    }

    return (
      <div style={{ display: 'inline-block', marginTop: 5 }}>
        <div style={{ display: 'inline-block' }}>
          {medicalProblemData.length > 25
            ? `${medicalProblemData.substring(0, 25).trim()}...`
            : medicalProblemData}
        </div>

        {patientHistoryDiagnosis.length > 0 && (
          <Popover
            icon={null}
            content={
              <HistoryDiagnosis
                patientHistoryDiagnosis={entity.patientHistoryDiagnosis}
              />
            }
            trigger='click'
            placement='bottomLeft'
          >
            <div style={{ display: 'inline-block' }}>
              <MoreButton />
            </div>
          </Popover>
        )}
      </div>
    )
  }

  onViewPatientProfile = event => {
    event.preventDefault()
    const { patient, history, from, dispatch } = this.props
    const { entity } = patient
    const info = entity

    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        fullscreen: true,
        showPatientInfoPanel: true,
      },
    })
  }

  getBannerMd = () => {
    const { from, extraCmt } = this.props
    if (from === 'Consultation') return 9
    if (from === 'PatientDashboard') return 11
    if (from === 'VisitReg') return 12
    if (extraCmt) return 11
    return 12
  }

  onViewExternalTrackingClick = () => {
    const { dispatch, patient } = this.props
    const { entity = {} } = patient
    this.setState({ showExternalTrackingModal: true })
  }
  onViewPatientDocumentClick = patientProfileFK => {
    history.push(
      getAppendUrl({
        md: 'pt',
        cmt: 7,
        pid: patientProfileFK,
        v: Date.now(),
      }),
    )
  }
  closeExternalTracking = () => {
    this.setState({ showExternalTrackingModal: false })
  }
  expandOrCollespe = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
    if (this.props.setPatientBannerHeight) {
      this.props.setPatientBannerHeight()
    }
  }

  render() {
    const { props } = this
    const {
      extraCmt,
      from = '',
      patient,
      codetable,
      classes,
      apptId,
      apptMode,
      style = {
        position: 'sticky',
        overflowY: 'auto',
        top: headerHeight,
        zIndex: 998,
        backgroundColor: '#f0f8ff',
      },
      refreshingBalance,
      dispatch,
      isReadOnly,
      isRetail,
      editingOrder,
      clinicSettings,
      visitRegistration,
      isEditVisitEnable = false,
    } = props

    const visitInfo = visitRegistration?.entity?.visit
    const { isEnableJapaneseICD10Diagnosis } = clinicSettings
    const contentClass = this.state.isExpanded
      ? classes.contentWithoutWrap
      : classes.contentWithWrap

    const notesHistoryAccessRight = Authorized.check(
      'patientdatabase.patientprofiledetails.patienthistory.nursenotes',
    ) || { rights: 'hidden' }

    const viewPatientProfileAccess = Authorized.check(
      'patientdatabase.patientprofiledetails',
    )
    const viewExternalTrackingRight = Authorized.check(
      'patientdatabase.patientprofiledetails.patientresults.viewexternaltracking',
    ) || { rights: 'hidden' }

    const { entity } = patient
    if (!entity)
      return (
        <Paper>
          <Skeleton variant='rect' width='100%' height={100} />
        </Paper>
      )
    const { ctsalutation = [] } = codetable
    const info = entity
    const name = `${info.name}`
    const year = Math.floor(moment.duration(moment().diff(info.dob)).asYears())

    // get scheme details based on scheme type
    const schemeDataList = []
    const notMedisaveSchemes =
      entity.patientScheme && entity.patientScheme.length > 0
        ? entity.patientScheme.filter(
            o => !this.isMedisave(o.schemeTypeFK) && o.isSchemeActive,
          )
        : null

    if (notMedisaveSchemes !== null)
      notMedisaveSchemes.forEach(row => {
        schemeDataList.push(this.getSchemeDetails(row))
      })
    const medisaveSchemePayers =
      entity.schemePayer && entity.schemePayer.length > 0
        ? entity.schemePayer
        : null
    if (medisaveSchemePayers !== null)
      medisaveSchemePayers.forEach(row => {
        schemeDataList.push(this.getSchemePayerDetails(row))
      })

    const persistentDiagnosis =
      isEnableJapaneseICD10Diagnosis === true &&
      info.patientHistoryDiagnosis.length > 0
        ? info.patientHistoryDiagnosis
            .map(
              d =>
                `${d.diagnosisDescription} ${d.jpnDiagnosisDescription || ''}`,
            )
            .join(', ')
        : isEnableJapaneseICD10Diagnosis === false &&
          info.patientHistoryDiagnosis.length > 0
        ? info.patientHistoryDiagnosis
            .map(d => d.diagnosisDescription)
            .join(', ')
        : '-'

    const patientTitle = (
      <div>
        <Link
          className={classes.header}
          style={{
            display: 'inline-flex',
            paddingRight: 5,
          }}
          to={getAppendUrl({
            md: 'pt',
            cmt: 1,
            pid: info.id,
          })}
          disabled={
            !viewPatientProfileAccess ||
            (viewPatientProfileAccess &&
              viewPatientProfileAccess.rights !== 'enable')
          }
          tabIndex='-1'
        >
          <Tooltip enterDelay={100} title={name} placement='bottom-start'>
            <span
              style={{
                textOverflow: 'ellipsis',
                textDecoration: 'underline',
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                fontWeight: 500,
                fontSize: '1.1rem',
                color: 'rgb(75, 172, 198)',
              }}
            >
              {name}
            </span>
          </Tooltip>
        </Link>
        {'( '}
        <span className={classes.part}>{info.patientReferenceNo}</span>
        {') '}
        <span className={classes.part}>
          {
            <CodeSelect
              code='ctGender'
              // optionLabelLength={1}
              text
              labelField='code'
              value={info.genderFK}
            />
          }
        </span>
        {'/'}
        <span className={classes.part}>{year > 1 ? `${year}` : `${year}`}</span>
        {', '}
        <span className={classes.part}>{info.patientAccountNo}</span>
        {', '}
        <span className={classes.part}>
          <DatePicker
            className={classes.part}
            text
            format={dateFormatLong}
            value={info.dob}
          />
        </span>
        <span className={classes.part}>{`, ${info.contact?.mobileContactNumber
          ?.number || ''}`}</span>
        {', '}
        <span className={classes.part}>
          <CodeSelect
            className={classes.part}
            text
            code='ctNationality'
            value={info.nationalityFK}
          />
        </span>

        <span className={classes.part} style={{ top: 3, position: 'relative' }}>
          <Tooltip
            enterDelay={100}
            title='Sticky Notes'
            placement='bottom-start'
          >
            <PatientStickyNotesBtn patientProfileFK={info.id} />
          </Tooltip>
        </span>
        {from === 'VisitReg' && (
          <span
            className={classes.part}
            style={{ top: 3, position: 'relative' }}
          >
            <PatientLabelBtn
              patientId={info.id}
              codetable={codetable}
              iconOnly={true}
              entity={entity}
              clinicSettings={clinicSettings}
            />
          </span>
        )}
      </div>
    )
    const patientTag = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header}>Tag: </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={this.getTagData()}
            placement='bottom-start'
            interactive='true'
          >
            <span>{this.getTagData()}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const spokenLanguage = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header} style={{ color: 'darkblue' }}>
            Spoken Language:{' '}
          </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <span>{info.spokenLanguage ? info.spokenLanguage : '-'}</span>
        </Col>
      </Row>
    )
    const referralSource = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header} style={{ color: 'darkblue' }}>
            Referral Source:{' '}
          </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <span>{info.referralSource ? info.referralSource : '-'}</span>
        </Col>
      </Row>
    )
    const patientOS = (
      <div>
        <span
          style={{
            ...headerStyles,
            color: info.outstandingBalance ? 'red' : headerStyles.color,
          }}
        >
          O/S Balance:
        </span>
        <Tooltip
          enterDelay={100}
          title={
            info.outstandingBalance
              ? `${currencySymbol}${_.round(info.outstandingBalance, 2)}`
              : ''
          }
        >
          <span
            style={{
              fontWeight: 500,
              marginTop: 5,
              paddingLeft: 5,
            }}
          >
            {info.outstandingBalance ? (
              <NumberInput
                text
                currency
                value={_.round(info.outstandingBalance, 2)}
              />
            ) : (
              '-'
            )}
          </span>
        </Tooltip>
      </div>
    )
    const patientSchemeDetails = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header}>
            Scheme
            {schemeDataList.length > 0 ? (
              <span>{`(${schemeDataList.length})`}</span>
            ) : (
              <span></span>
            )}
            :
          </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            style={{ width: 300 }}
            title={
              <div>
                {this.getSchemeList(
                  _.orderBy(
                    schemeDataList,
                    ['schemeTypeFK', 'validTo'],
                    ['desc', 'asc'],
                  ),
                )}
              </div>
            }
            interactive='true'
          >
            <span>
              {this.getSchemeList(
                _.orderBy(
                  schemeDataList,
                  ['schemeTypeFK', 'validTo'],
                  ['desc', 'asc'],
                ),
              )}
            </span>
          </Tooltip>
          {/* </LoadingWrapper> */}
        </Col>
      </Row>
    )
    const patientRequest = (
      <Row wrap={false}>
        <Col flex='none'>
          <Tooltip title='Patient Request'>
            <span className={classes.header}>Patient Request: </span>
          </Tooltip>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={info.patientRequest}
            interactive='true'
          >
            <span> {info.patientRequest || '-'}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const visitDateElm = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header}>Visit Date: </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          {moment(visitRegistration?.entity?.visit?.visitDate).format(
            dateFormatLong,
          )}
        </Col>
      </Row>
    )
    const visitRemarksElm = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header}>Visit Remarks: </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={visitRegistration?.entity?.visit?.visitRemarks || '-'}
            interactive='true'
          >
            <span>{visitRegistration?.entity?.visit?.visitRemarks || '-'}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const patientNotesLinkElm = (
      <span
        className={classes.header}
        style={{
          display: 'inline-block',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onClick={e => {
          this.openNotes()
        }}
      >
        Notes
      </span>
    )
    const patientEditVisitElm = (
      <span
        className={classes.header}
        style={{
          display: 'block',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        onClick={e => {
          this.openEditVisit()
        }}
      >
        Edit Visit
      </span>
    )
    const schemeCountElm =
      schemeDataList.length > 0 ? (
        <span>{`(${schemeDataList.length})`}</span>
      ) : (
        <span></span>
      )

    return (
      <Paper id='patientBanner' style={style}>
        <GridContainer
          style={{ minHeight: 100, width: '100%', padding: '5px 0' }}
        >
          <GridItem
            style={{ padding: 0 }}
            xs={this.getBannerMd()}
            md={this.getBannerMd()}
          >
            <GridContainer>
              <GridItem xs={10} md={10}>
                <GridContainer>
                  <GridItem md={12}>{patientTitle}</GridItem>
                  <GridItem xs={6} md={4}>
                    {patientTag}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {spokenLanguage}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientOS}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientSchemeDetails}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {referralSource}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientRequest}
                  </GridItem>
                  <GridItem xs={6} md={4}></GridItem>
                  <GridItem xs={6} md={4}></GridItem>
                  <GridItem xs={6} md={4}></GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={2} md={2}>
                {/* right half */}
                <GridContainer>
                  {entity?.lastVisitDate ? (
                    <GridItem
                      xs={12}
                      md={12}
                      style={{ height: 26, paddingTop: 5 }}
                    >
                      <span className={classes.header}>Last Visit: </span>
                      <span style={{ paddingLeft: 5 }}>
                        {moment(entity.lastVisitDate).format('DD MMM YYYY')}
                      </span>
                    </GridItem>
                  ) : (
                    <GridItem xs={12} md={12}></GridItem>
                  )}
                  <GridItem xs={12} md={12}>
                    {viewExternalTrackingRight.rights !== 'hidden' && (
                      <span
                        className={classes.header}
                        style={{
                          display: 'block',
                          paddingRight: 10,
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={e => this.onViewExternalTrackingClick()}
                        tabIndex='-1'
                      >
                        External Tracking
                      </span>
                    )}
                    <span
                      className={classes.header}
                      style={{
                        display: 'block',
                        paddingRight: 10,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={e => this.onViewPatientDocumentClick(info.id)}
                      tabIndex='-1'
                    >
                      Patient Documents
                    </span>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>

          {extraCmt && (
            <GridItem xs={3} md={12 - this.getBannerMd()}>
              {extraCmt()}
            </GridItem>
          )}
        </GridContainer>
        <span
          style={{
            top: 5,
            right: 5,
            display: 'inline-block',
            position: 'absolute',
          }}
        >
          <IconButton onClick={this.expandOrCollespe}>
            {this.state.isExpanded ? (
              <Tooltip title='Expand Panel'>
                <ExpandLessTwoTone />
              </Tooltip>
            ) : (
              <Tooltip title='Collapse Panel'>
                <ExpandMoreTwoTone />
              </Tooltip>
            )}
          </IconButton>
        </span>
        <CommonModal
          open={this.state.showPatientProfile}
          onClose={this.closePatientProfile}
          title='Patient Profile'
          observe='PatientDetail'
          authority='patient'
          fullScreen
          overrideLoading
          showFooter={false}
        >
          <PatientDetail
            history={this.props.history}
            linkProps={{
              to: '#',
            }}
            onClose={this.closePatientProfile}
          />
        </CommonModal>
        <CommonModal
          open={this.state.showNotesModal}
          title='Notes'
          onClose={this.closeNotes}
          maxWidth='lg'
        >
          <PatientNurseNotes {...this.props} />
        </CommonModal>
        <CommonModal
          open={this.state.showSchemeModal}
          title='Co-Payer Details'
          onClose={this.closeScheme}
          onConfirm={this.confirmCopayer}
          fullScreen
        >
          <CopayerDetails fromCommonModal />
        </CommonModal>

        <CommonModal
          open={this.state.showExternalTrackingModal}
          title='External Tracking'
          onClose={this.closeExternalTracking}
          maxWidth='lg'
        >
          <ExternalTracking
            patient={patient}
            patientProfileFK={entity.id}
            defaultActiveKey='1'
          />
        </CommonModal>
      </Paper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Banner)
