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
import { SchemePopover } from 'medisys-components'
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
} from '@/components'
import { getAppendUrl } from '@/utils/utils'
// import model from '../models/demographic'
import Block from './Block'
import { control } from '@/components/Decorator'

@control()
@connect(({ patient, codetable }) => ({
  patient,
  codetable,
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
  }

  getAllergyLink (data) {
    const { props } = this
    const { patient, codetable } = props
    const { entity } = patient
    const info = entity
    const { patientAllergy = [] } = info
    const { ctdrugallergy = [] } = codetable
    // const da = ctdrugallergy.filter((o) =>
    //   patientAllergy.find((m) => m.allergyFK === o.id),
    // )

    const filter = patientAllergy.filter((o) => o.type === 'Allergy')
    const da = ctdrugallergy.filter((o) =>
      filter.find((m) => m.allergyFK === o.id),
    )

    let allergyData = ' '

    if (da.length) {
      if (da.length >= 2) {
        allergyData = `${da[0].name}, ${da[1].name}`
      } else {
        allergyData = `${da[0].name}`
      }
    } else {
      allergyData = '-'
    }

    // {da.length ? (
    //   `${da[0].name.length > 8
    //     ? `${da[0].name.substring(0, 8)}... `
    //     : da[0].name} `
    // ) : (
    //   '-'
    // )}
    // {da.length >= 2 ? (
    //   `${da[1].name.length > 8
    //     ? `, ${da[1].name.substring(0, 8)}...`
    //     : `, ${da[1].name}`}`
    // ) : (
    //   ''
    // )}

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
          >
            <IconButton>
              <Edit color='action' />
            </IconButton>
          </Link>
        ) : (
          <div>
            {allergyData.length > 25 ? (
              `${allergyData.substring(0, 25)}...`
            ) : (
              allergyData
            )}

            {da.length ? (
              <Popover
                icon={null}
                content={
                  <div>
                    {da.map((item, i) => {
                      return (
                        <GridContainer>
                          <GridItem>
                            {i + 1}. {item.name}
                          </GridItem>
                        </GridContainer>
                      )
                    })}
                  </div>
                }
                trigger='click'
                placement='bottomLeft'
              >
                <div>
                  <Button simple variant='outlined' color='info' size='sm'>
                    More
                  </Button>
                </div>
              </Popover>
            ) : (
              ' '
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

    dispatch({
      type: 'patient/refreshChasBalance',
      payload: { ...entity, patientCoPaymentSchemeFK },
    }).then((result) => {
      if (result) {
        const {
          balance,
          schemeTypeFk,
          validFrom,
          validTo,
          acuteVisitPatientBalance,
          acuteVisitClinicBalance,
          isSuccessful,
          statusDescription,
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

    this.setState({
      currPatientCoPaymentSchemeFK: schemeData.id,
      currentSchemeType: schemeData.schemeTypeFK,
    })

    return {
      balance,
      patientCoPaymentSchemeFK: schemeData.id,
      schemeTypeFK: schemeData.schemeTypeFK,
      validFrom: schemeData.validFrom,
      validTo: schemeData.validTo,
      acuteVisitPatientBalance: acuteVPBal,
      acuteVisitClinicBalance: acuteVCBal,
      statusDescription: refreshedSchemeData.statusDescription,
    }
  }

  displayMedicalProblemData (entity) {
    let medicalProblemData = ''

    if (entity.patientHistoryDiagnosis.length) {
      if (entity.patientHistoryDiagnosis.length >= 2) {
        medicalProblemData = `${entity.patientHistoryDiagnosis[0]
          .diagnosisDescription}, ${entity.patientHistoryDiagnosis[1]
          .diagnosisDescription}`
      } else {
        medicalProblemData = `${entity.patientHistoryDiagnosis[0]
          .diagnosisDescription}`
      }
    } else {
      medicalProblemData = '-'
    }
    return (
      <div>
        <div style={{ paddingTop: 5 }}>
          {medicalProblemData.length > 25 ? (
            `${medicalProblemData.substring(0, 25)}...`
          ) : (
            medicalProblemData
          )}
        </div>

        {entity.patientHistoryDiagnosis.length ? (
          <Popover
            icon={null}
            content={
              <div>
                {entity.patientHistoryDiagnosis.map((item, i) => {
                  return (
                    <GridContainer>
                      <GridItem>
                        {i + 1}. {item.diagnosisDescription}
                      </GridItem>
                    </GridContainer>
                  )
                })}
              </div>
            }
            trigger='click'
            placement='bottomLeft'
          >
            <div>
              <Button simple variant='outlined' color='info' size='sm'>
                More
              </Button>
            </div>
          </Popover>
        ) : (
          ' '
        )}
      </div>
    )
  }

  // {da.length ? `${da[0].name}${da.length > 1 ? ' ...' : ''}` : '-'}
  render () {
    const { props } = this
    const {
      patientInfo = {},
      extraCmt,
      patient,
      codetable,
      style = {
        position: 'sticky',
        top: headerHeight,
        zIndex: 1000,
        paddingLeft: 16,
        paddingRight: 16,
        // maxHeight: 100,
      },
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
                  >
                    <Tooltip title={name} placement="bottom-start">
                      <span style={{ whiteSpace: 'nowrap' }}>{name} </span>
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
                    {Math.floor(
                      moment.duration(moment().diff(info.dob)).asYears(),
                    )},&nbsp;
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
                <div>
                  {this.state.showWarning ? (
                    <IconButton disabled>
                      <Warining color='error' />
                    </IconButton>
                  ) : (
                    ''
                  )}
                  {'Allergies'} {this.getAllergyLink('link')}
                </div>
              }
              body={this.getAllergyLink(' ')}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header='Medical Problem'
              body={this.displayMedicalProblemData(entity)}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header={
                <div>
                  {'Scheme'}{' '}
                  {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5)
                    .length > 0 ? (
                    <IconButton onClick={this.refreshChasBalance}>
                      <Refresh />
                    </IconButton>
                  ) : (
                    ''
                  )}
                </div>
              }
              body={
                <div>
                  {entity.patientScheme.length ? '' : '-'}
                  {entity.patientScheme
                    .filter((o) => o.schemeTypeFK <= 5)
                    .map((o) => {
                      const schemeData = this.getSchemeDetails(o)
                      return (
                        <div>
                          <CodeSelect
                            text
                            code='ctSchemeType'
                            value={schemeData.schemeTypeFK}
                          />

                          <div
                            style={{
                              fontWeight: 500,
                              display: 'inline-block',
                            }}
                          >
                            :{' '}
                            <NumberInput
                              text
                              currency
                              value={schemeData.balance}
                            />
                          </div>
                          <br />
                          <SchemePopover
                            isBanner
                            isShowReplacementModal={
                              schemeData.isShowReplacementModal
                            }
                            handleRefreshChasBalance={() =>
                              this.refreshChasBalance(
                                schemeData.patientCoPaymentSchemeFK,
                                schemeData.schemeTypeFK,
                              )}
                            entity={entity}
                            schemeData={schemeData}
                          />
                          {schemeData.statusDescription ? (
                            <div
                              style={{
                                fontWeight: 500,
                                display: 'inline-block',
                              }}
                            >
                              <Tooltip
                                title={
                                  <p style={{ color: 'red', fontSize: 14 }}>
                                    {schemeData.statusDescription}
                                  </p>
                                }
                                placement='bottom-end'
                              >
                                <IconButton>
                                  <Warining color='error' />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ) : (
                            ''
                          )}
                          {/* <p style={{ color: 'red' }}>
                            {schemeData.statusDescription}
                          </p> */}
                        </div>
                      )
                    })}
                </div>
              }
              // body={
              //   <div>
              //     {entity.patientScheme.filter(
              //       (o) =>
              //         (this.state.schemeType === ''
              //           ? o.schemeTypeFK
              //           : this.state.schemeType) <= 5,
              //     ).length >= 1 ? (
              //       entity.patientScheme
              //         .filter(
              //           (o) =>
              //             (this.state.schemeType === ''
              //               ? o.schemeTypeFK
              //               : this.state.schemeType) <= 5,
              //         )
              //         .map((o) => {
              //           this.setState({
              //             balanceValue:
              //               o.patientSchemeBalance.length <= 0
              //                 ? 0
              //                 : o.patientSchemeBalance[0].balance,
              //             dateFrom: o.validFrom,
              //             dateTo: o.validTo,
              //           })
              //           console.log(this.state.schemeType)
              //           return (
              //             <div>
              //               <CodeSelect
              //                 text
              //                 code='ctSchemeType'
              //                 value={
              //                   this.state.schemeType === '' ? (
              //                     o.schemeTypeFK
              //                   ) : (
              //                     this.state.schemeType
              //                   )
              //                 }
              //               />

              //               <div
              //                 style={{
              //                   fontWeight: 500,
              //                   display: 'inline-block',
              //                 }}
              //               >
              //                 :{' '}
              //                 <NumberInput
              //                   text
              //                   currency
              //                   value={this.state.balanceValue}
              //                 />
              //               </div>
              //               <br />
              //               {/* <SchemePopover
              //                 data={o}
              //                 isBanner
              //                 balanceValue={this.state.balanceValue}
              //                 schemeTypeFK={
              //                   this.state.schemeType === '' ? (
              //                     o.schemeTypeFK
              //                   ) : (
              //                     this.state.schemeType
              //                   )
              //                 }
              //                 dataFrom={this.state.dateFrom}
              //                 dateTo={this.state.dateTo}
              //                 handleRefreshChasBalance={this.refreshChasBalance}
              //               /> */}
              //             </div>
              //           )
              //         })
              //     ) : (
              //       '-'
              //     )}
              //   </div>
              // }
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            {extraCmt}
          </GridItem>
        </GridContainer>
      </Paper>
      // </Affix>
    )
  }
}

export default Banner
