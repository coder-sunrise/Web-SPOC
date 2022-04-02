import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import { history } from 'umi'
import { withStyles } from '@material-ui/core'
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import { findGetParameter } from '@/utils/utils'
import { ProgressButton, Tooltip } from '@/components'
import PatientHistory from '@/pages/Widgets/PatientHistory'
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE } from '@/utils/constants'
import { CallingQueueButton } from '@/components/_medisys'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { initRoomAssignment } from '@/utils/codes'
import PlayArrow from '@material-ui/icons/PlayArrow'
import { openCautionAlertOnStartConsultation } from '@/pages/Widgets/Orders/utils'
import Banner from './Banner'

const styles = theme => ({
  ...inputStyle(theme),
  root: {},
  hide: {
    display: 'none',
  },
  title: {
    fontSize: '1rem',
  },
  note: {
    fontSize: '0.75em',
    fontWeight: 400,
    // marginTop: -3,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  paragraph: {
    marginLeft: theme.spacing(1),
  },
  leftPanel: {
    top: 164,
  },

  rightPanel: {
    marginTop: theme.spacing(1),
  },
})
@connect(({ patientDashboard, global, visitRegistration, patient }) => ({
  visitRegistration,
  patientDashboard,
  global,
  patient,
}))
@Authorized.Secured('patientdashboard')
class PatientDashboard extends PureComponent {
  componentDidMount() {
    if (this.props.patientDashboard.currentId) {
      this.props.dispatch({
        type: 'patientDashboard/query',
        payload: {
          id: this.props.patientDashboard.currentId,
        },
      })
    }
    initRoomAssignment()
  }

  componentWillUnmount() {}

  handleListItemClick = (e, i) => {
    this.setState({ selectedIndex: i })
  }

  startConsultation = () => {
    // this.props.dispatch({
    //   type: 'patientDashboard/openConsultationModal',
    // })
    // this.props.history.push(
    //   '/reception/queue/patientdashboard/consultation/new',
    // )
    // const { clinicalObjectRecordID } = this.props.patientDashboard
    // if (clinicalObjectRecordID) {
    //   this.props.history.push(
    //     getAppendUrl({
    //       md: 'cons',
    //       // vid: visitID,
    //     }),
    //   )
    // } else {
    //   notification.error({
    //     message: 'Visit info not found, please start over',
    //   })
    // }
    // const { visitRegistration = {} } = this.props
    // const { visitInfo = {} } = visitRegistration

    // this.props.history.push(
    //   getAppendUrl({
    //     md2: 'cons',
    //   }),
    // )

    const version = Date.now()
    this.props
      .dispatch({
        type: `consultation/start`,
        payload: {
          id: this.props.visitRegistration.entity.visit.id,
          queueNo: this.props.visitRegistration.entity.visit.queueNo,
          version,
        },
      })
      .then(o => {
        if (o) {
          const patientID = this.props.visitRegistration.entity.visit
            .patientProfileFK
          history.push(
            `/reception/queue/consultation?qid=${findGetParameter('qid')}&cid=${
              o.id
            }&pid=${patientID}&v=${version}`,
          )
          openCautionAlertOnStartConsultation(o)
        }
      })
  }

  getExtraComponent = () => {
    const {
      visitRegistration,
      patient: { entity: patientProfile },
    } = this.props
    const { entity } = visitRegistration
    if (!entity) return null
    const { visit = {}, queueNo } = entity
    const { visitPurposeFK = VISIT_TYPE.CON, roomFK, doctorProfileFK } = visit

    return (
      visit.visitStatus !== VISIT_STATUS.UPCOMING_APPT && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: '100%',
          }}
        >
          {patientProfile &&
            patientProfile.isActive &&
            visit.visitStatus !== VISIT_STATUS.UPCOMING_APPT && (
              <Authorized authority='openqueuedisplay'>
                <CallingQueueButton
                  qId={queueNo}
                  patientName={patientProfile?.name}
                  from='Queue'
                />
              </Authorized>
            )}
          {visit.visitStatus === VISIT_STATUS.WAITING &&
            patientProfile &&
            patientProfile.isActive && (
              <Authorized authority='patientdashboard.startresumeconsultation'>
                <div style={{ padding: '30px 0' }}>
                  <Tooltip title='Start Consultation'>
                    <ProgressButton
                      color='primary'
                      onClick={this.startConsultation}
                      disabled={
                        visitPurposeFK === VISIT_TYPE.OTC ||
                        visitPurposeFK === VISIT_TYPE.BF ||
                        visitPurposeFK === VISIT_TYPE.MC
                      }
                      round
                      justIcon
                      icon={<PlayArrow />}
                    ></ProgressButton>
                  </Tooltip>
                </div>
              </Authorized>
            )}
        </div>
      )
    )
  }

  render() {
    const {
      theme,
      classes,
      height,
      linkProps = {},
      onMenuClick = p => p,
      ...resetProps
    } = this.props
    const {
      patientDashboard,
      global,
      visitRegistration,
      patient: { entity: patientProfile },
    } = resetProps
    const { entity } = visitRegistration
    if (!entity) return null

    return (
      <div className={classes.root}>
        <Banner
          from='PatientDashboard'
          // activePreOrderItem={patientProfile?.listingPreOrderItem.filter(item => !item.isDeleted) || []}
          extraCmt={this.getExtraComponent}
          {...this.props}
        />
        <div style={{ marginTop: theme.spacing(1) }}>
          <Fragment>
            <PatientHistory fromModule='PatientDashboard' {...resetProps} />
          </Fragment>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDashboard)
