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
  confirm,
} from '@/components'

// current page sub components
import EmptySession from './EmptySession'
import DetailsActionBar from './Details/DetailsActionBar'
import DetailsGrid from './Details/DetailsGrid'
import NewVisitModal from './NewVisit'
import PatientSearchModal from './PatientSearch'
import NewPatient from '../../PatientDatabase/New'
import ViewPatient from '../../PatientDatabase/Detail'
import EndSessionSummary from './Details/EndSessionSummary'
import { StatusIndicator } from './variables'

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
  icon: {
    paddingTop: '0.5px',
    paddingBottom: '0.5px',
  },
  cardIconTitle: {
    color: 'black',
  },
})

@connect(({ queueLog, loading }) => ({
  queueLog,
  loading,
}))
@withFormik({ mapPropsToValues: () => ({}) })
class Queue extends PureComponent {
  state = {
    showNewVisit: false,
    showPatientSearch: false,
    showRegisterNewPatient: false,
    showViewPatientProfile: false,
    showEndSessionSummary: false,
    currentFilter: StatusIndicator.ALL,
    currentQuery: '',
  }

  componentWillMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'queueLog/getSessionInfo',
    })
  }

  showVisitRegistration = (patientID = '') => {
    const { dispatch } = this.props

    patientID !== '' &&
      dispatch({
        type: 'queueLog/fetchPatientInfoByPatientID',
        payload: { patientID },
      }).then((response) => {
        console.log('response', response)
      })
    this.setState({
      showNewVisit: true,
    })
  }

  closeVisitRegistration = () => {
    this.setState({
      showNewVisit: false,
    })
  }

  toggleRegisterNewPatient = () => {
    // const { showRegisterNewPatient } = this.state
    // this.setState({ showRegisterNewPatient: !showRegisterNewPatient })
    this.props.dispatch({
      type: 'patient/openPatientModal',
    })
  }

  toggleViewPatientProfile = () => {
    const { showViewPatientProfile } = this.state
    this.setState({ showViewPatientProfile: !showViewPatientProfile })
  }

  handleRegisterVisit = () => {
    this.setState({
      showPatientSearch: false,
      showNewVisit: false,
    })
  }

  togglePatientSearch = () => {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'queueLog/togglePatientSearch',
    // })
    const { showPatientSearch } = this.state
    this.setState({ showPatientSearch: !showPatientSearch })
  }

  onStartSession = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'queueLog/startSession',
    })
  }

  onEndSessionClick = () => {
    // const { showEndSessionConfirm } = this.state
    const { queueLog } = this.props
    const { sessionInfo } = queueLog
    const { sessionNo } = sessionInfo
    // this.setState({
    //   showEndSessionConfirm: !showEndSessionConfirm,
    // })
    confirm({
      title: `Are you sure to end current session (${sessionNo})`,
      onOk: this.onConfirmEndSession,
      // onDone:
    })
  }

  onConfirmEndSession = (doneCb) => {
    const { queueLog, dispatch } = this.props
    dispatch({
      type: 'queueLog/endSession',
      sessionID: queueLog.sessionInfo.id,
    }).then((r) => {
      // if (doneCb) doneCb(r)
      this.setState({
        showEndSessionSummary: true,
      })
    })
  }

  onEndSessionSummaryClose = () => {
    this.setState({ showEndSessionSummary: false })
  }

  onStatusChange = (newStatus) => {
    this.setState({ currentFilter: newStatus })
  }

  onQueryChanged = (event) => {
    const { value } = event.target
    this.setState({ currentQuery: value })
  }

  onEnterPressed = () => {
    const { dispatch } = this.props
    const { currentQuery } = this.state
    currentQuery !== '' &&
      dispatch({
        type: 'queueLog/fetchPatientListByName',
        payload: currentQuery,
      }).then(() => {
        this.setState({ showPatientSearch: true })
      })
  }

  render () {
    const { classes, queueLog, loading } = this.props
    const {
      showNewVisit,
      showRegisterNewPatient,
      showViewPatientProfile,
      // showEndSessionConfirm,
      showEndSessionSummary,
      showPatientSearch,
      currentQuery,
      currentFilter,
    } = this.state

    const { sessionInfo } = queueLog
    const { sessionNo, isClinicSessionClosed } = sessionInfo
    // console.log('queuelisting state', this.props)

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardHeader icon>
            {/*
              <h4 className={classNames(classes.cardIconTitle)}>
                <FormattedMessage id='reception.queue.queueLog' />
              </h4>
            */}
            <h3 className={classNames(classes.sessionNo)}>
              {`Queue (Session No.: ${sessionNo})`}
            </h3>
            {!isClinicSessionClosed && (
              <div className={classNames(classes.toolBtns)}>
                <Button
                  color='info'
                  size='sm'
                  disabled
                  classes={{ justIcon: classes.icon }}
                >
                  <Refresh />
                  Refresh
                </Button>
                <Button
                  color='danger'
                  size='sm'
                  classes={{ justIcon: classes.icon }}
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
                loadingProps={loading}
              />
            ) : (
              <React.Fragment>
                <DetailsActionBar
                  isFetching={
                    loading.effects['queueLog/fetchPatientListByName']
                  }
                  // currentFilter={currentFilter}
                  currentSearchPatient={currentQuery}
                  handleQueryChange={this.onQueryChanged}
                  handleStatusChange={this.onStatusChange}
                  onRegisterVisitEnterPressed={this.onEnterPressed}
                  togglePatientSearch={this.togglePatientSearch}
                  toggleNewPatient={this.toggleRegisterNewPatient}
                />
                <DetailsGrid
                  onViewDispenseClick={this.toggleDispense}
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
              fluidHeight
              showFooter={false}
            >
              <PatientSearchModal
                searchPatientName={currentQuery}
                onViewRegisterVisit={this.showVisitRegistration}
                onViewRegisterPatient={this.toggleRegisterNewPatient}
              />
            </CommonModal>
            <CommonModal
              open={showNewVisit}
              title={formatMessage({
                id: 'reception.queue.visitRegistration',
              })}
              onClose={this.closeVisitRegistration}
              onConfirm={this.handleRegisterVisit}
              maxWidth='lg'
              fluidHeight
              showFooter={false}
            >
              <NewVisitModal visitPatientInfo={queueLog.visitPatientInfo} />
            </CommonModal>
            {/* <CommonModal
              open={showRegisterNewPatient}
              title={formatMessage({
                id: 'reception.queue.patientSearch.registerNewPatient',
              })}
              onClose={this.toggleRegisterNewPatient}
              onConfirm={this.toggleRegisterNewPatient}
              fullScreen
              showFooter={false}
            >
              <NewPatient />
            </CommonModal> */}
            <CommonModal
              open={showViewPatientProfile}
              title={formatMessage({
                id: 'reception.queue.editVisit',
              })}
              onClose={this.toggleViewPatientProfile}
              onConfirm={this.toggleViewPatientProfile}
              fullScreen
              showFooter={false}
            >
              <ViewPatient />
            </CommonModal>
            {/* {showEndSessionConfirm ? (
              <SimpleModal
                title={`Are you sure to end current session (${sessionNo})`}
                open={showEndSessionConfirm}
                onCancel={this.onEndSessionClick}
                onConfirm={this.onConfirmEndSession}
              />
            ) : null} */}

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
