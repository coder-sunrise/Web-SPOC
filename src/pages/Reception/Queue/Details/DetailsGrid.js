import React, { PureComponent } from 'react'
import router from 'umi/router'
// dva
import { connect } from 'dva'
// table grid component
import { Table } from '@devexpress/dx-react-grid-material-ui'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
import Pageview from '@material-ui/icons/Pageview'
import Edit from '@material-ui/icons/Edit'
import Money from '@material-ui/icons/AttachMoney'
import Delete from '@material-ui/icons/Delete'
import Person from '@material-ui/icons/Person'
import Book from '@material-ui/icons/LibraryBooks'
import Play from '@material-ui/icons/PlayArrow'
import PlayCircle from '@material-ui/icons/PlayCircleOutlineOutlined'
// custom components
import { CommonTableGrid, DateFormatter } from '@/components'
// medisys component
import {
  GridContextMenuButton as GridButton,
  LoadingWrapper,
} from 'medisys-components'
// sub component
import AppointmentActionButton from './AppointmentActionButton'
import { flattenAppointmentDateToCalendarEvents } from '../../BigCalendar'
import { filterData, filterDoctorBlock, todayOnly } from '../utils'
import { StatusIndicator } from '../variables'
import { getAppendUrl } from '@/utils/utils'
// assets
import { tooltip } from '@/assets/jss/index'

const styles = () => ({
  tooltip,
  fullscreenBtn: {
    float: 'right',
    top: '-15px',
    left: '20px',
    zIndex: 999,
  },
})

const compareQueueNo = (a, b) => {
  const floatA = parseFloat(a)
  const floatB = parseFloat(b)
  if (Number.isNaN(floatA) || Number.isNaN(floatB)) {
    return -1
  }

  return floatA < floatB ? -1 : 1
}

const FuncConfig = {
  pager: false,
  sort: true,
  sortConfig: {
    defaultSorting: [
      { columnName: 'queueNo', direction: 'asc' },
    ],
  },
}
const TableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'queueNo', title: 'Q. No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'gender/age', title: 'Gender / Age' },

    { name: 'doctor', title: 'Doctor' },
    { name: 'roomNo', title: 'Room No.' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceAmount', title: 'Invoice Amount' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'accNo', title: 'Acc No.' },
    { name: 'gst', title: 'GST' },
    { name: 'payment', title: 'Payment' },
    { name: 'paymentMode', title: 'Payment Mode' },
    { name: 'company', title: 'Company' },
    { name: 'outstandingBalance', title: 'Outstanding' },
    { name: 'scheme', title: 'Scheme' },
    { name: 'contactNo', title: 'Phone' },
    // { name: 'gender', title: 'Gender' },
    // { name: 'age', title: 'Age' },
    // { name: 'refNo', title: 'Ref. No.' },
    // { name: 'visitRefNo', title: 'Visit Ref No.' },
    // { name: 'referralCompany', title: 'Referral Company' },
    // { name: 'referralPerson', title: 'Referral Person' },
    // { name: 'referralRemarks', title: 'Referral Remarks' },
    { name: 'Action', title: 'Action' },
  ],
  leftColumns: [
    'visitStatus',
    'queueNo',
  ],
  columnExtensions: [
    { columnName: 'queueNo', width: 80, compare: compareQueueNo },
    { columnName: 'visitStatus', type: 'status', width: 150 },
    { columnName: 'paymentMode', width: 150 },
    { columnName: 'patientName', width: 250 },
    { columnName: 'referralCompany', width: 150 },
    { columnName: 'referralPerson', width: 150 },
    { columnName: 'referralRemarks', width: 150 },
    { columnName: 'invoiceAmount', type: 'number', currency: true },
    { columnName: 'payment', type: 'number', currency: true },
    { columnName: 'gst', type: 'number', currency: true },
    { columnName: 'outstandingBalance', type: 'number', currency: true },
    { columnName: 'Action', width: 100, align: 'center' },
    { columnName: 'timeIn', width: 160, type: 'time' },
    { columnName: 'timeOut', width: 160, type: 'time' },
    {
      columnName: 'gender/age',
      render: (row) =>
        row.gender && row.age ? `${row.gender}/${row.age}` : '',
      sortBy: 'genderFK',
    },
    {
      columnName: 'appointmentTime',
      width: 160,
      render: (row) => {
        if (row.appointmentTime) {
          return DateFormatter({ value: row.appointmentTime, full: true })
        }
        if (row.start) return DateFormatter({ value: row.start, full: true })
        return ''
      },
    },
  ],
}

const ContextMenuOptions = [
  {
    id: 0,
    label: 'Edit Visit',
    Icon: Edit,
    disabled: false,
  },
  {
    id: 1,
    label: 'Dispense & Bill',
    Icon: Money,
    disabled: false,
  },
  {
    id: 2,
    label: 'Delete Visit',
    Icon: Delete,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 3,
    label: 'Patient Profile',
    Icon: Person,
    disabled: false,
  },
  {
    id: 4,
    label: 'Patient Dashboard',
    Icon: Book,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 5,
    label: 'Start Consultation',
    Icon: Play,
    disabled: false,
  },
  {
    id: 6,
    label: 'Resume Consultation',
    Icon: PlayCircle,
    disabled: true,
  },
  {
    id: 7,
    label: 'Edit Consultation',
    Icon: Edit,
    disabled: true,
  },
]

