import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import DateRange from '@material-ui/icons/DateRange'
import {
  withStyles,
  MenuItem,
  MenuList,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core'
import router from 'umi/router'
import { unstable_Box as Box } from '@material-ui/core/Box'
import { Icon, Input, AutoComplete, Form } from 'antd'
import Loadable from 'react-loadable'
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import { findGetParameter, getAppendUrl } from '@/utils/utils'
import {
  PictureUpload,
  GridContainer,
  GridItem,
  CardContainer,
  Transition,
  TextField,
  AntdInput,
  Select,
  Accordion,
  Button,
  notification,
  ProgressButton,
} from '@/components'

import avatar from '@/assets/img/faces/marc.jpg'

import Loading from '@/components/PageLoading/index'
import Banner from './Banner'
import PatientHistory from '@/pages/Widgets/PatientHistory'
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE } from '@/utils/constants'

const styles = (theme) => ({
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
@connect(({ patientDashboard, global, visitRegistration }) => ({
  visitRegistration,
  patientDashboard,
  global,
}))
class PatientDashboard extends PureComponent {
  componentDidMount () {
    if (this.props.patientDashboard.currentId) {
      this.props.dispatch({
        type: 'patientDashboard/query',
        payload: {
          id: this.props.patientDashboard.currentId,
        },
      })
    }
  }

  componentWillUnmount () {}

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
          version,
        },
      })
      .then((o) => {
        if (o)
          // router.push(
          //   getAppendUrl({
          //     md2: 'cons',
          //     cid: o.id,
          //   }),
          // )

          router.push(
            `/reception/queue/consultation?qid=${findGetParameter(
              'qid',
            )}&cid=${o.id}&v=${version}`,
          )
      })
  }

  render () {
    const {
      theme,
      classes,
      height,
      linkProps = {},
      onMenuClick = (p) => p,
      ...resetProps
    } = this.props
    const { patientDashboard, global, history, visitRegistration } = resetProps
    const { entity } = visitRegistration
    if (!entity) return null
    const { visit = {} } = entity
    const { visitPurposeFK = VISIT_TYPE.CONS } = visit

    return (
      <div className={classes.root}>
        <Banner
          extraCmt={
            visit.visitStatus === 'WAITING' && (
              <Authorized authority='patientdashboard.startresumeconsultation'>
                <div style={{ padding: '30px 0' }}>
                  <ProgressButton
                    color='primary'
                    onClick={this.startConsultation}
                    disabled={
                      visitPurposeFK === VISIT_TYPE.RETAIL ||
                      visitPurposeFK === VISIT_TYPE.BILL_FIRST
                    }
                  >
                    Start Consultation
                  </ProgressButton>
                </div>
              </Authorized>
            )
          }
          {...this.props}
        />
        <div style={{ marginTop: theme.spacing(1) }}>
          <PatientHistory
            override={{
              leftPanel: classes.leftPanel,
              rightPanel: classes.rightPanel,
            }}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDashboard)
