import React from 'react'
// dva
import { connect } from 'dva'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
import router from 'umi/router'
// formik
import { withFormik } from 'formik'
// class names
import classNames from 'classnames'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Stop from '@material-ui/icons/Stop'

// custom components
import {
  Card,
  CardHeader,
  CardBody,
  CommonModal,
  PageHeaderWrapper,
  Button,
  ProgressButton,
  notification,
} from '@/components'
// current page sub components
import EndSessionSummary from '@/pages/Report/SessionSummary/Details/index'
// utils
import { getAppendUrl, getRemovedUrl } from '@/utils/utils'
import { SendNotification } from '@/utils/notification'
import Authorized from '@/utils/Authorized'
import { QueueDashboardButton } from '@/components/_medisys'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { FORM_CATEGORY, VALUE_KEYS, VISIT_TYPE } from '@/utils/constants'
import { initRoomAssignment } from '@/utils/codes'
import {
  modelKey,
  AppointmentContextMenu,
  ContextMenuOptions,
} from './variables'
import PatientSearchModal from './PatientSearch'
import DetailsGrid from './Grid'
import DetailsActionBar from './FilterBar'
import EmptySession from './EmptySession'
import VisitForms from './VisitForms'
import RightClickContextMenu from './Grid/RightClickContextMenu'

const drawerWidth = 400

const styles = (theme) => ({
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  sessionNo: {
    marginTop: 0,
    marginBottom: 0,
    float: 'left',
    color: 'black',
  },
  toolBtns: {
    float: 'right',
    paddingTop: 5,
  },
  // icon: {
  //   paddingTop: '0.5px',
  //   paddingBottom: '0.5px',
  // },
  cardIconTitle: {
    color: 'black',
  },
})

