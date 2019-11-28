import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import _ from 'lodash'
import $ from 'jquery'
import classnames from 'classnames'
import numeral from 'numeral'
import Timer from 'react-compound-timer'

import { Menu, Dropdown } from 'antd'
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
  Fade,
  ClickAwayListener,
  Divider,
  Fab,
  Slide,
  Drawer,
} from '@material-ui/core'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import TimerIcon from '@material-ui/icons/Timer'

import {
  CardContainer,
  TextField,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  NumberFormatter,
  confirm,
  SizeContainer,
  Popconfirm,
  withFormikExtend,
  FastField,
  NumberInput,
  Skeleton,
} from '@/components'
import Authorized from '@/utils/Authorized'
import PatientBanner from '@/pages/PatientDashboard/Banner'

import { consultationDocumentTypes, orderTypes } from '@/utils/codes'
import { getAppendUrl, navigateDirtyCheck } from '@/utils/utils'
// import model from '@/pages/Widgets/Orders/models'
import { convertToConsultation } from './utils'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
// import Test from './Test'
import Layout from './Layout'

import schema from './schema'
import styles from './style'

// window.g_app.replaceModel(model)

const discardMessage = 'Discard consultation?'
const formName = 'ConsultationPage'
const saveConsultation = ({
  props,
  action,
  confirmMessage,
  successMessage,
}) => {
  const {
    dispatch,
    values,
    consultation,
    consultationDocument = {},
    orders = {},
  } = props
  dispatch({
    type: 'global/updateAppState',
    payload: {
      openConfirm: true,
      openConfirmContent: confirmMessage,
      openConfirmText: 'Confirm',
      onConfirmSave: () => {
        const newValues = convertToConsultation(
          {
            ...values,
            corDiagnosis: [
              ...values.corDiagnosis.filter(
                (diagnosis) => diagnosis.diagnosisFK !== undefined,
              ),
            ],
          },
          {
            orders,
            consultationDocument,
          },
        )
        newValues.duration = Math.floor(
          Number(sessionStorage.getItem(`${values.id}_consultationTimer`)) || 0,
        )
        if (!newValues.visitConsultationTemplate) {
          newValues.visitConsultationTemplate = {}
        }
        newValues.visitConsultationTemplate.consultationTemplate =
          localStorage.getItem('consultationLayout') || ''
        dispatch({
          type: `consultation/${action}`,
          payload: newValues,
        }).then((r) => {
          if (r) {
            if (successMessage) {
              notification.success({
                message: successMessage,
              })
            }
            sessionStorage.removeItem(`${values.id}_consultationTimer`)
          }
        })
      },
    },
  })
}

const discardConsultation = ({
  dispatch,
  values,
  onClose,
  consultation,
  resetForm,
}) => {
  // console.log(values)
  if (values.id) {
    // dispatch({
    //   type: 'global/updateAppState',
    //   payload: {
    //     openConfirm: true,
    //     openConfirmContent: 'Discard consultation?',
    //     openConfirmText: 'Confirm',
    //     onConfirmSave: () => {

    //     },
    //   },
    // })
    dispatch({
      type: 'consultation/discard',
      payload: values.id,
    })
  } else {
    dispatch({
      type: 'consultation/discard',
    })
  }
}

// const getRights = (values) => {
//   return {
//     view: {
//       name: 'consultation.view',
//       rights: values.status === 'PAUSED' ? 'disable' : 'enable',
//     },
//     edit: {
//       name: 'consultation.edit',
//       rights: values.status === 'PAUSED' ? 'disable' : 'enable',
//     },
//   }
// }

// @skeleton()
@connect(
  ({
    consultation,
    global,
    consultationDocument,
    orders,
    visitRegistration,
    formik,
    cestemplate,
  }) => ({
    consultation,
    global,
    consultationDocument,
    orders,
    visitRegistration,
    formik,
    cestemplate,
  }),
)
@withFormikExtend({
  authority: [
    'patientdashboard.startresumeconsultation',
    'patientdashboard.editconsultation',
  ],
  mapPropsToValues: ({ consultation = {} }) => {
    // console.log('mapPropsToValues', consultation.entity, disabled, reset)
    // console.log(consultation.entity, consultation.default)
    return consultation.entity || consultation.default
  },
  validationSchema: schema,
  enableReinitialize: false,
  dirtyCheckMessage: discardMessage,
  notDirtyDuration: 0, // this page should alwasy show warning message when leave
  onDirtyDiscard: discardConsultation,
  handleSubmit: (values, { props }) => {
    saveConsultation({
      props: {
        values,
        ...props,
      },
      confirmMessage: 'Confirm sign off current consultation?',
      successMessage: 'Consultation signed',
      action: 'sign',
    })
  },
  displayName: formName,
})
class Main extends React.Component {
  state = {
    recording: true,
  }

  componentDidMount () {
    // console.log('Main')
    setTimeout(() => {
      this.props.setFieldValue('fakeField', 'setdirty')
    }, 500)
  }

