import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// material ui
import { Popover, IconButton, withStyles } from '@material-ui/core'
import { Assignment, ChevronLeft, ChevronRight } from '@material-ui/icons'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// react-datetime
import Datetime from 'react-datetime'
// events data
import { dndEvents } from './events'
// view
import CalendarView from './components/CalendarView'
import Form from './Form'

import {
  Button,
  CommonHeader,
  CommonModal,
  CustomDropdown,
  GridContainer,
  GridItem,
  DatePicker,
} from '@/components'

// import { DatePicker as ANTDatePicker } from 'antd'
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const styles = (theme) => ({
  'event-checkup': {
    backgroundColor: theme.palette.error.main,
  },
  dateButton: {
    // marginTop: theme.spacing.unit,
    fontSize: '1.5rem',
    paddingBottom: '8px !important',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  ...AppointmentTypeAsColor,
})

const ValidationSchema = Yup.object().shape({
  AntdInputError: Yup.string().required(),
  Test: Yup.string().required(),
  selectLocation: Yup.string().required(),
})

const localizer = BigCalendar.momentLocalizer(moment)
const today = new Date()

const resources = [
  { resourceId: 'medisys', resourceTitle: 'Medisys' },
  { resourceId: 'levinne', resourceTitle: 'Levinne' },
  { resourceId: 'cheah', resourceTitle: 'Cheah' },
  { resourceId: 'other', resourceTitle: 'Other' },
]

const DATE_NAVIGATOR_ACTION = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  BACK_TO_TODAY: 'today',
}

const type = {
  [BigCalendar.Views.DAY]: 'days',
  [BigCalendar.Views.WEEK]: 'weeks',
  [BigCalendar.Views.MONTH]: 'months',
}

const Event = (props) => {
  const { event } = props
  return (
    <div>
      <span>
        <strong>{event.patientName}</strong>
      </span>
      <span>{event.contactNo}</span>
    </div>
  )
}

@withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: () => ({}),
})
class FixSelect extends React.PureComponent {
  state = {
    view: BigCalendar.Views.DAY,
    showAppointmentForm: false,

    events: dndEvents,

    date: new Date(),
    minTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      7,
      0,
      0,
    ),
    maxTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      19,
      0,
      0,
    ),
    slotInfo: {},
  }

  // changeDate = (action) => {
  //   let newDate = moment(new Date())
  //   const { view: currentView, date: currentDate } = this.state
  //   if (action === DATE_NAVIGATOR_ACTION.ADD) {
  //     newDate = moment(currentDate).add(1, type[currentView])
  //   } else if (action === DATE_NAVIGATOR_ACTION.SUBTRACT) {
  //     newDate = moment(currentDate).subtract(1, type[currentView])
  //   }

  //   this.setState({
  //     date: new Date(newDate.toString()),
  //   })
  // }

  // addDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.ADD)

  // subtractDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.SUBTRACT)

  // returnToday = () => this.changeDate(DATE_NAVIGATOR_ACTION.BACK_TO_TODAY)

  // onDateButtonClick = (event) => {
  //   this.setState({ showDateOverlay: true, anchor: event.target })
  // }

  // onDateOverlayClose = () => {
  //   this.setState({
  //     showDateOverlay: false,
  //     anchor: null,
  //   })
  // }

  // onDateChange = (newDate) => {
  //   this.setState({ date: newDate.toDate() })
  // }

  // Toolbar = ({ label, view, ...props }) => {
  //   const { classes } = this.props
  //   const { showDateOverlay, anchor } = this.state
  //   return (
  //     <GridContainer>
  //       <GridItem xs md={2}>
  //         <div>
  //           <IconButton color='primary' onClick={this.subtractDate}>
  //             <ChevronLeft />
  //           </IconButton>
  //           <Button simple color='primary' onClick={this.returnToday}>
  //             Today
  //           </Button>
  //           <IconButton color='primary' onClick={this.addDate}>
  //             <ChevronRight />
  //           </IconButton>
  //         </div>
  //       </GridItem>
  //       <GridItem xs md={8} container justify='center'>
  //         <Button
  //           block
  //           simple
  //           size='lg'
  //           className={classnames(classes.dateButton)}
  //           color='primary'
  //           onClick={this.onDateButtonClick}
  //         >
  //           {label}
  //         </Button>
  //         <Popover
  //           id='react-datetime'
  //           open={showDateOverlay}
  //           anchorEl={anchor}
  //           anchorOrigin={{
  //             vertical: 'bottom',
  //             horizontal: 'center',
  //           }}
  //           onClose={this.onDateOverlayClose}
  //           style={{ width: 500, height: 500 }}
  //         >
  //           <Datetime
  //             onChange={this.onDateChange}
  //             value={moment(this.state.date)}
  //             dateFormat='YYYY-MM-DD'
  //             timeFormat={false}
  //             input={false}
  //           />
  //         </Popover>
  //       </GridItem>
  //       <GridItem xs md={2} container justify='flex-end'>
  //         <div>
  //           <CustomDropdown
  //             buttonText={view}
  //             buttonProps={{
  //               color: 'primary',
  //               simple: true,
  //             }}
  //             onClick={this.onViewChange}
  //             dropdownList={CalendarViews}
  //           />
  //         </div>
  //       </GridItem>
  //     </GridContainer>
  //   )
  // }

  onViewChange = (view) => {
    this.setState({ view })
  }

  jumpToDate = (date) => {
    this.setState({
      date,
    })
  }

  toggleModal = () => {
    const { showAppointmentForm } = this.state
    this.setState({ showAppointmentForm: !showAppointmentForm })
  }

  moveEvent = ({
    event,
    start,
    end,
    resourceId,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    const { events } = this.state

    const idx = events.indexOf(event)
    let { allDay } = event

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, resourceId, allDay }

    const nextEvents = [
      ...events,
    ]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })
  }

  newEvent = (event) => {
    let idList = this.state.events.map((a) => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: 'New Event',
      allDay: event.slots.length === 1,
      start: event.start,
      end: event.end,
      resourceId: event.resourceId,
      type: 'add',
    }

    this.setState({
      slotInfo: hour,
      showAppointmentForm: true,
    })
  }

  addEvent = (newEvent) => {
    const { events } = this.state

    this.setState({
      events: [
        ...events,
        newEvent,
      ],
      showAppointmentForm: false,
      slotInfo: {},
    })
  }

  updateEvent = (updatedEvent) => {
    const { events } = this.state
    this.setState({
      events: [
        ...events.filter((event) => event.id !== updatedEvent.id),
        updatedEvent,
      ],
      showAppointmentForm: false,
      slotInfo: {},
    })
  }

  handleSelectEvent = (event) => {
    this.setState({
      slotInfo: { ...event, type: 'update' },
      showAppointmentForm: true,
    })
  }

  render () {
    const { showAppointmentForm } = this.state
    // console.log('index', this.state)
    return (
      <CommonHeader Icon={<Assignment />}>
        <CalendarView
          // --- event handlers ---
          handleMoveEvent={this.moveEvent}
          handleNewEvent={this.newEvent}
          handleJumpToDate={this.jumpToDate}
          handleViewChange={this.onViewChange}
          handleSelectEvent={this.handleSelectEvent}
          handleDoubleClick={this.toggleModal}
          // --- variables ---
          displayDate={this.state.date}
          minDate={this.state.minTime}
          maxDate={this.state.maxTime}
          calendarEvents={this.state.events}
          calendarView={this.state.view}
          resources={resources}
        />

        <CommonModal
          open={showAppointmentForm}
          title='Appointment Form'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          // maxWidth='md'
          showFooter={false}
        >
          {showAppointmentForm ? (
            <Form
              resources={resources}
              slotInfo={this.state.slotInfo}
              handleAddEvents={this.addEvent}
              handleUpdateEvents={this.updateEvent}
            />
          ) : null}
        </CommonModal>
      </CommonHeader>
    )
  }
}
export default withStyles(styles)(FixSelect)
