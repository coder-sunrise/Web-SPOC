import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import _ from 'lodash'
import numeral from 'numeral'
import Timer from 'react-compound-timer'

import { withStyles } from '@material-ui/core'
import TimerIcon from '@material-ui/icons/Timer'
import {
  CommonModal,
  GridContainer,
  GridItem,
  notification,
  ProgressButton,
  SizeContainer,
  withFormikExtend,
  NumberInput,
} from '@/components'
import Authorized from '@/utils/Authorized'
import PatientBanner from '@/pages/PatientDashboard/Banner'

import {
  getAppendUrl,
  navigateDirtyCheck,
  commonDataReaderTransform,
} from '@/utils/utils'
import {
  convertToConsultation,
  convertConsultationDocument,
} from '@/pages/Consultation/utils'
// import model from '@/pages/Widgets/Orders/models'
import { VISIT_TYPE } from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { CallingQueueButton } from '@/components/_medisys'
import {
  initRoomAssignment,
  consultationDocumentTypes,
  ReportsOnSignOffOption,
} from '@/utils/codes'
import AutoPrintSelection from './autoPrintSelection'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
// import Test from './Test'
import Layout from './Layout'

import schema from './schema'
import styles from './style'
import { getDrugLabelPrintData } from '../Shared/Print/DrugLabelPrint'
// window.g_app.replaceModel(model)

const discardMessage = 'Discard consultation?'
const formName = 'ConsultationPage'

const generatePrintData = async (
  settings,
  consultationDocument,
  user,
  patient,
  orders,
  visitEntity,
) => {
  let documents = convertConsultationDocument(consultationDocument)
  const { autoPrintOnSignOff, autoPrintReportsOnSignOff } = settings

  if (autoPrintOnSignOff === true) {
    let reportsOnSignOff = autoPrintReportsOnSignOff.split(',')
    const {
      corMemo,
      corCertificateOfAttendance,
      corMedicalCertificate,
      corOtherDocuments,
      corReferralLetter,
      corVaccinationCert,
    } = documents
    let printData = []

    let doctor = user.data.clinicianProfile
    const doctorName = (doctor.title ? `${doctor.title} ` : '') + doctor.name
    const doctorMCRNo = doctor.doctorProfile
      ? doctor.doctorProfile.doctorMCRNo
      : ''
    const patientName = patient.entity.name
    const { patientAccountNo } = patient.entity

    let getPrintData = (type, list) => {
      if (list && list.length > 0) {
        const documentType = consultationDocumentTypes.find(
          (o) => o.name === type,
        )
        return list.filter((item) => !item.isDeleted).map((item) => ({
          item: type,
          description: `  ${item.subject || ''}`,
          Copies: 1,
          print: true,
          ReportId: documentType.downloadConfig.id,
          ReportData: `${JSON.stringify(
            commonDataReaderTransform(
              documentType.downloadConfig.draft({
                ...item,
                doctorName,
                doctorMCRNo,
                patientName,
                patientAccountNo,
              }),
            ),
          )}`,
        }))
      }
      return []
    }
    if (reportsOnSignOff.indexOf(ReportsOnSignOffOption.DrugLabel) > -1) {
      // const { versionNumber } = values
      // versionNumber === 1 &&
      if (orders && orders.rows) {
        const { rows = [] } = orders
        // prescriptionItems
        const prescriptionItems = rows.filter(
          (f) => f.type === '1' && !f.isDeleted,
        )
        let drugLabelData = await getDrugLabelPrintData(
          settings,
          patient.entity,
          visitEntity.id,
          prescriptionItems,
        )
        if (drugLabelData && drugLabelData.length > 0)
          printData = printData.concat(drugLabelData)
      }
    }
    if (reportsOnSignOff.indexOf(ReportsOnSignOffOption.Memo) > -1)
      printData = printData.concat(getPrintData('Memo', corMemo))
    if (
      reportsOnSignOff.indexOf(ReportsOnSignOffOption.MedicalCertificate) > -1
    )
      printData = printData.concat(
        getPrintData('Medical Certificate', corMedicalCertificate),
      )
    if (
      reportsOnSignOff.indexOf(ReportsOnSignOffOption.CertificateofAttendance) >
      -1
    )
      printData = printData.concat(
        getPrintData('Certificate of Attendance', corCertificateOfAttendance),
      )
    if (reportsOnSignOff.indexOf(ReportsOnSignOffOption.OtherDocuments) > -1)
      printData = printData.concat(getPrintData('Others', corOtherDocuments))
    if (reportsOnSignOff.indexOf(ReportsOnSignOffOption.ReferralLetter) > -1)
      printData = printData.concat(
        getPrintData('Referral Letter', corReferralLetter),
      )
    if (
      reportsOnSignOff.indexOf(ReportsOnSignOffOption.VaccinationCertificate) >
      -1
    )
      printData = printData.concat(
        getPrintData('Vaccination Certificate', corVaccinationCert),
      )
    return printData
  }
  return []
}
const saveConsultation = ({
  props,
  action,
  confirmMessage,
  successMessage,
  shouldPromptConfirm = true,
  successCallback = undefined,
}) => {
  const {
    dispatch,
    values,
    consultationDocument = {},
    corEyeRefractionForm,
    orders = {},
    forms = {},
  } = props
  const onConfirmSave = () => {
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
        corEyeRefractionForm,
        forms,
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
        if (successCallback) {
          successCallback()
        }
      }
    })
  }
  if (shouldPromptConfirm)
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: confirmMessage,
        openConfirmText: 'Confirm',
        onConfirmSave,
      },
    })
  else {
    onConfirmSave()
  }
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

