import React from 'react'
import { connect } from 'dva'
import MoreVert from '@material-ui/icons/MoreVert'
import $ from 'jquery'
// material ui
import CallIcon from '@material-ui/icons/Call'
// medisys component
import Tooltip from '@material-ui/core/Tooltip'
import { VisitStatusTag, LoadingWrapper } from '@/components/_medisys'
import { CommonTableGrid, Button, Skeleton } from '@/components'
// medisys component
// sub component
// utils
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { APPOINTMENT_STATUS, VISIT_TYPE } from '@/utils/constants'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import {
  FuncConfig,
  QueueTableConfig,
  QueueColumnExtensions,
  AppointmentTableConfig,
  ApptColumnExtensions,
} from './variables'
import { filterData } from '../utils'
// import ContextMenu from './ContextMenu'
// import ActionButton from './ActionButton'
// import { formikHandleSubmit } from '../NewVisit/miscUtils'
// import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { StatusIndicator } from '../variables'

class Grid extends React.Component {
  constructor (props) {
    super(props)
    props.dispatch({
      type: 'codetable/fetchCodes',
      payload: 'ctgender',
    })
  }

  shouldComponentUpdate (nextProps) {
    // console.log(nextProps, this.props)
    if (this.props.loading !== nextProps.loading) return true
    if (this.props.selfOnly !== nextProps.selfOnly) return true
    if (this.props.filter !== nextProps.filter) return true
    if (this.props.mainDivHeight !== nextProps.mainDivHeight) return true
    if (this.props.searchQuery !== nextProps.searchQuery) return true

    if (
      nextProps.filter === 'appointment' &&
      this.props.calendarEvents !== nextProps.calendarEvents
    )
      return true
    return false
  }

  onRowDoubleClick = (row) => {
    const { visitStatus, visitPurposeFK = VISIT_TYPE.CONS } = row
    const isWaiting = visitStatus === VISIT_STATUS.WAITING
    const { clinicianProfile: { doctorProfile } } = this.props.user.data
    const retailVisits = [
      VISIT_TYPE.RETAIL,
      VISIT_TYPE.BILL_FIRST,
      VISIT_TYPE.TELE_CONS,
    ]
    if (!doctorProfile || retailVisits.includes(visitPurposeFK)) return false

    if (isWaiting) this.props.onMenuItemClick(row, '5') // start consultation context menu id = 5

    return true
  }

  computeQueueListingData = () => {
    const {
      user,
      calendarEvents = [],
      eQueueEvents = [],
      filter = StatusIndicator.ALL,
      searchQuery,
      selfOnly = false,
      queueList = [],
    } = this.props

    const { clinicianProfile } = user.data
    if (filter === StatusIndicator.APPOINTMENT) {
      if (selfOnly) {
        return calendarEvents.filter(
          (item) =>
            clinicianProfile
              ? item.clinicianProfileFk === clinicianProfile.id
              : true,
        )
      }
      return calendarEvents
    }

    if (filter === StatusIndicator.E_QUEUE) return eQueueEvents
    let data = [
      ...queueList,
    ]

    if (selfOnly)
      data = data.filter((item) => {
        if (!item.doctor) return false
        const { doctor: { id } } = item
        return clinicianProfile.doctorProfile
          ? id === clinicianProfile.doctorProfile.id
          : false
      })

    return filterData(filter, data, searchQuery)
  }

  getActionButton = (row) => (
    <Button
      justIcon
      round
      color='primary'
      size='sm'
      onClick={(e) => {
        this.props.onContextMenu(row, e)
        e.preventDefault()
        return false
      }}
    >
      <MoreVert />
    </Button>
  )

  handleStatusTagClick = (row) => {
    let id = '5' // default as Start Consultation
    const {
      visitStatus,
      visitPurposeFK,
      patientProfileFk,
      appointmentStatusFk,
    } = row
    if (visitStatus === VISIT_STATUS.UPCOMING_APPT) {
      id = patientProfileFk ? '8' : '9'

      this.props.onMenuItemClick(row, id)
      return
    }

    switch (visitStatus) {
      case VISIT_STATUS.WAITING:
        if (
          visitPurposeFK === VISIT_TYPE.RETAIL ||
          visitPurposeFK === VISIT_TYPE.BILL_FIRST
        )
          id = '1'
        else id = '5'
        break
      case VISIT_STATUS.IN_CONS:
      case VISIT_STATUS.PAUSED:
        id = '6'
        break
      case VISIT_STATUS.DISPENSE:
      case VISIT_STATUS.ORDER_UPDATED:
        id = '1'
        break
      case VISIT_STATUS.BILLING:
      case VISIT_STATUS.COMPLETED:
      case VISIT_STATUS.PAYMENT_REQUESTED:
      case VISIT_STATUS.PAYMENT_FAILED:
        id = '1.1'
        break
      case VISIT_STATUS.EQ_PENDING:
        id = '12'
        break
      case VISIT_STATUS.PENDING:
        id = '11'
        break
      default:
        id = undefined
        break
    }

    this.props.onMenuItemClick(row, id)
  }