@connect(({ queueLog, calendar, global, loading }) => ({
  queueLog,
  calendar,
  global,
  loading,
}))
class DetailsGrid extends PureComponent {
  onRowDoubleClick = (row) => {
    this.props.handleEditVisitClick({
      visitID: row.id,
    })
  }

  onViewDispenseClick = (queue) => {
    const { dispatch, location } = this.props
    const href = `${location.pathname}/dispense/${queue.visitRefNo}`

    dispatch({
      type: 'menu/updateBreadcrumb',
      payload: {
        href,
        name: queue.visitRefNo,
      },
    })
    router.push(href)
  }

  onViewPatientProfileClick = (row) => {
    const { patientProfileFK } = row
    const { dispatch } = this.props
    // dispatch({
    //   type: 'patient'
    // })
    this.props.history.push(
      getAppendUrl({
        md: 'pt',
        cmt: '1',
        pid: patientProfileFK,
      }),
    )
    // dispatch({
    //   type: 'queueLog/getPatientID',
    //   payload: {
    //     patientAccountNo,
    //     patientReferenceNo,
    //     patientName,
    //   },
    // })
  }

  deleteQueueConfirmation = (row) => {
    const { queueNo, id } = row
    const { dispatch } = this.props

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Are you sure want to delete this visit - (Q No. - ${queueNo})?`,
        onOpenConfirm: () => this.deleteQueue(id),
      },
    })
  }

  deleteQueue = (queueID) => {
    const { dispatch } = this.props
    dispatch({
      type: 'queueLog/deleteQueueByQueueID',
      queueID,
    })
    dispatch({
      type: 'queueLog/fetchQueueListing',
    })
  }

  onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        this.props.handleEditVisitClick({
          visitID: row.id,
        })
        break
      case '1':
        router.push(`/reception/queue/dispense/${row.visitRefNo}`)
        break
      case '2':
        this.deleteQueueConfirmation(row)
        break
      case '3':
        this.onViewPatientProfileClick(row)
        break
      case '4':
        router.push('/reception/queue/patientdashboard')
        break
      case '5':
        router.push('/reception/queue/patientdashboard/consultation/new')
        break
      default:
        break
    }
  }

  Cell = (props) => {
    const { classes, ...tableProps } = props
    if (tableProps.column.name === 'Action') {
      if (
        tableProps.row.visitStatus === StatusIndicator.APPOINTMENT.toUpperCase()
      ) {
        return (
          <Table.Cell {...tableProps}>
            <Tooltip
              title='More Actions'
              placement='bottom'
              classes={{ tooltip: classes.tooltip }}
            >
              <div style={{ display: 'inline-block' }}>
                <AppointmentActionButton
                  row={tableProps.row}
                  Icon={<Pageview />}
                  onClick={this.onContextButtonClick}
                />
              </div>
            </Tooltip>
          </Table.Cell>
        )
      }

      const { row } = tableProps
      const shouldDisableDelete = row.visitStatus !== 'WAITING'
      const newContextMenuOptions = ContextMenuOptions.map(
        (opt) =>
          opt.id === 2 ? { ...opt, disabled: shouldDisableDelete } : { ...opt },
      )

      return (
        <Table.Cell {...tableProps}>
          <Tooltip
            title='More Actions'
            placement='bottom'
            classes={{ tooltip: classes.tooltip }}
          >
            <div style={{ display: 'inline-block' }}>
              <GridButton
                row={tableProps.row}
                onClick={this.onContextButtonClick}
                contextMenuOptions={newContextMenuOptions}
              />
            </div>
          </Tooltip>
        </Table.Cell>
      )
    }

    return <Table.Cell {...tableProps} />
  }

  TableCell = (props) => {
    return this.Cell({ ...props })
  }

  render () {
    const ActionProps = {
      TableCellComponent: withStyles(styles)(this.TableCell),
    }
    const {
      calendar = { calendarEvents: [] },
      queueLog,
      loading,
      global,
    } = this.props
    const { currentFilter, queueListing } = queueLog
    const { calendarEvents } = calendar

    const flattenedCalendarData = calendarEvents
      .reduce(flattenAppointmentDateToCalendarEvents, [])
      .filter(todayOnly)

    const data =
      currentFilter === StatusIndicator.APPOINTMENT
        ? filterDoctorBlock(flattenedCalendarData)
        : filterData(currentFilter, queueListing)

    const isLoading = global.showVisitRegistration
      ? false
      : loading.effects['queueLog/fetchQueueListing']

    return (
      <LoadingWrapper
        linear
        loading={isLoading}
        text='Getting queue listing...'
      >
        <CommonTableGrid
          height={600}
          rows={data}
          ActionProps={ActionProps}
          {...TableConfig}
          size='sm'
          FuncProps={FuncConfig}
          onRowDoubleClick={this.onRowDoubleClick}
        />
      </LoadingWrapper>
    )
  }
}

export default DetailsGrid