// @skeleton()
@connect(
  ({
    clinicInfo,
    consultation,
    global,
    consultationDocument,
    orders,
    visitRegistration,
    formik,
    cestemplate,
    clinicSettings,
    user,
    patient,
    forms,
  }) => ({
    clinicInfo,
    consultation,
    global,
    consultationDocument,
    orders,
    visitRegistration,
    formik,
    cestemplate,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
    user,
    patient,
    forms,
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
  handleSubmit: async (values, { props }) => {
    const { versionNumber } = values
    const { dispatch, handlePrint } = props
    let printData = []
    if (versionNumber === 1) {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { autoPrintOnSignOff } = settings

      if (autoPrintOnSignOff === true) {
        const {
          consultationDocument = {},
          orders = {},
          visitRegistration: { entity: visitEntity },
          patient,
        } = props
        printData = await generatePrintData(
          settings,
          consultationDocument,
          props.user,
          patient,
          orders,
          visitEntity,
        )
      }
    }
    if (printData && printData.length > 0) {
      dispatch({
        type: 'consultation/showSignOffModal',
        payload: {
          showSignOffModal: true,
          printData,
          onSignOffConfirm: (result) => {
            saveConsultation({
              props: {
                values,
                ...props,
              },
              shouldPromptConfirm: false,
              action: 'sign',
              successCallback: () => {
                if (result && result.length > 0) {
                  dispatch({ type: `consultation/closeSignOffModal` })
                  let printedData = result
                  if (printedData && printedData.length > 0) {
                    const token = localStorage.getItem('token')
                    printedData = printedData.map((item) => ({
                      ReportId: item.ReportId,
                      DocumentName: `${item.item}(${item.description})`,
                      ReportData: item.ReportData,
                      Copies: item.Copies,
                      Token: token,
                      BaseUrl: process.env.url,
                    }))
                    handlePrint(JSON.stringify(printedData))
                  }
                }
                props.dispatch({ type: 'consultation/closeModal' })
              },
            })
          },
        },
      })
    } else {
      saveConsultation({
        props: {
          values,
          ...props,
        },
        confirmMessage: 'Confirm sign off current consultation?',
        successMessage: 'Consultation signed',
        action: 'sign',
        successCallback: () => {
          props.dispatch({ type: 'consultation/closeModal' })
        },
      })
    }
  },
  displayName: formName,
})
class Main extends React.Component {
  state = {
    recording: true,
  }

  componentDidMount () {
    // console.log('Main')
    initRoomAssignment()
    setTimeout(() => {
      this.props.setFieldValue('fakeField', 'setdirty')
    }, 500)
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity: undefined,
      },
    })
  }

  shouldComponentUpdate = (nextProps) => {
    if (nextProps.values.id !== this.props.values.id) return true
    if (nextProps.consultation.version !== this.props.consultation.version)
      return true
    if (
      nextProps.consultation.showSignOffModal !==
      this.props.consultation.showSignOffModal
    )
      return true
    if (
      nextProps.visitRegistration.version !==
      this.props.visitRegistration.version
    )
      return true
    if (
      nextProps.visitRegistration.entity.id !==
      this.props.visitRegistration.entity.id
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

  signOffAndCompleteBilling = () => {
    const { visitRegistration, dispatch, values } = this.props
    const { entity: vistEntity = {} } = visitRegistration
    const { visit = {} } = vistEntity
    const { id: visitId } = visit
    const successCallback = () => {
      dispatch({ type: 'consultation/closeModal' })
      dispatch({
        type: 'consultation/completeBillFirstOrder',
        payload: {
          id: visitId,
        },
      })
    }
    saveConsultation({
      props: {
        values,
        ...this.props,
      },
      successMessage: 'Consultation signed',
      shouldPromptConfirm: false,
      action: 'sign',
      successCallback,
    })
  }

  signOffOnly = () => {
    const { values, dispatch } = this.props

    saveConsultation({
      props: {
        values,
        ...this.props,
      },
      successMessage: 'Consultation signed',
      shouldPromptConfirm: false,
      action: 'sign',
      successCallback: () => {
        dispatch({ type: 'consultation/closeModal' })
      },
    })
  }

  handleSignOffClick = () => {
    const {
      visitRegistration,
      orders,
      dispatch,
      handleSubmit,
      values,
      forms,
    } = this.props
    const { rows, _originalRows } = orders
    const { entity: vistEntity = {} } = visitRegistration
    const { visit = {} } = vistEntity
    const {
      visitPurposeFK = VISIT_TYPE.CONS,
      visitStatus = VISIT_STATUS.DISPENSE,
    } = visit

    const isModifiedOrder = _.isEqual(
      rows.filter((i) => !(i.id === undefined && i.isDeleted)),
      _originalRows,
    )
    if (forms.rows.filter((o) => o.statusFK === 1).length > 0) {
      notification.warning({
        message: `Please finalize all forms.`,
      })
      return
    }

    if (
      visitPurposeFK === VISIT_TYPE.BILL_FIRST &&
      visitStatus === VISIT_STATUS.BILLING &&
      isModifiedOrder
    ) {
      dispatch({
        type: 'global/updateState',
        payload: {
          showCustomConfirm: true,
          customConfirmCfg: {
            title: 'Confirm',
            content: 'Do you want to complete the visit?',
            actions: [
              {
                text: 'Cancel',
                color: 'danger',
                onClick: () => {
                  // do nothing
                },
              },
              {
                text: 'No',
                color: 'danger',
                onClick: this.signOffOnly,
              },
              {
                text: 'Yes',
                color: 'primary',
                onClick: this.signOffAndCompleteBilling,
              },
            ],
          },
        },
      })
    } else {
      handleSubmit()
    }
  }

  // discardConsultation =

  getExtraComponent = () => {
    const {
      theme,
      classes,
      values,
      orders = {},
      visitRegistration,
      clinicSettings,
    } = this.props
    const { entity: vistEntity = {} } = visitRegistration
    // if (!vistEntity) return null
    const { visit = {}, queueNo } = vistEntity
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
            {clinicSettings.showTotalInvoiceAmtInConsultation ? (
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
            ) : null}
            <GridItem style={{ display: 'flex' }}>
              <Authorized authority='openqueuedisplay'>
                <div style={{ marginRight: 10 }}>
                  <CallingQueueButton
                    qId={queueNo}
                    roomNo={visit.roomFK}
                    doctor={visit.doctorProfileFK}
                  />
                </div>
              </Authorized>
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
                onClick={this.handleSignOffClick}
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
    if (v.corDoctorNote && v.corDoctorNote.length > 0) {
      if (exist.corDoctorNote && exist.corDoctorNote.length > 0) {
        const {
          chiefComplaints = '',
          clinicianNote = '',
          plan = '',
        } = exist.corDoctorNote[0]

        if (chiefComplaints)
          exist.corDoctorNote[0].chiefComplaints = `${chiefComplaints}<br/>${v
            .corDoctorNote[0].chiefComplaints}`
        else
          exist.corDoctorNote[0].chiefComplaints =
            v.corDoctorNote[0].chiefComplaints

        if (clinicianNote)
          exist.corDoctorNote[0].clinicianNote = `${clinicianNote}<br/>${v
            .corDoctorNote[0].clinicianNote}`
        else
          exist.corDoctorNote[0].clinicianNote =
            v.corDoctorNote[0].clinicianNote

        if (plan)
          exist.corDoctorNote[0].plan = `${plan}<br/>${v.corDoctorNote[0].plan}`
        else exist.corDoctorNote[0].plan = v.corDoctorNote[0].plan
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
    const { dispatch, orders, consultationDocument, values, forms } = this.props
    dispatch({
      type: 'consultation/updateState',
      payload: {
        entity: convertToConsultation(values, {
          orders,
          consultationDocument,
          forms,
        }),
      },
    })
  }

  onCloseSignOffModal = () => {
    this.props.dispatch({ type: `consultation/closeSignOffModal` })
  }

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
  componentWillUnmount () {
    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity: undefined,
      },
    })
  }

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
      disabled,
      ...resetProps
    } = this.props
    const {
      entity,
      showSignOffModal,
      printData,
      onSignOffConfirm,
    } = consultation
    const { entity: vistEntity = {} } = visitRegistration
    // if (!vistEntity) return null
    const { visit = {} } = vistEntity
    // const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    const matches = {
      rights:
        rights === 'enable' && visit.visitStatus === 'PAUSED'
          ? 'disable'
          : rights,
    }
    // console.log(matches)
    // console.log('main', { values })
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
        <CommonModal
          cancelText='Cancel'
          maxWidth='xs'
          title='Confirm sign off current consultation?'
          onClose={this.onCloseSignOffModal}
          open={showSignOffModal}
        >
          <AutoPrintSelection
            data={printData}
            handleSubmit={onSignOffConfirm}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Main)
