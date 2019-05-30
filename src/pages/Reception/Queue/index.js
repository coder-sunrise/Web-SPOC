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
import { withStyles } from '@material-ui/core'
import { Refresh, Queue as QueueIcon, Stop } from '@material-ui/icons'
// custom components
import {
  Card,
  CardHeader,
  CardBody,
  CardIcon,
  CommonModal,
  SimpleModal,
  PageHeaderWrapper,
  Button,
} from '@/components'

// current page sub components
import EmptySession from './EmptySession'
import DetailsActionBar from './Details/DetailsActionBar'
import DetailsGrid from './Details/DetailsGrid'
import DetailsFooter from './Details/DetailsFooter'
import NewVisitModal from './NewVisit'
import PatientSearchModal from './PatientSearch'

import NewPatient from '../../PatientDatabase/New'
import ViewPatient from '../../PatientDatabase/Detail'
import EndSessionSummary from './Details/EndSessionSummary'

// variables
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
    float: 'left',
    color: 'black',
  },
  toolBtns: {
    float: 'right',
    marginTop: '10px',
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
    showEndSessionConfirm: false,
    showEndSessionSummary: false,
    visitPatientID: '',
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
    const { showNewVisit } = this.state
    const { dispatch } = this.props

    patientID !== '' &&
      dispatch({
        type: 'queueLog/fetchPatientInfoByPatientID',
        payload: { patientID },
      })
    this.setState({
      showNewVisit: true,
      visitPatientID: patientID,
    })
  }

  closeVisitRegistration = () => {
    this.setState({
      showNewVisit: false,
      visitPatientID: '',
    })
  }

  toggleRegisterNewPatient = () => {
    const { showRegisterNewPatient } = this.state
    this.setState({ showRegisterNewPatient: !showRegisterNewPatient })
  }

  toggleViewPatientProfile = () => {
    const { showViewPatientProfile } = this.state
    this.setState({ showViewPatientProfile: !showViewPatientProfile })
  }

  handleRegisterVisit = (visitInfo = {}) => {
    this.setState({
      showPatientSearch: false,
      showNewVisit: false,
      visitPatientID: '',
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
    const { showEndSessionConfirm } = this.state

    this.setState({
      showEndSessionConfirm: !showEndSessionConfirm,
    })
  }

  onConfirmEndSession = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'queueLog/endSession',
    })
    // this.setState({
    //   showEndSessionConfirm: false,
    //   showEndSessionSummary: true,
    // })
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
      }).then((response) => {
        if (response.payload && response.payload.length === 0)
          this.setState({ showPatientSearch: true })
      })
  }

  render () {
    const { classes, queueLog, loading } = this.props
    const {
      showNewVisit,
      showRegisterNewPatient,
      showViewPatientProfile,
      showEndSessionConfirm,
      showEndSessionSummary,
      showPatientSearch,
      currentFilter,
      currentQuery,
    } = this.state

    const { sessionInfo } = queueLog
    const { sessionNo, isClinicSessionClosed } = sessionInfo
    console.log({ queueLog })
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardHeader color='primary' icon>
            <CardIcon color='primary'>
              <QueueIcon />
            </CardIcon>
            {/*
              <h4 className={classNames(classes.cardIconTitle)}>
                <FormattedMessage id='reception.queue.queueLog' />
              </h4>
            */}
            <h4 className={classNames(classes.sessionNo)}>
              <FormattedMessage id='reception.queue.sessionNo' />
              {sessionNo}
            </h4>
            {!isClinicSessionClosed && (
              <div className={classNames(classes.toolBtns)}>
                <Button
                  size='sm'
                  color='info'
                  classes={{ justIcon: classes.icon }}
                >
                  <Refresh />
                  <FormattedMessage id='reception.queue.refreshQueue' />
                </Button>
                <Button
                  size='sm'
                  color='danger'
                  classes={{ justIcon: classes.icon }}
                  onClick={this.onEndSessionClick}
                >
                  <Stop />
                  <FormattedMessage id='reception.queue.endSession' />
                </Button>
              </div>
            )}
          </CardHeader>

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
                  currentFilter={currentFilter}
                  currentSearchPatient={currentQuery}
                  handleQueryChange={this.onQueryChanged}
                  handleStatusChange={this.onStatusChange}
                  onRegisterVisitEnterPressed={this.onEnterPressed}
                  togglePatientSearch={this.togglePatientSearch}
                  toggleNewPatient={this.toggleRegisterNewPatient}
                />
                <DetailsGrid
                  onViewDispenseClick={this.toggleDispense}
                  queueLog={queueLog}
                />
                <DetailsFooter
                  onViewPatientProfile={this.toggleViewPatientProfile}
                />
              </React.Fragment>
            )}

            <CommonModal
              open={showPatientSearch}
              title='Search Patient'
              onClose={this.togglePatientSearch}
              onConfirm={this.togglePatientSearch}
              maxWidth='md'
              fluidHeight
              showFooter={false}
            >
              {showPatientSearch && (
                <PatientSearchModal
                  searchPatientName={currentQuery}
                  onViewRegisterVisit={this.showVisitRegistration}
                  onViewRegisterPatient={this.toggleRegisterNewPatient}
                />
              )}
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
              {showNewVisit && (
                <NewVisitModal visitPatientInfo={queueLog.visitPatientInfo} />
              )}
            </CommonModal>
            <CommonModal
              open={showRegisterNewPatient}
              title={formatMessage({
                id: 'reception.queue.patientSearch.registerNewPatient',
              })}
              onClose={this.toggleRegisterNewPatient}
              onConfirm={this.toggleRegisterNewPatient}
              fullScreen
              showFooter={false}
            >
              {showRegisterNewPatient && <NewPatient />}
            </CommonModal>
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
              {showViewPatientProfile && <ViewPatient />}
            </CommonModal>
            {showEndSessionConfirm && (
              <SimpleModal
                title={`Are you sure to end current session (${sessionNo})`}
                open={showEndSessionConfirm}
                onCancel={this.onEndSessionClick}
                onConfirm={this.onConfirmEndSession}
              />
            )}
            {showEndSessionSummary && (
              <CommonModal
                open={showEndSessionSummary}
                title={formatMessage({
                  id: 'reception.queue.endSession',
                })}
                onClose={this.onEndSessionSummaryClose}
                onConfirm={this.onEndSessionSummaryClose}
                disableBackdropClick
              >
                {showEndSessionSummary && <EndSessionSummary />}
              </CommonModal>
            )}
          </CardBody>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Queue)
