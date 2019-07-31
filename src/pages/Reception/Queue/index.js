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
import { StatusIndicator, modelKey } from './variables'

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
    showPatientSearch: false,
    showViewPatientProfile: false,
    showEndSessionSummary: false,
    currentFilter: StatusIndicator.ALL,
    currentQuery: '',
  }

  componentWillMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${modelKey}getSessionInfo`,
    })
  }

  showVisitRegistration = (patientID = '') => {
    this.setState(
      {
        showPatientSearch: false,
      },
      () =>
        this.props.history.push(
          getAppendUrl({
            md: 'visreg',
            cmt: patientID,
          }),
        ),
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

  toggleViewPatientProfile = () => {
    const { showViewPatientProfile } = this.state
    this.setState({ showViewPatientProfile: !showViewPatientProfile })
  }

  togglePatientSearch = () => {
    // const { dispatch } = this.props
    // dispatch({
    //   type: `${modelKey}togglePatientSearch`,
    // })
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
      type: `${modelKey}endSession`,
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

  onEnterPressed = (searchQuery) => {
    const { dispatch } = this.props
    // const { currentQuery } = this.state
    searchQuery !== '' &&
      dispatch({
        type: `${modelKey}fetchPatientListByName`,
        payload: searchQuery,
      }).then(this.showSearchResult)
  }

  showSearchResult = () => {
    const { queueLog } = this.props
    const { patientList } = queueLog

    if (patientList.length === 1) {
      this.showVisitRegistration(patientList[0].id)
    } else if (patientList.length > 1) {
      this.setState({ showPatientSearch: true })
    } else {
      this.toggleRegisterNewPatient()
    }
  }

  render () {
    const { classes, queueLog, loading } = this.props
    const {
      showViewPatientProfile,
      // showEndSessionConfirm,
      showEndSessionSummary,
      showPatientSearch,
      currentQuery,
      currentFilter,
    } = this.state

    const { showNewVisit, sessionInfo, error } = queueLog
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
                errorState={error}
              />
            ) : (
              <React.Fragment>
                <DetailsActionBar
                  isFetching={
                    loading.effects[`${modelKey}fetchPatientListByName`]
                  }
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
            {/* <CommonModal
              open={showNewVisit}
              title={formatMessage({
                id: 'reception.queue.visitRegistration',
              })}
              onClose={this.closeVisitRegistration}
              onConfirm={this.closeVisitRegistration}
              maxWidth='lg'
              fluidHeight
              observe='VisitRegistration'
              showFooter={false}
            >
              <NewVisitModal />
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