  render () {
    const {
      codetable,
      filter = StatusIndicator.ALL,
      loading = false,
      queryingFormData = false,
      showingVisitRegistration = false,
      statusTagClicked,
      mainDivHeight = 700,
    } = this.props

    const queueListingData = this.computeQueueListingData()
    // console.log(mainDivHeight)

    const isLoading = showingVisitRegistration ? false : loading
    let loadingText = 'Refreshing queue...'
    if (!loading && queryingFormData) loadingText = ''
    let height = mainDivHeight - 150 - $('.div-reception-header').height() || 0
    if (height < 500) height = 500
    const TableProps = { height }
    if (!height) return <Skeleton variant='rect' height={500} />
    return (
      <div>
        <LoadingWrapper
          linear
          loading={isLoading || queryingFormData}
          text={loadingText}
        >
          {filter !== StatusIndicator.APPOINTMENT && (
            <CommonTableGrid
              size='sm'
              TableProps={TableProps}
              rows={queueListingData}
              forceRender
              columnExtensions={[
                ...QueueColumnExtensions,
                {
                  columnName: 'visitStatus',
                  width: 200,
                  render: (row) => (
                    <VisitStatusTag
                      row={row}
                      onClick={this.handleStatusTagClick}
                    />
                  ),
                },
                {
                  columnName: 'action',
                  align: 'center',
                  render: this.getActionButton,
                  width: 95,
                },
                {
                  columnName: 'visitPurposeFK',
                  width: 60,
                  align: 'left',
                  render: (row) => {
                    return row.visitPurposeFK === VISIT_TYPE.TELE_CONS ? (
                      <Tooltip title='TEL-CONS'>
                        <CallIcon style={{ color: 'green' }} />
                      </Tooltip>
                    ) : (
                      ''
                    )
                  },
                },
              ]}
              FuncProps={FuncConfig}
              onRowDoubleClick={this.onRowDoubleClick}
              onContextMenu={this.props.onContextMenu}
              {...QueueTableConfig}
            />
          )}
          {filter === StatusIndicator.APPOINTMENT && (
            <CommonTableGrid
              size='sm'
              TableProps={TableProps}
              rows={queueListingData}
              forceRender
              columnExtensions={[
                ...ApptColumnExtensions,
                {
                  columnName: 'visitStatus',
                  width: 200,
                  render: (row) => (
                    <VisitStatusTag
                      row={row}
                      onClick={this.handleStatusTagClick}
                      statusTagClicked={statusTagClicked}
                    />
                  ),
                },
                {
                  columnName: 'action',
                  align: 'center',
                  render: this.getActionButton,
                  width: 95,
                },
                {
                  columnName: 'gender/age',
                  render: (row) => {
                    const { dob, genderFK = 3, patientProfileFk } = row
                    if (!patientProfileFk) return null
                    const { ctgender = [] } = codetable
                    const age = calculateAgeFromDOB(dob)
                    const gender = ctgender.find((g) => g.id === genderFK)
                    return (
                      <Tooltip title={`${gender.code}/${age}`}>
                        <span>{`${gender.code}/${age}`}</span>
                      </Tooltip>
                    )
                  },
                  sortingEnabled: false,
                },
              ]}
              FuncProps={FuncConfig}
              onRowDoubleClick={this.onRowDoubleClick}
              {...AppointmentTableConfig}
            />
          )}
        </LoadingWrapper>
      </div>
    )
  }
}

export default connect(({ queueLog, global, loading, user, codetable }) => ({
  user,
  codetable,
  mainDivHeight: global.mainDivHeight,
  filter: queueLog.currentFilter,
  selfOnly: queueLog.selfOnly,
  queueList: queueLog.list || [],
  statusTagClicked: queueLog.statusTagClicked,
  calendarEvents: queueLog.appointmentList || [],
  eQueueEvents: queueLog.equeueList || [],
  showingVisitRegistration: global.showVisitRegistration,
  queueLog,
  loading:
    loading.effects['queueLog/refresh'] ||
    loading.effects['queueLog/getSessionInfo'] ||
    loading.effects['queueLog/query'] ||
    loading.effects['calendar/getCalendarList'],
  queryingFormData: loading.effects['dispense/initState'],
}))(Grid)