  shouldComponentUpdate = (nextProps) => {
    if (nextProps.values.id !== this.props.values.id) return true
    if (nextProps.consultation.version !== this.props.consultation.version)
      return true
    if (
      nextProps.visitRegistration.version !==
      this.props.visitRegistration.version
    )
      return true
    if (
      nextProps.orders.summary.totalWithGST !==
      this.props.orders.summary.totalWithGST
    )
      return true
    return false
  }

  // constructor (props) {
  //   super(props)
  //   discardConsultation = discardConsultation.bind(this)
  // }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { global } = nextProps
  //   // console.log(value)
  //   if (global.collapsed !== preState.collapsed) {
  //     return {
  //       collapsed: global.collapsed,
  //       currentLayout: _.cloneDeep(preState.currentLayout),
  //     }
  //   }

  //   return null
  // }

  showInvoiceAdjustment = () => {
    const { theme, ...resetProps } = this.props
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          showRemark: true,
          defaultValues: {
            initialAmout: 150,
          },
        },
      },
    })
  }

  pauseConsultation = () => {
    saveConsultation({
      props: this.props,
      confirmMessage: 'Pause consultation?',
      successMessage: 'Consultation paused',
      action: 'pause',
    })
  }

  resumeConsultation = () => {
    const {
      dispatch,
      values,
      consultation,
      resetForm,
      user,
      visitRegistration,
    } = this.props
    dispatch({
      type: 'consultation/resume',
      payload: {
        id: visitRegistration.entity.visit.id,
        // version: Date.now(),
      },
    }).then((r) => {
      if (r) {
        notification.success({
          message: 'Consultation resumed',
        })
        resetForm(r)
        router.push(
          getAppendUrl({
            v: Date.now(),
          }),
        )
      }
    })
  }

  // discardConsultation =

  getExtraComponent = () => {
    const {
      theme,
      classes,
      values,
      orders = {},
      visitRegistration,
    } = this.props
    const { entity: vistEntity } = visitRegistration
    if (!vistEntity) return null
    const { visit = {} } = vistEntity
    const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    // console.log('values', values, this.props)
    // console.log(currentLayout)

    // console.log(state.currentLayout)

    return (
      <SizeContainer size='sm'>
        <div
          style={{
            textAlign: 'center',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            height: '100%',
          }}
        >
          <GridContainer
            // className={classes.actionPanel}
            direction='column'
            justify='space-evenly'
            alignItems='center'
          >
            <Authorized authority='patientdashboard.startresumeconsultation'>
              {({ rights }) => {
                //
                return rights === 'enable' &&
                [
                  'IN CONS',
                  'WAITING',
                ].includes(visit.visitStatus) &&
                values.id ? (
                  <GridItem>
                    <h5 style={{ marginTop: -3, fontWeight: 'bold' }}>
                      <Timer
                        initialTime={
                          Number(
                            sessionStorage.getItem(
                              `${values.id}_consultationTimer`,
                            ),
                          ) ||
                          values.duration ||
                          0
                        }
                        direction='forward'
                        startImmediately={this.state.recording}
                      >
                        {({
                          start,
                          resume,
                          pause,
                          stop,
                          reset,
                          getTimerState,
                          getTime,
                        }) => {
                          sessionStorage.setItem(
                            `${values.id}_consultationTimer`,
                            getTime(),
                          )
                          return (
                            <React.Fragment>
                              <TimerIcon
                                style={{
                                  height: 17,
                                  top: 2,
                                  left: -5,
                                  position: 'relative',
                                }}
                              />
                              <Timer.Hours
                                formatValue={(value) =>
                                  `${numeral(value).format('00')} : `}
                              />
                              <Timer.Minutes
                                formatValue={(value) =>
                                  `${numeral(value).format('00')} : `}
                              />
                              <Timer.Seconds
                                formatValue={(value) =>
                                  `${numeral(value).format('00')}`}
                              />

                              {/* {!this.state.recording && (
                      <IconButton
                        style={{ padding: 0, top: -1, right: -6 }}
                        onClick={() => {
                          resume()
                          this.setState({
                            recording: true,
                          })
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    )}
                    {this.state.recording && (
                      <IconButton
                        style={{ padding: 0, top: -1, right: -6 }}
                        onClick={() => {
                          pause()
                          this.setState({
                            recording: false,
                          })
                        }}
                      >
                        <Pause />
                      </IconButton>
                    )} */}
                            </React.Fragment>
                          )
                        }}
                      </Timer>
                    </h5>
                  </GridItem>
                ) : null
              }}
            </Authorized>
            <GridItem>
              <h4 style={{ position: 'relative', marginTop: 0 }}>
                Total Invoice
                {summary && (
                  <span>
                    &nbsp;:&nbsp;
                    <NumberInput text currency value={summary.totalWithGST} />
                  </span>
                )}
              </h4>
            </GridItem>
            <GridItem>
              {values.status !== 'PAUSED' && (
                <ProgressButton
                  color='danger'
                  onClick={navigateDirtyCheck({
                    displayName: formName,
                    redirectUrl: '/reception/queue',
                  })}
                  icon={null}
                >
                  Discard
                </ProgressButton>
              )}
              <Authorized authority='patientdashboard.startresumeconsultation'>
                <React.Fragment>
                  {[
                    'IN CONS',
                    'WAITING',
                  ].includes(visit.visitStatus) && (
                    <ProgressButton
                      onClick={this.pauseConsultation}
                      color='info'
                      icon={null}
                    >
                      Pause
                    </ProgressButton>
                  )}
                  {visit.visitStatus === 'PAUSED' && (
                    <ProgressButton
                      onClick={this.resumeConsultation}
                      color='info'
                      icon={null}
                    >
                      Resume
                    </ProgressButton>
                  )}
                </React.Fragment>
              </Authorized>

              <ProgressButton
                color='primary'
                onClick={this.props.handleSubmit}
                icon={null}
              >
                Sign Off
              </ProgressButton>
            </GridItem>
          </GridContainer>
        </div>
      </SizeContainer>
    )
  }

  saveLayout = (layout) => {
    this.props
      .dispatch({
        type: 'consultation/saveLayout',
        payload: layout,
      })
      .then((o) => {
        if (o)
          notification.success({
            message: 'My favourite widget layout saved',
          })
      })
  }

  loadTemplate = (v) => {
    const exist = this.props.values
    // console.log(exist, v)
    // v.id = exist.id
    // v.concurrencyToken = exist.concurrencyToken
    const mergeArrayProps = [
      'corCertificateOfAttendance',
      'corConsumable',
      'corDiagnosis',
      'corMedicalCertificate',
      'corMemo',
      'corOrderAdjustment',
      'corOtherDocuments',
      'corPrescriptionItem',
      'corReferralLetter',
      'corService',
      'corVaccinationCert',
      'corVaccinationItem',
    ]
    mergeArrayProps.forEach((p) => {
      exist[p] = [
        ...exist[p],
        ...v[p],
      ]
    })
    if (v.corDoctorNote && v.corDoctorNote.length) {
      if (exist.corDoctorNote && exist.corDoctorNote.length) {
        exist.corDoctorNote[0].chiefComplaints = `${exist.corDoctorNote[0]
          .chiefComplaints}<br/>${v.corDoctorNote[0].chiefComplaints}`
        exist.corDoctorNote[0].clinicianNote = `${exist.corDoctorNote[0]
          .clinicianNote}<br/>${v.corDoctorNote[0].clinicianNote}`
        exist.corDoctorNote[0].plan = `${exist.corDoctorNote[0].plan}<br/>${v
          .corDoctorNote[0].plan}`
      } else {
        exist.corDoctorNote = [
          ...v.corDoctorNote,
        ]
      }
    }
    // console.log(exist)
    // this.props.resetForm(v)
    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity: exist,
        version: Date.now(),
      },
    })
    this.props.dispatch({
      type: 'consultation/queryDone',
      payload: {
        data: exist,
      },
    })
  }

  saveTemplate = () => {
    const { dispatch, orders, consultationDocument, values } = this.props
    dispatch({
      type: 'consultation/updateState',
      payload: {
        entity: convertToConsultation(values, {
          orders,
          consultationDocument,
        }),
      },
    })
  }

  // // eslint-disable-next-line camelcase
  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   // console.log('UNSAFE_componentWillReceiveProps', this.props, nextProps)
  //   // console.log(
  //   //   nextProps.consultation,
  //   //   nextProps.consultation.consultationID,
  //   //   this.props.consultation.consultationID !==
  //   //     nextProps.consultation.consultationID,
  //   // )
  //   if (
  //     nextProps.consultation &&
  //     nextProps.consultation.entity &&
  //     nextProps.consultation.entity.concurrencyToken !==
  //       nextProps.values.concurrencyToken
  //   ) {
  //     nextProps.resetForm(nextProps.consultation.entity)
  //   }
  // }

  // componentWillUnmount () {
  //   this.props.dispatch({
  //     type: 'formik/updateState',
  //     payload: {
  //       ConsultationPage: undefined,
  //       ConsultationDocumentList: undefined,
  //       OrderPage: undefined,
  //     },
  //   })
  // }

  render () {
    const { props, state } = this
    const {
      classes,
      theme,
      dispatch,
      values,
      visitRegistration,
      consultation = {},
      orders = {},
      formik,
      rights,
      ...resetProps
    } = this.props
    const { entity } = consultation
    const { entity: vistEntity } = visitRegistration
    if (!vistEntity) return null
    const { visit = {} } = vistEntity
    // const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    // console.log('values', values, this.props)
    // console.log(currentLayout)

    const matches = {
      rights:
        rights === 'enable' && visit.visitStatus === 'PAUSED'
          ? 'disable'
          : rights,
    }
    // console.log(matches)

    return (
      <div className={classes.root}>
        <PatientBanner extraCmt={this.getExtraComponent()} {...this.props} />
        <Authorized.Context.Provider value={matches}>
          <Layout
            {...this.props}
            rights={matches.rights}
            onSaveLayout={this.saveLayout}
            onLoadTemplate={this.loadTemplate}
            onSaveTemplate={this.saveTemplate}
            userDefaultLayout={values.visitConsultationTemplate}
          />
        </Authorized.Context.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Main)
