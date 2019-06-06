import React from 'react'
import moment from 'moment'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { IconButton, Button as MUIButton, withStyles } from '@material-ui/core'
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
  TextField,
  AntdInput,
  DateRangePicker,
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

const options = [
  { name: 'test', value: 'test' },
  { name: 'test1', value: 'test1' },
]

const antDOptions = [
  { name: 'Penang', value: 'penang' },
  { name: 'Singapore', value: 'singapore' },
  { name: 'United States', value: 'us' },
  { name: 'Canada', value: 'canada' },
  { name: 'Switzerland', value: 'switzerland' },
  { name: 'Chang Jiang', value: 'changjiang' },
  { name: 'Malaysia', value: 'malaysia' },
  { name: 'Vietnam', value: 'vietnam' },
  { name: 'Thailand', value: 'thailand' },
  { name: 'england', value: 'england' },
  { name: 'Denmark', value: 'denmark' },
  { name: 'Indonesia', value: 'indonesia' },
  { name: 'Brazil', value: 'brazil' },
  { name: 'Argentina', value: 'argentina' },
  { name: 'Roma', value: 'roma' },
  { name: 'Egypt', value: 'egypt' },
  { name: 'China', value: 'china' },
  { name: 'Taiwan', value: 'taiwan' },
  { name: 'Korea', value: 'korea' },
  { name: 'Japan', value: 'japan' },
  { name: 'South Korea', value: 'southkorea' },
  { name: 'Indo', value: 'indo' },
]

const ValidationSchema = Yup.object().shape({
  AntdInputError: Yup.string().required(),
  Test: Yup.string().required(),
  selectLocation: Yup.string().required(),
})

const localizer = BigCalendar.momentLocalizer(moment)
const today = new Date()

const resources = [
  { resourceId: 1, resourceTitle: 'Board room' },
  { resourceId: 2, resourceTitle: 'Training room' },
  { resourceId: 3, resourceTitle: 'Meeting room 1' },
  { resourceId: 4, resourceTitle: 'Meeting room 2' },
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

  jumpToDate = (date, fromView, toView) => {
    this.setState({
      date,
    })
  }

  selectedEvent = (event) => {
    console.log('selectedevent', event)
  }

  addNewEventAlert = (slotInfo) => {
    console.log('slotInfo', slotInfo)
    this.setState({
      slotInfo,
      showAppointmentForm: true,
    })
  }

  toggleModal = () => {
    const { showAppointmentForm } = this.state
    this.setState({ showAppointmentForm: !showAppointmentForm })
  }

  eventColors = (event, start, end, isSelected) => {
    const { classes } = this.props
    // let backgroundColor = 'event-'
    // event.color
    //   ? (backgroundColor = backgroundColor + event.color)
    //   : (backgroundColor = backgroundColor + 'default')

    const bg = 'background-'
    const hover = 'hover-'
    const eventClassName = event.color
      ? [
          classes[`${bg}${event.color}`],
          classes[`${hover}${event.color}`],
        ].join(' ')
      : classes.defaultColor

    console.log({ event, eventClassName })
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

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    // alert(`${event.title} was resized to ${start}-${end}`)
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
    // this.toggleModal()
    // const { events: oldEvents } = this.state
    // this.setState({
    //   events: [
    //     ...oldEvents,
    //     hour,
    //   ],
    // })
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

  render () {
    const { showAppointmentForm } = this.state
    const { values, classes } = this.props
    console.log('classes', classes)
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
          tooltipAccessor={(event) => {
            console.log('tooltipaccessor', event)
            return 'sometooltip'
          }}
          // --- resources ---
          // --- event handlers ---
          onEventDrop={this.moveEvent}
          onSelectSlot={this.newEvent}
          // onEventResize={this.resizeEvent}
          // onDragStart={console.log}
          onNavigate={this.jumpToDate}
          onView={this.onViewChange}
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
