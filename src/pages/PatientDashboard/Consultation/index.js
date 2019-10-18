import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
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
  Popper,
  Fade,
  ClickAwayListener,
  Divider,
  Fab,
  Slide,
  Tooltip,
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

import { consultationDocumentTypes, orderTypes } from '@/utils/codes'
import { getAppendUrl } from '@/utils/utils'
import model from '@/pages/Widgets/Orders/models'
import { convertToConsultation } from './utils'
// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'
// import Test from './Test'
import Layout from './Layout'

import schema from './schema'
import styles from './style'

window.g_app.replaceModel(model)

const saveConsultation = ({
  props,
  action,
  confirmMessage,
  successMessage,
}) => {
  const {
    dispatch,
    values,
    history,
    consultation,
    consultationDocument = {},
    orders = {},
  } = props
  dispatch({
    type: 'global/updateAppState',
    payload: {
      openConfirm: true,
      openConfirmContent: confirmMessage,
      onConfirmText: 'Confirm',
      onConfirmSave: () => {
        const newValues = convertToConsultation(values, {
          orders,
          consultationDocument,
        })
        newValues.duration = Math.floor(
          Number(sessionStorage.getItem(`${values.id}_consultationTimer`)) || 0,
        )
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
            // history.push(`/reception/queue`)
          }
        })
      },
    },
  })
}

// const getRights = (values) => {
//   return {
//     view: {
//       name: 'consultation.view',
//       rights: values.status === 'Paused' ? 'disable' : 'enable',
//     },
//     edit: {
//       name: 'consultation.edit',
//       rights: values.status === 'Paused' ? 'disable' : 'enable',
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
  authority: 'patientdashboard.startresumeconsultation',
  mapPropsToValues: ({ consultation = {} }) => {
    // console.log('mapPropsToValues', consultation.entity, disabled, reset)
    // console.log(consultation.entity, consultation.default)
    return consultation.entity || consultation.default
  },
  validationSchema: schema,
  // enableReinitialize: true,

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
  displayName: 'ConsultationPage',
})
class Consultation extends PureComponent {
  // constructor (props) {
  //   super(props)
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

  state = {
    recording: true,
  }

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
      history,
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
        history.push(
          getAppendUrl({
            v: Date.now(),
          }),
        )
      }
    })
  }

  discardConsultation = () => {
    const {
      dispatch,
      values,
      history,
      onClose,
      consultation,
      resetForm,
    } = this.props
    if (values.id) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: 'Discard consultation?',
          openConfirmText: 'Confirm',
          onConfirmSave: () => {
            dispatch({
              type: 'consultation/discard',
              payload: values.id,
            })
          },
        },
      })
    } else {
      dispatch({
        type: 'consultation/discard',
      })
    }
  }

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
                return rights === 'enable'
                  ? [
                      'IN CONS',
                      'WAITING',
                    ].includes(visit.visitStatus) && (
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
                    )
                  : null
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
              {values.status !== 'Paused' && (
                <ProgressButton
                  color='danger'
                  onClick={this.discardConsultation}
                >
                  Discard
                </ProgressButton>
              )}
              <Authorized authority='patientdashboard.startresumeconsultation'>
                <React.Fragment>
                  {values.status !== 'Paused' &&
                  [
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
                  {values.status === 'Paused' && (
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

  render () {
    const { props, state } = this
    const {
      history,
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
    const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    // console.log('values', values, this.props)
    // console.log(currentLayout)

    // console.log(rights)
    const matches = {
      rights:
        rights === 'enable' && values.status === 'Paused' ? 'disable' : rights,
    }
    return (
      <div className={classes.root} ref={this.container}>
        <Banner
          style={{}}
          extraCmt={this.getExtraComponent()}
          {...this.props}
        />
        <Authorized.Context.Provider value={matches}>
          <Layout
            {...this.props}
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

export default withStyles(styles, { withTheme: true })(Consultation)