@connect(
  ({
    queueLog,
    patientSearch,
    loading,
    user,
    patient,
    queueCalling,
    codetable,
  }) => ({
    patientSearchResult: patientSearch.list,
    queueLog,
    loading,
    user: user.data,
    patient: patient.entity,
    DefaultPatientProfile: patient.default,
    queueCalling,
    codetable,
  }),
)
class Queue extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      _sessionInfoID: undefined,
      showPatientSearch: false,
      showEndSessionSummary: false,
      search: '',
      showForms: false,
      formCategory: undefined,
    }
    this._timer = null
  }

  componentWillMount = () => {
    const { dispatch, queueLog, history } = this.props
    const { location: { query } } = history
    const { sessionInfo } = queueLog
    dispatch({
      type: `${modelKey}initState`,
    })
    dispatch({
      type: `${modelKey}refresh`,
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctroom',
      },
    })

    initRoomAssignment()

    // dispatch({
    //   type: 'calendar/updateState',
    //   payload: {
    //     list: [],
    //   },
    // })

    // if (sessionInfo.id === '') {
    //   dispatch({
    //     type: `${modelKey}getSessionInfo`,
    //   })
    // } else {

    // }
    this._timer = setInterval(() => {
      dispatch({ type: `${modelKey}refresh` })
    }, 900000)
  }

  componentWillUnmount () {
    clearInterval(this._timer)
    this.props.dispatch({
      type: 'calendar/updateState',
      payload: {
        list: [],
      },
    })
  }

  showVisitRegistration = ({
    visitID = undefined,
    patientID = undefined,
    appointmentID = undefined,
    pdid = undefined,
    pdroomid = undefined,
  }) => {
    const parameter = {
      md: 'visreg',
    }
    if (patientID) parameter.pid = patientID
    if (visitID) parameter.vis = visitID
    if (appointmentID) parameter.apptid = appointmentID
    if (pdid) parameter.pdid = pdid
    if (pdroomid) parameter.pdroomid = pdroomid

    this.togglePatientSearch(false)
    this.props.history.push(getAppendUrl(parameter))
  }

  handleActualizeAppointment = ({
    patientID = undefined,
    appointmentID = undefined,
    primaryClinicianFK = undefined,
    primaryClinicianRoomFK = undefined,
  }) => {
    this.showVisitRegistration({
      patientID,
      appointmentID,
      pdid: primaryClinicianFK,
      pdroomid: primaryClinicianRoomFK,
    })
  }

  closeVisitRegistration = () => {
    this.props.dispatch({
      type: 'global/updateAppState',
      payload: {
        showVisitRegistration: false,
      },
    })
  }

  redirectToVisitRegistration = () => {
    const { patient } = this.props
    if (patient) {
      this.showVisitRegistration({
        patientID: patient.id,
      })
    }
  }

  updateAppointmentLinking = (row, patientProfileFK) => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/updateAppointmentLinking',
      payload: {
        id: row.id,
        patientProfileFK,
      },
    }).then((response) => {
      if (response) {
        dispatch({
          type: 'queueLog/refresh',
        })
      }
    })
  }

  toggleRegisterNewPatient = (shouldRedirect = true, row = undefined) => {
    if (row) {
      const { DefaultPatientProfile } = this.props
      this.props.dispatch({
        type: 'patient/updateDefaultEntity',
        payload: {
          name: row.patientName,
          callingName: row.patientName,
          contact: {
            ...DefaultPatientProfile.contact,
            mobileContactNumber: {
              ...DefaultPatientProfile.contact.mobileContactNumber,
              number: row.patientContactNo,
            },
          },
        },
      })
    }
    this.props.dispatch({
      type: 'patient/openPatientModal',
      payload: {
        callback: (patientProfileFK) => {
          this.props.dispatch({
            type: 'patient/closePatientModal',
          })
          if (shouldRedirect) this.redirectToVisitRegistration()
          if (row) this.updateAppointmentLinking(row, patientProfileFK)
        },
      },
    })
  }

  togglePatientSearch = (override) => {
    const { showPatientSearch } = this.state
    const target = !showPatientSearch
    this.setState({
      showPatientSearch: override === undefined ? target : override,
    })
    // closing patient search
    if (!target) {
      this.resetPatientSearchResult()
    }

    // opening patient search
    if (target) {
      this.props.dispatch({
        type: 'patient/updateState',
        payload: {
          callback: () => {
            this.props.dispatch({
              type: 'patient/closePatientModal',
            })
            this.redirectToVisitRegistration()
          },
        },
      })
    }
    this.props.history.push(
      getRemovedUrl([
        'v',
      ]),
    )
  }

  resetPatientSearchResult = () => {
    this.props.dispatch({
      type: 'patientSearch/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  onStartSession = () => {
    const { dispatch } = this.props
    this.setState({
      _sessionInfoID: undefined,
    })
    dispatch({
      type: `${modelKey}startSession`,
    })
  }

  onReopenLastSession = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${modelKey}reopenLastSession`,
    })
  }

  onEndSessionClick = () => {
    const { dispatch, queueLog } = this.props
    const { sessionInfo } = queueLog
    const { sessionNo } = sessionInfo
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmContent: `Are you sure to end current session (${sessionNo})`,
        onConfirmSave: this.onConfirmEndSession,
      },
    })
  }

  onConfirmEndSession = () => {
    const { queueLog, dispatch, queueCalling } = this.props
    const _sessionInfoID = queueLog.sessionInfo.id
    this.setState({ _sessionInfoID })
    dispatch({
      type: `queueLog/endSession`,
      sessionID: queueLog.sessionInfo.id,
    }).then(async (response) => {
      const { status } = response
      if (response) {
        dispatch({
          type: 'queueCalling/getExistingQueueCallList',
          payload: {
            keys: VALUE_KEYS.QUEUECALLING,
          },
        }).then((res) => {
          const { value, ...restRespValues } = res
          dispatch({
            type: 'queueCalling/upsertQueueCallList',
            payload: {
              ...restRespValues,
              key: VALUE_KEYS.QUEUECALLING,
              value: '[]',
            },
          })
        })

        this.setState(
          {
            showEndSessionSummary: true,
          },
          () => {
            // dispatch({
            //   type: 'queueLog/updateState',
            //   payload: ,
            // })
          },
        )
      }
    })
  }

  onEndSessionSummaryClose = () => {
    this.setState({ showEndSessionSummary: false })
  }

  onEnterPressed = async (searchQuery) => {
    const { dispatch } = this.props
    const prefix = 'like_'
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        // group: [
        //   {
        //     [`${prefix}name`]: searchQuery,
        //     [`${prefix}patientAccountNo`]: searchQuery,
        //     [`${prefix}patientReferenceNo`]: searchQuery,
        //     [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
        //     combineCondition: 'or',
        //   },
        // ],
        apiCriteria: {
          searchValue: searchQuery,
        },
      },
    })
    const hasSearchQuery = !!searchQuery
    this.showSearchResult(hasSearchQuery)
  }

  onContextMenu = (row, event) => {
    event.preventDefault()
    this.setState({
      rightClickedRow: row,
      anchorEl: {
        x: event.pageX,
        y: event.pageY,
      },
    })
  }

  onHideContextMenu = (e) => {
    if (
      e &&
      e.target &&
      (e.target.nodeName === 'svg' || e.target.nodeName === 'BUTTON')
    )
      return
    this.setState({
      rightClickedRow: undefined,
      anchorEl: undefined,
    })
  }

  deleteQueueConfirmation = (row) => {
    const { queueNo, id } = row
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmText: 'Confirm',
        openConfirmContent: `Are you sure want to delete this visit (Q No.: ${queueNo})?`,
        onConfirmSave: () => {
          dispatch({
            type: 'queueLog/deleteQueueByQueueID',
            payload: {
              id,
              queueNo,
            },
          })
        },
      },
    })
  }

  isAssignedDoctor = (row) => {
    if (!row.doctor) return false
    const { doctor: { id }, visitStatus } = row
    const { clinicianProfile: { doctorProfile } } = this.props.user

    if (!doctorProfile) {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return false
    }

    if (visitStatus === 'IN CONS') {
      if (id !== doctorProfile.id) {
        notification.error({
          message: `You cannot resume other doctor's consultation.`,
        })
        return false
      }
    }
    return true
  }

  canAccess = (id) => {
    const apptsActionID = [
      '8',
      '9',
    ]
    const findMatch = (item) => item.id === parseFloat(id, 10)

    let menuOpt = ContextMenuOptions.find(findMatch)

    if (apptsActionID.includes(id)) {
      menuOpt = AppointmentContextMenu.find(findMatch)
    }

    const accessRight = Authorized.check(menuOpt.authority)

    // skip for patient dashboard button
    // user can access patient dashboard regardless of access right
    // patient dashboard page will have the access right checking explicitly
    if (id === '4') return true

    return (
      accessRight &&
      (accessRight.rights === 'enable' || accessRight.rights === 'readwrite')
    )
  }

  onMenuItemClick = (row, id) => {
    const { dispatch } = this.props
    const hasAccess = this.canAccess(id)

    if (!hasAccess) {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return
    }
    dispatch({
      type: 'queueLog/updateState',
      payload: {
        statusTagClicked: true,
      },
    })
    switch (id) {
      case '0': // edit visit
      case '0.1': // view visit
        this.showVisitRegistration({
          visitID: row.id,
        })
        break
      case '1': {
        // dispense
        const isInitialLoading =
          row.visitPurposeFK === VISIT_TYPE.RETAIL &&
          row.visitStatus === 'WAITING'
        const version = Date.now()
        dispatch({
          type: `dispense/start`,
          payload: {
            id: row.visitFK,
            version,
            qid: row.id,
            queueNo: row.queueNo,
          },
        }).then((o) => {
          if (o)
            router.push(
              `/reception/queue/dispense?isInitialLoading=${isInitialLoading}&qid=${row.id}&vid=${row.visitFK}&v=${version}&pid=${row.patientProfileFK}`,
            )
        })

        break
      }
      case '1.1': {
        // billing
        const version = Date.now()
        const parameters = {
          vid: row.visitFK,
          pid: row.patientProfileFK,
          qid: row.id,
          v: version,
        }
        router.push(getAppendUrl(parameters, '/reception/queue/billing'))
        break
      }
      case '2': // delete visit
        this.deleteQueueConfirmation(row)
        break
      case '3': // view patient profile
        this.onViewPatientProfileClick(row.patientProfileFK, row.id)
        break
      case '4': // patient dashboard
        router.push(
          `/reception/queue/patientdashboard?qid=${row.id}&v=${Date.now()}`,
        )
        break
      case '5': {
        // start consultation
        const valid = this.isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()

          dispatch({
            type: `consultation/start`,
            payload: {
              id: row.visitFK,
              version,
              qid: row.id,
              queueNo: row.queueNo,
            },
          }).then((o) => {
            if (o)
              router.push(
                `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
              )
          })
        }
        break
      }
      case '6': {
        // resume consultation
        const valid = this.isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()

          if (row.visitStatus === 'PAUSED') {
            dispatch({
              type: `consultation/resume`,
              payload: {
                id: row.visitFK,
                version,
              },
            }).then((o) => {
              if (o)
                router.push(
                  `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
                )
            })
          } else {
            router.push(
              `/reception/queue/consultation?qid=${row.id}&cid=${row.clinicalObjectRecordFK}&v=${version}`,
            )
          }
        }

        break
      }
      case '7': {
        // edit consultation
        const valid = this.isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()

          dispatch({
            type: `consultation/edit`,
            payload: {
              id: row.visitFK,
              version,
            },
          }).then((o) => {
            if (o)
              if (o.updateByUserFK !== this.props.user.id) {
                const { clinicianprofile = [] } = this.props.codetable
                const editingUser = clinicianprofile.find(
                  (m) => m.userProfileFK === o.updateByUserFK,
                ) || {
                  name: 'Someone',
                }
                dispatch({
                  type: 'global/updateAppState',
                  payload: {
                    openConfirm: true,
                    openConfirmContent: `${editingUser.name} is currently editing the patient note, do you want to overwrite?`,
                    onConfirmSave: () => {
                      dispatch({
                        type: `consultation/overwrite`,
                        payload: {
                          id: row.visitFK,
                          version,
                        },
                      }).then((c) => {
                        router.push(
                          `/reception/queue/consultation?qid=${row.id}&cid=${c.id}&v=${version}`,
                        )
                      })
                    },
                  },
                })
              } else {
                router.push(
                  `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
                )
              }
          })
        }
        break
      }
      case '8': {
        const { clinicianprofile = [] } = this.props.codetable
        const doctorProfile = clinicianprofile.find(
          (item) => item.id === row.clinicianProfileFk,
        )
        this.handleActualizeAppointment({
          patientID: row.patientProfileFk,
          appointmentID: row.id,
          primaryClinicianFK: doctorProfile ? doctorProfile.id : undefined,
          primaryClinicianRoomFK: row.roomFk,
        })
        break
      }
      case '9':
        this.toggleRegisterNewPatient(false, row)
        break
      case '10':
        this.showVisitForms(row)
        break
      default:
        break
    }
    setTimeout(() => {
      dispatch({
        type: 'queueLog/updateState',
        payload: {
          statusTagClicked: false,
        },
      })
    }, 3000)
  }

  showSearchResult = (hasSearchQuery = false) => {
    const { patientSearchResult = [] } = this.props
    const totalRecords = patientSearchResult.length

    if (totalRecords === 1 && hasSearchQuery)
      return this.showVisitRegistration({
        patientID: patientSearchResult[0].id,
      })
    if (totalRecords >= 1) {
      return this.togglePatientSearch()
    }
    return this.toggleRegisterNewPatient()
  }

  onRefreshClick = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${modelKey}refresh`,
    })
  }

  onViewPatientProfileClick = (patientProfileFK, qid) => {
    this.props.history.push(
      getAppendUrl({
        md: 'pt',
        cmt: '1',
        pid: patientProfileFK,
        qid,
        v: Date.now(),
      }),
    )
  }

  setSearch = (v) => {
    this.setState({
      search: v,
    })
  }

  toggleForms = () => {
    const { showForms } = this.state
    const target = !showForms
    this.setState({
      showForms: target,
    })
    // closing Forms
    if (!target) {
      this.resetFormsResult()
    }
  }

  resetFormsResult = () => {
    this.props.dispatch({
      type: 'formListing/updateState',
      payload: {
        list: [],
      },
    })
  }

  showVisitForms = async (row) => {
    const {
      id,
      visitStatus,
      doctor,
      patientAccountNo,
      patientName,
      patientReferenceNo,
    } = row
    await this.props.dispatch({
      type: 'formListing/updateState',
      payload: {
        visitID: id,
        visitDetail: {
          visitID: id,
          doctorProfileFK: doctor ? doctor.id : 0,
          patientName,
          patientNRICNo: patientReferenceNo,
          patientAccountNo,
        },
      },
    })
    if (visitStatus === VISIT_STATUS.WAITING) {
      this.setState({ formCategory: FORM_CATEGORY.VISITFORM })
    } else {
      this.setState({ formCategory: FORM_CATEGORY.CORFORM })
    }
    this.toggleForms()
  }

  render () {
    const {
      classes,
      queueLog,
      loading,
      history,
      dispatch,
      queueCalling,
    } = this.props
    const {
      showEndSessionSummary,
      showPatientSearch,
      _sessionInfoID,
      search,
      showForms,
    } = this.state
    const { sessionInfo, error } = queueLog
    const { sessionNo, isClinicSessionClosed } = sessionInfo
    const { oriQCallList = [] } = queueCalling
    const [
      lastCall,
    ] = oriQCallList

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardHeader icon>
            <h3 className={classNames(classes.sessionNo)}>
              {`Session No.: ${sessionNo}`}
            </h3>

            <Authorized authority='openqueuedisplay'>
              {lastCall ? (
                <h4
                  className={classNames(classes.sessionNo)}
                  style={{
                    fontSize: 16,
                    marginTop: 10,
                    marginLeft: 10,
                    fontWeight: 'Bold',
                  }}
                >
                  <font color='red'>
                    NOW SERVING:{' '}
                    {lastCall.qNo.includes('.') ? (
                      lastCall.qNo
                    ) : (
                      `${lastCall.qNo}.0`
                    )}
                  </font>
                </h4>
              ) : (
                ''
              )}
            </Authorized>

            {!isClinicSessionClosed && (
              <div className={classNames(classes.toolBtns)}>
                <QueueDashboardButton size='sm' />
                <ProgressButton
                  color='info'
                  size='sm'
                  onClick={this.onRefreshClick}
                  submitKey={`${modelKey}refresh`}
                  icon={<Refresh />}
                >
                  Refresh
                </ProgressButton>

                <Authorized authority='queue.endsession'>
                  <ProgressButton
                    icon={<Stop />}
                    color='danger'
                    size='sm'
                    onClick={this.onEndSessionClick}
                  >
                    <FormattedMessage id='reception.queue.endSession' />
                  </ProgressButton>
                </Authorized>
              </div>
            )}
          </CardHeader>

          <Divider />
          <CardBody>
            {isClinicSessionClosed ? (
              <EmptySession
                handleStartSession={this.onStartSession}
                handleReopenLastSession={this.onReopenLastSession}
                sessionInfo={sessionInfo}
                loading={loading}
                errorState={error}
              />
            ) : (
              <div>
                <DetailsActionBar
                  // selfOnly={queueLog.selfOnly}
                  // onSwitchClick={this.toggleFilterSelfOnly}
                  onRegisterVisitEnterPressed={this.onEnterPressed}
                  toggleNewPatient={this.toggleRegisterNewPatient}
                  setSearch={this.setSearch}
                />
                <DetailsGrid
                  // onViewPatientProfileClick={this.onViewPatientProfileClick}
                  // onViewDispenseClick={this.toggleDispense}
                  // onRegisterPatientClick={this.toggleRegisterNewPatient}
                  // handleEditVisitClick={this.showVisitRegistration}
                  // handleActualizeAppointment={this.handleActualizeAppointment}
                  onMenuItemClick={this.onMenuItemClick}
                  onContextMenu={this.onContextMenu}
                  // handleFormsClick={this.showVisitForms}
                  history={history}
                  searchQuery={search}
                />
                <RightClickContextMenu
                  onMenuItemClick={this.onMenuItemClick}
                  onOutsidePopoverRightClick={this.onHideContextMenu}
                  anchorEl={this.state.anchorEl}
                  rightClickedRow={this.state.rightClickedRow}
                  dispatch={dispatch}
                />
              </div>
            )}
            <CommonModal
              open={showPatientSearch}
              title={formatMessage({ id: 'reception.queue.patientSearch' })}
              onClose={this.togglePatientSearch}
              onConfirm={this.togglePatientSearch}
              maxWidth='md'
              overrideLoading
            >
              <PatientSearchModal
                search={this.state.search}
                handleRegisterVisitClick={this.showVisitRegistration}
                onViewPatientProfileClick={this.onViewPatientProfileClick}
              />
            </CommonModal>
            <CommonModal
              open={showEndSessionSummary}
              title='Session Summary'
              onClose={this.onEndSessionSummaryClose}
              onConfirm={this.onEndSessionSummaryClose}
              disableBackdropClick
            >
              <EndSessionSummary sessionID={_sessionInfoID} />
            </CommonModal>
            <CommonModal
              open={showForms}
              title={
                this.state.formCategory === FORM_CATEGORY.VisitForms ? (
                  'Visit Forms'
                ) : (
                  'Forms'
                )
              }
              onClose={this.toggleForms}
              onConfirm={this.toggleForms}
              maxWidth='md'
              overrideLoading
            >
              <VisitForms formCategory={this.state.formCategory} />
            </CommonModal>
          </CardBody>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Queue)
