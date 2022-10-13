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
import VisitOrderTemplateIndicateString from '@/pages/Widgets/Orders/VisitOrderTemplateIndicateString'
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
import ClaimHistory from '@/pages/PatientDatabase/Detail/ClaimHistory'
import PatientResults from '@/pages/PatientDatabase/Detail/Results'

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
    existsAllergy: false,
    refreshedSchemeData: {},
    refreshedSchemePayerData: {},
    currPatientCoPaymentSchemeFK: 0,
    currentSchemeType: 0,
    showNotesModal: false,
    showSchemeModal: false,
    showNonClaimableHistoryModal: false,
    showExaminationDetailsModal: false,
    showPreOrderModal: false,
    isExpanded: false,
  }

  constructor(props) {
    super(props)
    this.fetchCodeTables()
  }

  componentWillMount() {
                         const { dispatch } = this.props
                         // dispatch({
                         //   type: 'codetable/fetchCodes',
                         //   payload: { code: 'ctg6pd' },
                         // })
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

  getAllergyData() {
    const { patient } = this.props
    const { entity } = patient
    const { info } = entity
    const { patientAllergy = [], patientAllergyMetaData = [] } = entity
    const da = _.orderBy(patientAllergy, ['type'], ['asc']).filter(
      t => t.patientAllergyStatusFK === 1,
    )
    const allergyData = da.reduce((data, current) => {
      if (!data) return current.allergyName
      return `${data}, ${current.allergyName}`
    }, '')

    this.setState({
      existsAllergy: da.length ? true : false,
    })

    return (
      entity &&
      entity.isActive && (
        <span style={{ marginTop: 5 }}>{allergyData || '-'}</span>
      )
    )
  }

  getAllergyLink(data) {
    const { props } = this
    const {
      patient,
      codetable: { ctg6pd = [] },
      from,
    } = props
    const { entity } = patient
    const info = entity
    const { patientAllergy = [], patientAllergyMetaData = [] } = info
    const da = _.orderBy(patientAllergy, ['type'], ['asc'])
    let allergyData = '-'

    if (da.length > 0) {
      if (da.length >= 2) {
        allergyData = `${da[0].allergyName}, ${da[1].allergyName}`
      } else {
        allergyData = `${da[0].allergyName}`
      }
    }

    this.setState({
      existsAllergy: da.length,
    })
    let g6PD
    if (patientAllergyMetaData.length > 0) {
      g6PD = ctg6pd.find(o => o.id === patientAllergyMetaData[0].g6PDFK)
    }
    return (
      entity &&
      entity.isActive && (
        <div style={{ display: 'inline-block' }}>
          {data === 'link' ? (
            <Link
              to={getAppendUrl({
                md: 'pt',
                cmt: 3,
                pid: info.id,
              })}
              tabIndex='-1'
            >
              <IconButton style={{ padding: 0 }}>
                <Edit color='action' />
              </IconButton>
            </Link>
          ) : (
            <div style={{ marginTop: 5 }}>
              {allergyData.length > 25
                ? `${allergyData.substring(0, 25).trim()}...`
                : allergyData}

              {da.length > 0 && (
                <Popover
                  icon={null}
                  content={
                    <div>
                      {da.map((item, i) => {
                        return (
                          <GridContainer>
                            <GridItem>
                              {i + 1}. {item.allergyName}
                            </GridItem>
                          </GridContainer>
                        )
                      })}
                    </div>
                  }
                  trigger='click'
                  placement='bottomLeft'
                >
                  <div style={{ display: 'inline-block' }}>
                    <MoreButton />
                  </div>
                </Popover>
              )}

              <div>
                <span
                  style={{
                    color: 'darkblue',
                    fontWeight: 500,
                    position: 'relative',
                    fontSize: '16.1px',
                  }}
                >
                  G6PD:{' '}
                </span>
                {g6PD ? g6PD.name : '-'}
              </div>
            </div>
          )}
        </div>
      )
    )
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
  openPreOrders = () => this.setState({ showPreOrderModal: true })
  closePreOrders = () => this.setState({ showPreOrderModal: false })
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
      return <span style={{ paddingRight: 5 }}></span>
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

  getSchemeDetails = schemeData => {
    const { refreshedSchemeData } = this.state

    if (
      !_.isEmpty(refreshedSchemeData) &&
      refreshedSchemeData.isSuccessful === true
    ) {
      return { ...refreshedSchemeData }
    }

    // Scheme Balance
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
      // return { ...this.state.refreshedSchemePayerData }

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

  openNonClaimableHistory = () => {
    const { dispatch, patient } = this.props
    const { entity = {} } = patient
    dispatch({
      type: 'nonClaimableHistory/query',
      payload: {
        patientProfileFK: entity.id,
      },
    })

    this.setState({ showNonClaimableHistoryModal: true })
  }
  openExaminationResults = () => {
    const { dispatch, patient } = this.props
    const { entity = {} } = patient
    this.setState({ showExaminationDetailsModal: true })
  }
  closeNonClaimableHistory = () => {
    const { dispatch, patient } = this.props
    const { entity } = patient
    dispatch({
      type: 'patient/query',
      payload: {
        id: entity.id,
      },
    })

    dispatch({
      type: 'nonClaimableHistory/updateState',
      payload: {
        list: [],
      },
    })
    this.setState({ showNonClaimableHistoryModal: false })
  }
  closeExaminationDetails = () => {
    this.setState({ showExaminationDetailsModal: false })
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
      preOrderCmt,
      from = '',
      patient,
      codetable,
      classes,
      activePreOrderItems,
      onSelectPreOrder,
      isEnableRecurrence,
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
      disablePreOrder,
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

    const nonClaimableHistoryAccessRight = Authorized.check(
      'patientdatabase.patientprofiledetails.patienthistory.nonclaimablehistory',
    ) || { rights: 'hidden' }

    const viewPatientProfileAccess = Authorized.check(
      'patientdatabase.patientprofiledetails',
    )

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
    /* const allergiesStyle = () => {
      return {
        color: this.state.existsAllergy ? 'red' : 'darkblue',
        fontWeight: 500,
      }
    } */
    const year = Math.floor(moment.duration(moment().diff(info.dob)).asYears())

    // get scheme details based on scheme type
    const schemeDataList = []
    const g6PD = null

    const pendingPreOrderItems =
      entity.pendingPreOrderItem?.filter(item => !item.isDeleted) || []

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

    const viewNonClaimableHistoryRight = Authorized.check(
      'patientdatabase.patientprofiledetails.claimhistory.viewnonclaimablehistory',
    ) || { rights: 'hidden' }

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
        <span className={classes.part}>{info.patientAccountNo}</span>
        {', '}
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
    const patientG6PD = (
      <Row wrap={false}>
        <Col flex='none'>
          <span
            className={classes.header}
            style={{ color: g6PD && g6PD.name === 'Yes' ? 'red' : 'darkblue' }}
          >
            G6PD:{' '}
          </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <span>{g6PD ? g6PD.name : '-'}</span>
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
          {/* <LoadingWrapper
            loading={refreshingBalance}
            text='Retrieving balance...'
          > */}
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
            <span className={classes.header}>Request: </span>
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
    const patientHRP = (
      <Row wrap={false}>
        <Col flex='none'>
          <span
            className={classes.header}
            style={{
              color: info.patientMedicalHistory?.highRiskCondition
                ? 'red'
                : 'darkblue',
            }}
          >
            HRP:{' '}
          </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={info.patientMedicalHistory?.highRiskCondition}
            interactive='true'
          >
            <span>{info.patientMedicalHistory?.highRiskCondition || '-'}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const patientPersistDiagnosis = (
      <Row wrap={false}>
        <Col flex='none'>
          <Tooltip title='Persistent Diagnosis'>
            <span className={classes.header}>
              P. Diagnosis
              {isEnableJapaneseICD10Diagnosis === true &&
              info?.patientHistoryDiagnosis?.length > 0 ? (
                <span>{`(${info?.patientHistoryDiagnosis?.length})`}</span>
              ) : (
                <span></span>
              )}
              :{' '}
            </span>
          </Tooltip>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={persistentDiagnosis}
            interactive='true'
          >
            <span>{persistentDiagnosis}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const longTermMedication = (
      <Row wrap={false}>
        <Col flex='none'>
          <Tooltip title='Long Term Medication'>
            <span className={classes.header}>L.T. Med.: </span>
          </Tooltip>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={info.patientMedicalHistory?.longTermMedication}
            interactive='true'
          >
            <span>{info.patientMedicalHistory?.longTermMedication || '-'}</span>
          </Tooltip>
        </Col>
      </Row>
    )
    const patientAllergy = (
      <Row wrap={false}>
        <Col flex='none'>
          <span
            className={classes.header}
            style={{ color: this.state.existsAllergy ? 'red' : 'darkblue' }}
          >
            Allergy:
          </span>
          <span>{this.getAllergyLink('link')}</span>
        </Col>
        <Col flex='auto' className={contentClass}>
          <Tooltip
            enterDelay={100}
            title={this.getAllergyData()}
            interactive='true'
          >
            <span>{this.getAllergyData()}</span>
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
    const visitPurposeElm = (
      <Row wrap={false}>
        <Col flex='none'>
          <span className={classes.header}>Visit Purpose: </span>
        </Col>
        <Col flex='auto' className={contentClass}>
          {visitRegistration?.entity?.visit?.visitOrderTemplateDetails ? (
            <VisitOrderTemplateIndicateString
              oneline
              visitOrderTemplateDetails={
                visitRegistration?.entity?.visit?.visitOrderTemplateDetails
              }
            ></VisitOrderTemplateIndicateString>
          ) : (
            <span>-</span>
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
                    {patientG6PD}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientOS}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientSchemeDetails}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientRequest}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientHRP}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientPersistDiagnosis}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {longTermMedication}
                  </GridItem>
                  <GridItem xs={6} md={4}>
                    {patientAllergy}
                  </GridItem>
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
                    {viewNonClaimableHistoryRight.rights === 'enable' && (
                      <span className={classes.header}>
                        <span
                          style={{
                            display: 'block',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={e => {
                            this.openNonClaimableHistory()
                          }}
                        >
                          {`Non Claimable History (${info.nonClaimableHistoryCount ||
                            0})`}
                        </span>
                      </span>
                    )}
                    <div>
                      {notesHistoryAccessRight.rights !== 'hidden' && (
                        <span
                          className={classes.header}
                          style={{ marginRight: 10 }}
                        >
                          {patientNotesLinkElm}
                        </span>
                      )}
                    </div>
                    <span
                      className={classes.header}
                      style={{
                        display: 'block',
                        paddingRight: 10,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      to={getAppendUrl({
                        md: 'pt',
                        cmt: 1,
                        pid: info.id,
                      })}
                      onClick={e => {
                        this.openExaminationResults()
                      }}
                      // disabled={}
                      tabIndex='-1'
                    >
                      Examination Results
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
          open={this.state.showNonClaimableHistoryModal}
          title='Claim History'
          onClose={this.closeNonClaimableHistory}
          maxWidth='lg'
        >
          <ClaimHistory
            defaultTab='NonClaimableHistory'
            patientProfileFK={entity.id}
            values={{ isActive: entity.isActive }}
          />
        </CommonModal>
        <CommonModal
          open={this.state.showExaminationDetailsModal}
          title='Examination Details'
          onClose={this.closeExaminationDetails}
          maxWidth='lg'
          fullHeight
        >
          <PatientResults patient={patient} patientProfileFK={entity.id} />
        </CommonModal>
      </Paper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Banner)
