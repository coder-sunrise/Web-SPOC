import React from 'react'
import moment from 'moment'
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import { Assignment, ChevronLeft, ChevronRight } from '@material-ui/icons'
// big calendar
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// events data
import { dndEvents } from './events'
import Form from './Form'
import {
  Button,
  CommonHeader,
  CommonModal,
  CustomDropdown,
  GridContainer,
  GridItem,
} from '@/components'
// import { DatePicker as ANTDatePicker } from 'antd'
import { defaultColorOpts, AppointmentTypeAsColor } from './setting'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const styles = (theme) => ({
  'event-checkup': {
    backgroundColor: theme.palette.error.main,
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
]

const DATE_NAVIGATOR_ACTION = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  BACK_TO_TODAY: 'today',
}

@withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: () => ({
    TestDatePicker2: '20190522',
    TestDateRange: [
      '20190522',
      '20190525',
    ],
  }),
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

  changeDate = (action) => {
    const type = {
      [BigCalendar.Views.DAY]: 'days',
      [BigCalendar.Views.WEEK]: 'weeks',
      [BigCalendar.Views.MONTH]: 'months',
    }

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

  Toolbar = (toolbarProps) => {
    const { label, view, views } = toolbarProps
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
        <GridItem xs md={8}>
          <Button block color='primary' simple>
            <h4 style={{ fontWeight: 500 }}>{label}</h4>
          </Button>
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
              dropdownList={views}
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

  eventColors = (event, start, end, isSelected) => {
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
    }
    console.log('slotInfo', hour)
    this.setState({
      slotInfo: hour,
      showAppointmentForm: true,
    })
  }

  addEvent = (newEvent) => {
    const { events } = this.state
    console.log({ newEvent })
    this.setState({
      events: [
        ...events,
        newEvent,
      ],
      showAppointmentForm: false,
      slotInfo: {},
    })
  }

  handleSelectEvent = (event) => {
    this.setState({
      slotInfo: { ...event },
      showAppointmentForm: true,
    })
  }

  render () {
    const { showAppointmentForm } = this.state
    console.log('index', this.state)
    return (
      <CommonHeader Icon={<Assignment />}>
        {/*  
        <BigCalendar
          localizer={localizer}
          min={this.state.minTime}
          max={this.state.maxTime}
          selectable
          events={this.state.events}
          defaultView='day'
          // resources={resources}
          // resourceIdAccessor='resourceId'
          // resourceTitleAccessor='resourceTitle'
          defaultDate={today}
          onSelectEvent={this.selectedEvent}
          onSelectSlot={this.addNewEventAlert}
          eventPropGetter={this.eventColors}
        />
      */}

        <DragAndDropCalendar
          components={{
            toolbar: this.Toolbar,
          }}
          // --- values props ---
          date={this.state.date}
          localizer={localizer}
          min={this.state.minTime}
          max={this.state.maxTime}
          events={this.state.events}
          view={this.state.view}
          // step={15}
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
          <Form
            slotInfo={this.state.slotInfo}
            handleAddEvents={this.addEvent}
          />
        </CommonModal>
      </CommonHeader>
    )
  }
}
export default withStyles(styles)(FixSelect)
