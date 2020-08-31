import React, { PureComponent } from 'react'
import Link from 'umi/link'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import { Paper } from '@material-ui/core'
import { headerHeight } from 'mui-pro-jss'
import Warining from '@material-ui/icons/Error'
import Edit from '@material-ui/icons/Edit'
import Refresh from '@material-ui/icons/Sync'
import {
  SchemePopover,
  MoreButton,
  LoadingWrapper,
} from '@/components/_medisys'
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
  Button,
  NumberInput,
  Info,
} from '@/components'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { currencySymbol } from '@/utils/config'
import { control } from '@/components/Decorator'
import Block from './Block'
import HistoryDiagnosis from './HistoryDiagnosis'

const headerStyles = {
  color: 'darkblue',
  fontWeight: 500,
  position: 'relative',
  // style={{ color: 'darkblue' }}
}

@control()
@connect(({ patient, codetable, loading }) => ({
  patient,
  codetable,
  refreshingChasBalance: loading.effects['patient/refreshChasBalance'],
}))
class Banner extends PureComponent {
  state = {
    showWarning: false,
    refreshedSchemeData: {},
    currPatientCoPaymentSchemeFK: 0,
    currentSchemeType: 0,
  }

  constructor (props) {
    super(props)
    const { dispatch } = props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctdrugallergy',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctsalutation',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctschemetype',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'copaymentscheme',
      },
    })
  }

  getAllergyLink (data) {
    const { props } = this
    const { patient } = props
    const { entity } = patient
    const info = entity
    const { patientAllergy = [] } = info
    const da = _.orderBy(
      patientAllergy,
      [
        'type',
      ],
      [
        'asc',
      ],
    )
    let allergyData = '-'

    if (da.length > 0) {
      if (da.length >= 2) {
        allergyData = `${da[0].allergyName}, ${da[1].allergyName}`
      } else {
        allergyData = `${da[0].allergyName}`
      }
    }

    if (da.length) {
      this.setState({
        showWarning: true,
      })
    } else {
      this.setState({
        showWarning: false,
      })
    }

    return (
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
            <IconButton>
              <Edit color='action' />
            </IconButton>
          </Link>
        ) : (
          <div>
            {allergyData.length > 25 ? (
              `${allergyData.substring(0, 25).trim()}...`
            ) : (
              allergyData
            )}

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
          </div>
        )}
      </div>
    )
  }

  refreshChasBalance = () => {
    const { dispatch, patient } = this.props
    const { entity } = patient
    const { currPatientCoPaymentSchemeFK, currentSchemeType } = this.state
    let patientCoPaymentSchemeFK = currPatientCoPaymentSchemeFK
    let oldSchemeTypeFK = currentSchemeType
    let isSaveToDb = true
    dispatch({
      type: 'patient/refreshChasBalance',
      payload: {
        ...entity,
        patientCoPaymentSchemeFK,
        isSaveToDb,
        patientProfileId: entity.id,
      },
    }).then((result) => {
      // console.log('result ==========', result)
      if (result) {
        dispatch({
          type: 'patient/query',
          payload: {
            id: entity.id,
          },
        })

        const {
          balance,
          schemeTypeFk,
          validFrom,
          validTo,
          acuteVisitPatientBalance,
          acuteVisitClinicBalance,
          isSuccessful,
          statusDescription,
          acuteBalanceStatusCode,
          chronicBalanceStatusCode,
        } = result
        let isShowReplacementModal = false

        if (!isSuccessful) {
          this.setState({
            refreshedSchemeData: {
              statusDescription,
              isSuccessful,
            },
          })
        } else {
          if (oldSchemeTypeFK !== schemeTypeFk) {
            isShowReplacementModal = true
          }

          this.setState({
            refreshedSchemeData: {
              isShowReplacementModal,
              oldSchemeTypeFK,
              balance,
              patientCoPaymentSchemeFK,
              schemeTypeFK: schemeTypeFk,
              validFrom,
              validTo,
              acuteVisitPatientBalance,
              acuteVisitClinicBalance,
              isSuccessful,
              acuteBalanceStatusCode,
              chronicBalanceStatusCode,
            },
          })
        }
      }
    })
  }

  getSchemeDetails = (schemeData) => {
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
    const schemeType = ctschemetype.find(
      (o) => o.id === schemeData.schemeTypeFK,
    )
    const copaymentScheme = copaymentscheme.find(
      (o) => o.id === schemeData.coPaymentSchemeFK,
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

  displayMedicalProblemData (entity = { patientHistoryDiagnosis: [] }) {
    let medicalProblemData = '-'
    const { patientHistoryDiagnosis = [] } = entity

    if (patientHistoryDiagnosis.length > 0) {
      if (patientHistoryDiagnosis.length >= 2) {
        medicalProblemData = `${patientHistoryDiagnosis[0]
          .diagnosisDescription}, ${patientHistoryDiagnosis[1]
          .diagnosisDescription}`
      } else {
        medicalProblemData = `${patientHistoryDiagnosis[0]
          .diagnosisDescription}`
      }
    }

    return (
      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'inline-block' }}>
          {medicalProblemData.length > 25 ? (
            `${medicalProblemData.substring(0, 25).trim()}...`
          ) : (
            medicalProblemData
          )}
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

  render () {
    const { props } = this
    const {
      patientInfo = {},
      extraCmt,
      patient,
      codetable,
      style = {
        position: 'sticky',
        overflowY: 'auto',
        top: headerHeight,
        zIndex: 1000,
        paddingLeft: 16,
        paddingRight: 16,
        // maxHeight: 100,
        backgroundColor: '#f0f8ff',
      },
      refreshingChasBalance,
    } = props

    const { entity } = patient
    if (!entity)
      return (
        <Paper>
          <Skeleton variant='rect' width='100%' height={100} />
        </Paper>
      )
    const { ctsalutation = [] } = codetable
    const info = entity
    const salt = ctsalutation.find((o) => o.id === info.salutationFK) || {}
    const name = `${salt.name || ''} ${info.name}`
    const allergiesStyle = () => {
      return {
        color: this.state.showWarning ? 'red' : 'darkblue',
        fontWeight: 500,
      }
    }
    const year = Math.floor(moment.duration(moment().diff(info.dob)).asYears())

    const viewPatientProfileAccess = Authorized.check(
      'patientdatabase.patientprofiledetails',
    )
    return (
      // <Affix target={() => window.mainPanel} offset={headerHeight + 1}>
      <Paper style={style}>
        {/* Please do not change the height below (By default is 100) */}
        <GridContainer style={{ height: 100 }}>
          {/* <GridItem xs={6} md={1} gutter={0}>
            <CardAvatar testimonial square>
              <img src={avatar} alt='...' />
            </CardAvatar>
          </GridItem> */}
          <GridItem xs={6} md={2}>
            <Block
              h3={
                <div>
                  <Link
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
                    <Tooltip title={name} placement='bottom-start'>
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          textDecoration: 'underline',
                          display: 'inline-block',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        {name}
                      </span>
                    </Tooltip>
                  </Link>
                </div>
              }
              body={
                <div>
                  <div>
                    {info.patientAccountNo}
                    {', '}
                    <CodeSelect
                      text
                      code='ctNationality'
                      value={info.nationalityFK}
                    />
                  </div>
                  <div>
                    {year > 1 ? `${year} yrs` : `${year} yr`},&nbsp;
                    {
                      <CodeSelect
                        code='ctGender'
                        // optionLabelLength={1}
                        text
                        value={info.genderFK}
                      />
                    }
                    {', '}
                    <DatePicker text format={dateFormatLong} value={info.dob} />
                  </div>
                </div>
              }
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header={
                <div
                  style={{
                    ...headerStyles,
                    color: this.state.showWarning ? 'red' : headerStyles.color,
                  }}
                >
                  {this.state.showWarning && (
                    <Warining style={{ position: 'absolute' }} color='error' />
                  )}
                  <span
                    style={{
                      marginLeft: this.state.showWarning ? 20 : 'inherit',
                    }}
                  >
                    Allergies
                  </span>
                  <span style={{ position: 'absolute', bottom: -2 }}>
                    {this.getAllergyLink('link')}
                  </span>
                </div>
              }
              body={this.getAllergyLink(' ')}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header={<b style={headerStyles}>Medical Problem</b>}
              body={this.displayMedicalProblemData(entity)}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <LoadingWrapper
              loading={refreshingChasBalance}
              text='Retrieving balance...'
            >
              <Block
                header={
                  <div style={headerStyles}>
                    Scheme
                    <span style={{ bottom: -2 }}>
                      {(entity.patientScheme || [])
                        .filter((o) => o.schemeTypeFK <= 6).length > 0 && (
                        <IconButton onClick={this.refreshChasBalance}>
                          <Refresh />
                        </IconButton>
                      )}
                    </span>
                    {entity.patientScheme &&
                    entity.patientScheme.length > 0 && (
                      <Popover
                        icon={null}
                        content={entity.patientScheme.map((o) => {
                          const schemeData = this.getSchemeDetails(o)
                          return (
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                              <div>
                                {schemeData.coPaymentSchemeFK ? (
                                  schemeData.copaymentSchemeName
                                ) : (
                                  schemeData.schemeTypeName
                                )}
                              </div>
                              <div>
                                Validity:{' '}
                                {schemeData.validFrom ? (
                                  <DatePicker
                                    text
                                    format={dateFormatLong}
                                    value={schemeData.validFrom}
                                  />
                                ) : (
                                  ''
                                )}
                                -
                                {schemeData.validTo ? (
                                  <DatePicker
                                    text
                                    format={dateFormatLong}
                                    value={schemeData.validTo}
                                  />
                                ) : (
                                  ''
                                )}
                              </div>
                              {schemeData.schemeTypeFK <= 6 ? (
                                <div>
                                  Balance: {' '}
                                  <NumberInput
                                    text
                                    currency
                                    value={schemeData.balance}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                              {schemeData.schemeTypeFK <= 6 ? (
                                <div>
                                  Patient Acute Visit Balance: {' '}
                                  <NumberInput
                                    text
                                    currency
                                    value={schemeData.acuteVisitPatientBalance}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                              {schemeData.schemeTypeFK <= 6 ? (
                                <div>
                                  Patient Acute Clinic Balance: {' '}
                                  <NumberInput
                                    text
                                    currency
                                    value={schemeData.acuteVisitClinicBalance}
                                  />
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                          )
                        })}
                        trigger='click'
                        placement='rightTop'
                      >
                        <div
                          style={{
                            display: 'inline-block',
                            marginLeft: -5,
                          }}
                        >
                          <MoreButton />
                        </div>
                      </Popover>
                    )}
                  </div>
                }
                body={
                  <div>
                    {entity.patientScheme && entity.patientScheme.length > 0 ? (
                      <div>
                        {entity.patientScheme.slice(0, 2).map((o) => {
                          const schemeData = this.getSchemeDetails(o)
                          const displayString = `${schemeData.coPaymentSchemeFK
                            ? schemeData.copaymentSchemeName || ''
                            : schemeData.schemeTypeName ||
                              ''} (Exp: ${schemeData.validTo
                            ? moment(schemeData.validTo).format('DD MMM YYYY')
                            : '-'})`
                          return (
                            <div style={{ display: 'flex' }}>
                              {schemeData.statusDescription && (
                                <div
                                  style={{
                                    width: 25,
                                  }}
                                >
                                  <Tooltip title={schemeData.statusDescription}>
                                    <Warining
                                      color='error'
                                      style={{ position: 'absolute' }}
                                    />
                                  </Tooltip>
                                </div>
                              )}
                              {
                                <Tooltip title={displayString}>
                                  <div
                                    style={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      display: 'inline-block',
                                      textOverflow: 'ellipsis',
                                      width: '100%',
                                    }}
                                  >
                                    {displayString}
                                  </div>
                                </Tooltip>
                              }
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>
                }
              />
            </LoadingWrapper>
          </GridItem>
          <GridItem xs={6} md={1}>
            <Block
              header={<div style={headerStyles}>Outstanding</div>}
              body={
                <Tooltip
                  title={
                    info.outstandingBalance ? (
                      `${currencySymbol}${info.outstandingBalance.toFixed(2)}`
                    ) : (
                      ''
                    )
                  }
                >
                  <div
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {info.outstandingBalance ? (
                      `${currencySymbol}${info.outstandingBalance.toFixed(2)}`
                    ) : (
                      '-'
                    )}
                  </div>
                </Tooltip>
              }
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            {extraCmt}
          </GridItem>
        </GridContainer>
      </Paper>
      // </Affix>
    )
  }
}

export default Banner
