import React, { PureComponent } from 'react'
import Link from 'umi/link'
import { connect } from 'dva'
import moment from 'moment'
import { Paper } from '@material-ui/core'
import { headerHeight } from 'mui-pro-jss'
import Warining from '@material-ui/icons/Error'
import Edit from '@material-ui/icons/Edit'
import Refresh from '@material-ui/icons/Sync'
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

@connect(({ patientDashboard, patient, codetable }) => ({
  patientDashboard,
  patient,
  codetable,
}))
class Banner extends PureComponent {
  state = {
    showWarning: false,
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

  componentDidMount () {
    // const { props, value } = this
    // if (props.patientDashboard.currentId) {
    //   setCurrentPatient(props, props.setValues, () => {
    //     if (value && value.contact.contactAddress.length === 0) {
    //       this.addAddress()
    //     }
    //   })
    // } else {
    //   props.setValues(props.demographic.default)
    // }
    // props.setValues(props.patientDashboard.entity)
  }

  getAllergyLink (data) {
    const { props } = this
    const { patient, codetable } = props
    const { entity } = patient
    const info = entity
    const { patientAllergy = [] } = info
    const { ctdrugallergy = [] } = codetable
    const da = ctdrugallergy.filter((o) =>
      patientAllergy.find((m) => m.allergyFK === o.id),
    )

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
            {da.length ? (
              `${da[0].name.length > 8
                ? `${da[0].name.substring(0, 8)}... `
                : da[0].name} `
            ) : (
              '-'
            )}
            {da.length >= 2 ? (
              `${da[1].name.length > 8
                ? `, ${da[1].name.substring(0, 8)}...`
                : `, ${da[1].name}`}`
            ) : (
              ''
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
                            {i + 1}.) {item.name}
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

  // {da.length ? `${da[0].name}${da.length > 1 ? ' ...' : ''}` : '-'}
  render () {
    const { props } = this
    const {
      patientDashboard = {},
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
    // console.log('************** banner ***********')
    // console.log(this.props)
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
        <GridContainer>
          {/* <GridItem xs={6} md={1} gutter={0}>
            <CardAvatar testimonial square>
              <img src={avatar} alt='...' />
            </CardAvatar>
          </GridItem> */}
          <GridItem xs={6} md={2}>
            <Block
              h3={
                <Tooltip title={name}>
                  <Link
                    to={getAppendUrl({
                      md: 'pt',
                      cmt: 1,
                      pid: info.id,
                    })}
                  >
                    <div>
                      <span style={{ whiteSpace: 'nowrap' }}>{name} </span>
                    </div>
                  </Link>
                </Tooltip>
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
              body={
                <div>
                  <div>
                    {entity.patientHistoryDiagnosis.length ? (
                      `${entity.patientHistoryDiagnosis[0].diagnosisDescription.length > 8
                        ? `${entity.patientHistoryDiagnosis[0].diagnosisDescription.substring(0, 8)}... `
                        : entity.patientHistoryDiagnosis[0].diagnosisDescription} `
                    ) : (
                      '-'
                    )}
                    {entity.patientHistoryDiagnosis.length >= 2 ? (
                      `${entity.patientHistoryDiagnosis[1].diagnosisDescription.length > 8
                        ? `, ${entity.patientHistoryDiagnosis[1].diagnosisDescription.substring(0, 8)}...`
                        : `, ${entity.patientHistoryDiagnosis[1].diagnosisDescription}`}`
                    ) : (
                      ''
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
                                  {i + 1}.) {item.diagnosisDescription}
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
              }
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header={
                <div>
                  {'Scheme'}{' '}
                  <IconButton>
                    <Refresh />
                  </IconButton>
                </div>
              }
              body={
                <div>
                  {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5).length >= 1 ? (
                    entity.patientScheme
                      .filter((o) => o.schemeTypeFK <= 5)
                      .map((o) => {
                        return (
                          
                          <div>
                            <CodeSelect
                              text
                              code='ctSchemeType'
                              value={o.schemeTypeFK}
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
                                value={o.patientSchemeBalance.length <= 0 ? '' : o.patientSchemeBalance[0].balance}
                              />
                            </div>
                            <br />

                            {o.validFrom && (
                              <div style={{ display: 'inline-block' }}>
                                <Popover
                                  icon={null}
                                  content={
                                    <div>
                                      <GridContainer>
                                        <GridItem>
                                          <div
                                            style={{
                                              fontWeight: 500,
                                              marginBottom: 0,
                                              paddingLeft: 0,
                                            }}
                                          >
                                            <CodeSelect
                                              text
                                              code='ctSchemeType'
                                              value={o.schemeTypeFK}
                                            />
                                            <IconButton>
                                              <Refresh fontSize='large' />
                                            </IconButton>
                                          </div>
                                        </GridItem>
                                      </GridContainer>

                                      <GridContainer>
                                        <GridItem>
                                          <p>
                                            Validity:{' '}
                                            <DatePicker
                                              text
                                              format={dateFormatLong}
                                              value={o.validFrom}
                                            />
                                            {' - '}
                                            <DatePicker
                                              text
                                              format={dateFormatLong}
                                              value={o.validTo}
                                            />
                                          </p>
                                        </GridItem>
                                      </GridContainer>
                                      <GridContainer>
                                        <GridItem>
                                          {' '}
                                          Balance: $<NumberInput
                                            text
                                            currency
                                            value={
                                              o.patientSchemeBalance.length <= 0 ? '' :
                                              o.patientSchemeBalance[0].balance 
                                            }
                                          />
                                        </GridItem>
                                      </GridContainer>
                                      <GridContainer>
                                        <GridItem>
                                          Patient Visit Balance:{' '}
                                          <div
                                            style={{
                                              fontWeight: 500,
                                              display: 'inline-block',
                                              paddingLeft: 2,
                                            }}
                                          >
                                            {
                                              o.patientSchemeBalance.length <= 0 ? '' : o.patientSchemeBalance[0].acuteVisitPatientBalance 
                                            }{' '}
                                            Remaining{' '}
                                          </div>{' '}
                                          for Year {moment().year()}
                                        </GridItem>
                                      </GridContainer>
                                      <GridContainer>
                                        <GridItem>
                                          Patient Clinic Balance:
                                          <div
                                            style={{
                                              fontWeight: 500,
                                              display: 'inline-block',
                                              paddingLeft: 2,
                                            }}
                                          >
                                            {
                                              o.patientSchemeBalance.length <= 0 ? '' : o.patientSchemeBalance[0].acuteVisitClinicBalance 
                                            }{' '}
                                            Remaining
                                          </div>{' '}
                                          for {moment().format('MMMM')}{' '}
                                          {moment().year()}
                                        </GridItem>
                                      </GridContainer>
                                    </div>
                                  }
                                  trigger='click'
                                  placement='bottomLeft'
                                >
                                  <div>
                                    <Button
                                      simple
                                      variant='outlined'
                                      color='info'
                                      size='sm'
                                    >
                                      More
                                    </Button>
                                  </div>
                                </Popover>
                              </div>
                            )}
                          </div>
                        )
                      })
                  ) : (
                    '-'
                  )}
                </div>
              }
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
