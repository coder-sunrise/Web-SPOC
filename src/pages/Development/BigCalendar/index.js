import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// material ui
import {
  Popover,
  Popper,
  Paper,
  Fade,
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core'
import { Assignment, ChevronLeft, ChevronRight } from '@material-ui/icons'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// react-datetime
import Datetime from 'react-datetime'
// events data
import { dndEvents } from './events'
// view
// import CalendarView from './components/CalendarView'
import Event from './components/Event'
import FilterBar from './components/FilterBar'
import Form from './Form'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CommonHeader,
  CommonModal,
  CustomDropdown,
  GridContainer,
  GridItem,
  DatePicker,
  SizeContainer,
} from '@/components'

// import { DatePicker as ANTDatePicker } from 'antd'
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const styles = (theme) => ({
  typography: {
    padding: theme.spacing.unit,
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

const CalendarViews = [
  BigCalendar.Views.DAY,
  BigCalendar.Views.WEEK,
  BigCalendar.Views.MONTH,
]

const type = {
  [BigCalendar.Views.DAY]: 'days',
  [BigCalendar.Views.WEEK]: 'weeks',
  [BigCalendar.Views.MONTH]: 'months',
}

@withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: () => ({}),
})
class FixSelect extends React.PureComponent {
  state = {
    view: BigCalendar.Views.DAY,
    showAppointmentForm: false,
    showDateOverlay: false,
    events: dndEvents,
    anchor: null,
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

  eventColors = (event) => {
    // eventPropGetters = (event, start ,end, isSelected) => {}

    const { classes } = this.props
    const bg = 'background-'
    const hover = 'hover-'
    const eventClassName = event.color
      ? [
          classes[`${bg}${event.color}`],
          classes[`${hover}${event.color}`],
        ].join(' ')
      : classes.defaultColor

    return {
      className: eventClassName,
    }
  }

  changeDate = (action) => {
    let newDate = moment(new Date())
    const { view: currentView, date: currentDate } = this.state
    if (action === DATE_NAVIGATOR_ACTION.ADD) {
      newDate = moment(currentDate).add(1, type[currentView])
    } else if (action === DATE_NAVIGATOR_ACTION.SUBTRACT) {
      newDate = moment(currentDate).subtract(1, type[currentView])
    }

    this.setState({
      date: new Date(newDate.toString()),
    })
  }

  addDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.ADD)

  subtractDate = () => this.changeDate(DATE_NAVIGATOR_ACTION.SUBTRACT)

  returnToday = () => this.changeDate(DATE_NAVIGATOR_ACTION.BACK_TO_TODAY)

  onDateButtonClick = (event) => {
    this.setState({ showDateOverlay: true, anchor: event.target })
  }

  onDateOverlayClose = () => {
    this.setState({
      showDateOverlay: false,
      anchor: null,
    })
  }

  onDateChange = (newDate) => {
    this.setState({ date: newDate.toDate() })
  }

  Toolbar = ({ label, view, ...props }) => {
    const { classes } = this.props
    const { showDateOverlay, anchor } = this.state
    return (
      <GridContainer>
        <GridItem xs md={2}>
          <div>
            <IconButton color='primary' onClick={this.subtractDate}>
              <ChevronLeft />
            </IconButton>
            <Button simple color='primary' onClick={this.returnToday}>
              Today
            </Button>
            <IconButton color='primary' onClick={this.addDate}>
              <ChevronRight />
            </IconButton>
          </div>
        </GridItem>
        <GridItem xs md={8} container justify='center'>
          <Button
            block
            simple
            size='lg'
            className={classnames(classes.dateButton)}
            color='primary'
            onClick={this.onDateButtonClick}
          >
            {label}
          </Button>
          <Popover
            id='react-datetime'
            open={showDateOverlay}
            anchorEl={anchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            onClose={this.onDateOverlayClose}
            style={{ width: 500, height: 500 }}
          >
            <Datetime
              onChange={this.onDateChange}
              value={moment(this.state.date)}
              dateFormat='YYYY-MM-DD'
              timeFormat={false}
              input={false}
            />
          </Popover>
        </GridItem>
        <GridItem xs md={2} container justify='flex-end'>
          <div>
            <CustomDropdown
              buttonText={view}
              buttonProps={{
                color: 'primary',
                simple: true,
              }}
              onClick={this.onViewChange}
              dropdownList={CalendarViews}
            />
          </div>
        </GridItem>
      </GridContainer>
    )
  }

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

  handleSelectEvent = (_, syntheticEvent) => {
    this.setState({
      showPopup: true,
      popupAnchor: syntheticEvent.currentTarget,
    })
  }

  handleClosePopover = () => {
    this.setState({ showPopup: false })
  }

  render () {
    const { showPopup, popupAnchor, showAppointmentForm } = this.state
    // console.log('index', this.state)
    const { classes } = this.props
    return (
      <CommonHeader Icon={<Assignment />}>
        <SizeContainer>
          <Popover
            id='event-popup'
            open={showPopup}
            anchorEl={popupAnchor}
            onClose={this.handleClosePopover}
            placement='top-start'
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
          >
            <CardHeader>
              <Typography className={classes.typography}>
                The content of the Popper.
              </Typography>
            </CardHeader>
            <CardBody>
              <Typography className={classes.typography}>
                The content of the Popper.
              </Typography>
              <Typography className={classes.typography}>
                The content of the Popper.
              </Typography>
              <Typography className={classes.typography}>
                The content of the Popper.
              </Typography>
            </CardBody>
          </Popover>
          <FilterBar />
          <DragAndDropCalendar
            components={{
              toolbar: this.Toolbar,
              event: Event,
            }}
            // --- values props ---
            date={this.state.date}
            localizer={localizer}
            min={this.state.minTime}
            max={this.state.maxTime}
            events={this.state.events}
            view={this.state.view}
            step={15}
            timeslots={2}
            // --- values props ---

            // --- functional props ---
            selectable
            resizable={false}
            // --- functional props ---

            // --- resources ---
            resources={resources}
            resourceIdAccessor='resourceId'
            resourceTitleAccessor='resourceTitle'
            // --- resources ---
            // --- event handlers ---
            onEventDrop={this.moveEvent}
            onSelectSlot={this.newEvent}
            // onDragStart={console.log}
            onNavigate={this.jumpToDate}
            onView={this.onViewChange}
            onSelectEvent={this.handleSelectEvent}
            onDoubleClickEvent={this.toggleModal}
            eventPropGetter={this.eventColors}
            // --- event handlers ---
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
        </SizeContainer>
      </CommonHeader>
    )
  }
}
export default withStyles(styles)(FixSelect)
