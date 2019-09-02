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
import { getAppendUrl } from '@/utils/utils'
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
import DetailsActionBar from './Details/DetailsActionBar'
import DetailsGrid from './Details/DetailsGrid'
import PatientSearchModal from './PatientSearch'
import EndSessionSummary from './Details/EndSessionSummary'
import { StatusIndicator, modelKey } from './variables'
// utils
import { SendNotification } from '@/utils/notification'

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
  patientSearch,
  queueLog,
  loading,
}))
@withFormik({ mapPropsToValues: () => ({}) })
class Queue extends PureComponent {
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

    if (sessionInfo.id === '') {
      dispatch({
        type: `${modelKey}getSessionInfo`,
      })
    }
    this._timer = setInterval(() => {
      dispatch({ type: `${modelKey}refresh` })
    }, 900000)
  }

  componentWillUnmount () {
    clearInterval(this._timer)
  }

  showVisitRegistration = ({ visitID = undefined, patientID = undefined }) => {
    const parameter = {
      md: 'visreg',
    }
    if (patientID) parameter.pid = patientID
    if (visitID) parameter.vis = visitID

    this.setState(
      {
        showPatientSearch: false,
      },
      () => this.props.history.push(getAppendUrl(parameter)),
    )
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

  togglePatientSearch = () => {
    const { showPatientSearch } = this.state
    this.setState({ showPatientSearch: !showPatientSearch })
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
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        [`${prefix}name`]: searchQuery,
        [`${prefix}patientAccountNo`]: searchQuery,
        [`${prefix}contactFkNavigation.contactNumber.number`]: searchQuery,
        combineCondition: 'or',
      },
    })
    this.showSearchResult()
  }

  showSearchResult = () => {
    const { patientSearch } = this.props
    const { list } = patientSearch

    if (list.length === 1)
      return this.showVisitRegistration({ patientID: list[0].id })
    if (list.length > 1) return this.setState({ showPatientSearch: true })

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
    const { classes, queueLog, loading } = this.props
    const {
      showEndSessionSummary,
      showPatientSearch,
      currentFilter,
    } = this.state

    const { sessionInfo, error } = queueLog
    const { sessionNo, isClinicSessionClosed } = sessionInfo

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
                  togglePatientSearch={this.togglePatientSearch}
                  toggleNewPatient={this.toggleRegisterNewPatient}
                />
                <DetailsGrid
                  onViewPatientProfileClick={this.onViewPatientProfileClick}
                  onViewDispenseClick={this.toggleDispense}
                  onRegisterPatientClick={this.toggleRegisterNewPatient}
                  handleEditVisitClick={this.showVisitRegistration}
                  currentFilter={currentFilter}
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
