import React, { PureComponent } from 'react'
// dva
import { connect } from 'dva'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
// formik
import { withFormik } from 'formik'
// class names
import classNames from 'classnames'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import { Refresh, Stop } from '@material-ui/icons'
// custom components
import {
  Card,
  CardHeader,
  CardBody,
  CommonModal,
  PageHeaderWrapper,
  Button,
  ProgressButton,
} from '@/components'
// current page sub components
import EmptySession from './EmptySession'
import DetailsActionBar from './Filterbar'
import DetailsGrid from './Grid'
import EndSessionSummary from './SessionSummary'
import PatientSearchModal from './PatientSearch'
import { StatusIndicator, modelKey } from './variables'
// utils
import { getAppendUrl, getRemovedUrl } from '@/utils/utils'
import { SendNotification } from '@/utils/notification'
// services
import { queryList as queryPatientList } from '@/services/patient'

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

@connect(({ queueLog, patientSearch, loading }) => ({
  patientSearchResult: patientSearch.list,
  queueLog,
  loading,
}))
@withFormik({ mapPropsToValues: () => ({}) })
class Queue extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPatientSearch: false,
      showEndSessionSummary: false,
      currentFilter: StatusIndicator.ALL,
    }
    this._timer = null
  }

  componentWillMount = () => {
    const { dispatch, queueLog } = this.props
    const { sessionInfo } = queueLog
    dispatch({
      type: 'calendar/updateState',
      payload: {
        list: [],
      },
    })
    if (sessionInfo.id === '') {
      dispatch({
        type: `${modelKey}getSessionInfo`,
      })
    } else {
      dispatch({
        type: `${modelKey}refresh`,
      })
    }
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
  }) => {
    const parameter = {
      md: 'visreg',
    }
    if (patientID) parameter.pid = patientID
    if (visitID) parameter.vis = visitID
    if (appointmentID) parameter.apptid = appointmentID

    this.togglePatientSearch(false)
    this.props.history.push(getAppendUrl(parameter))
  }

  handleActualizeAppointment = ({
    patientID = undefined,
    appointmentID = undefined,
  }) => {
    this.showVisitRegistration({ patientID, appointmentID })
  }

  closeVisitRegistration = () => {
    this.props.dispatch({
      type: 'global/updateAppState',
      payload: {
        showVisitRegistration: false,
      },
    })
  }

  toggleRegisterNewPatient = () => {
    this.props.dispatch({
      type: 'patient/openPatientModal',
    })
  }

  togglePatientSearch = (override) => {
    const { showPatientSearch } = this.state
    this.setState({
      showPatientSearch: override === undefined ? !showPatientSearch : override,
    })
    this.props.history.push(
      getRemovedUrl([
        'v',
      ]),
    )
  }

  onStartSession = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${modelKey}startSession`,
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
        onOpenConfirm: this.onConfirmEndSession,
      },
    })
  }

  onConfirmEndSession = () => {
    const { queueLog, dispatch } = this.props
    dispatch({
      type: `${modelKey}endSession`,
      sessionID: queueLog.sessionInfo.id,
    })
  }

  onEndSessionSummaryClose = () => {
    this.setState({ showEndSessionSummary: false })
  }

  onEnterPressed = async (searchQuery) => {
    const { dispatch } = this.props
    const prefix = 'like_'
    // const result = await queryPatientList({
    //   [`${prefix}name`]: searchQuery,
    //   [`${prefix}patientAccountNo`]: searchQuery,
    //   [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
    //   combineCondition: 'or',
    // })
    // if (result && result.data) this.showSearchResult(result.data)
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        version: Date.now(),
        [`${prefix}name`]: searchQuery,
        [`${prefix}patientAccountNo`]: searchQuery,
        [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
        combineCondition: 'or',
      },
    })
    this.showSearchResult()
    // dispatch({
    //   type: 'queueLog/searchPatient',
    //   payload: { searchQuery },
    // }).then((response) => {
    //   console.log({ response })
    //   this.showSearchResult()
    // })
  }

  showSearchResult = () => {
    const { patientSearchResult = [] } = this.props
    console.log('querydone', { patientSearchResult })
    const totalRecords = patientSearchResult.length
    if (totalRecords === 1)
      return this.showVisitRegistration({
        patientID: patientSearchResult[0].id,
      })
    if (totalRecords > 1) {
      this.props.history.push(
        getAppendUrl({
          v: Date.now(),
        }),
      )
      return this.setState({ showPatientSearch: true })
    }
    return this.toggleRegisterNewPatient()
  }

  onRefreshClick = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${modelKey}refresh`,
    })
  }

  onViewPatientProfileClick = (patientProfileFK) => {
    this.props.history.push(
      getAppendUrl({
        md: 'pt',
        cmt: '1',
        pid: patientProfileFK,
      }),
    )
  }

  sendNotification = () => {
    // this.props.dispatch({
    //   type: 'global/sendNotification',
    //   payload: {
    //     type: 'QueueListing',
    //     data: {
    //       sender: 'queue_listing',
    //       message: 'test test',
    //     },
    //   },
    // })
    SendNotification({ test: '123' })
  }

  render () {
    const { classes, queueLog, loading, history } = this.props
    const {
      showEndSessionSummary,
      showPatientSearch,
      currentFilter,
    } = this.state

    const { sessionInfo, error } = queueLog
    const { sessionNo, isClinicSessionClosed } = sessionInfo
    console.log({ patientSearchResult: this.props.patientSearchResult })
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardHeader icon>
            <h3 className={classNames(classes.sessionNo)}>
              {`Queue (Session No.: ${sessionNo})`}
            </h3>
            {!isClinicSessionClosed && (
              <div className={classNames(classes.toolBtns)}>
                <ProgressButton
                  color='info'
                  size='sm'
                  onClick={this.onRefreshClick}
                  submitKey={`${modelKey}refresh`}
                  icon={<Refresh />}
                >
                  Refresh
                </ProgressButton>
                {/* <Button
                  color='success'
                  size='sm'
                  onClick={this.sendNotification}
                >
                  Send Notification
                </Button> */}
                <Button
                  color='danger'
                  size='sm'
                  onClick={this.onEndSessionClick}
                >
                  <Stop />
                  <FormattedMessage id='reception.queue.endSession' />
                </Button>
              </div>
            )}
          </CardHeader>

          <Divider />
          <CardBody>
            {isClinicSessionClosed ? (
              <EmptySession
                handleStartSession={this.onStartSession}
                sessionInfo={sessionInfo}
                loading={loading}
                errorState={error}
              />
            ) : (
              <React.Fragment>
                <DetailsActionBar
                  onRegisterVisitEnterPressed={this.onEnterPressed}
                  toggleNewPatient={this.toggleRegisterNewPatient}
                />
                <DetailsGrid
                  onViewPatientProfileClick={this.onViewPatientProfileClick}
                  onViewDispenseClick={this.toggleDispense}
                  onRegisterPatientClick={this.toggleRegisterNewPatient}
                  handleEditVisitClick={this.showVisitRegistration}
                  handleActualizeAppointment={this.handleActualizeAppointment}
                  currentFilter={currentFilter}
                  history={history}
                />
              </React.Fragment>
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
              <EndSessionSummary />
            </CommonModal>
          </CardBody>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Queue)
