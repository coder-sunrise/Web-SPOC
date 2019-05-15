import React, { PureComponent } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { connect } from 'dva'
// material ui
import { Paper, LinearProgress, withStyles } from '@material-ui/core'
// dx-react-scheduler
import { connectProps } from '@devexpress/dx-react-core'
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler'
import {
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DayView,
  Scheduler,
  WeekView,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui'
// sub component
import {
  AptFormPopUp,
  AppointmentContainer,
  AppointmentContent,
  AppointmentComponent,
} from './Appointments'
import TooltipHeader from './Tooltip/TooltipHeader'
import TooltipContent from './Tooltip/TooltipContent'
import EditButton from './Tooltip/EditButton'
import { CALENDAR_VIEWS } from '../utils'

const styles = (theme) => ({
  container: {
    borderRadius: '5px',
  },
  flexibleSpace: {
    margin: '0 auto 0 0',
  },
  flexibleSpaceContent: {
    display: 'flex',
    minWidth: '450px',
  },
  doctorSelector: {
    marginLeft: theme.spacing.unit * 2,
    minWidth: 300,
  },
  doctorSelectorItem: {
    display: 'flex',
    alignItems: 'center',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  showAllBtn: {
    paddingLeft: '10px',
  },
})

const _dateFormat = 'DD MMM YYYY'

@connect(({ appointment }) => ({ appointment }))
class Calendar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      showOverlay: false,
      aptFormVisible: false,
      addedAppointment: {},
      editingAppointmentId: undefined,
    }

    this.handleCommitChanges = this.handleCommitChanges.bind(this)
    this.onEditingAppointmentIdChange = this.onEditingAppointmentIdChange.bind(
      this,
    )
    this.toggleAptFormVisibility = this.toggleAptFormVisibility.bind(this)
    this._AptFormComponent = connectProps(AptFormPopUp, () => {
      const {
        aptFormVisible,
        editingAppointmentId,
        addedAppointment,
      } = this.state

      const { appointment } = this.props

      const appointmentData =
        appointment.aptData.filter(
          (apt) => apt.id === editingAppointmentId,
        )[0] || addedAppointment

      return {
        visible: aptFormVisible,
        appointmentData,
        commitChanges: this.handleCommitChanges,
        visibleChange: this.toggleAptFormVisibility,
        onEditingAptIDChange: this.onEditingAppointmentIdChange,
      }
    })
  }

  componentDidUpdate = () => {
    this._AptFormComponent.update()
  }

  onEditingAppointmentIdChange = (editingAppointmentId) => {
    this.setState({ editingAppointmentId })
  }

  onAddedAppointmentChange = (addedAppointment) => {
    this.setState({ addedAppointment })
    this.onEditingAppointmentIdChange(undefined)
  }

  toggleAptFormVisibility = () => {
    const { aptFormVisible } = this.state
    this.setState({
      aptFormVisible: !aptFormVisible,
    })
  }

  handleCommitChanges = ({ added, changed, deleted }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'appointment/commitChanges',
      added,
      changed,
      deleted,
    })
  }

  toggleDateOverlayVisibility = () => {
    const { showOverlay } = this.state
    this.setState({ showOverlay: !showOverlay })
  }

  AppointmentComponentBase = ({
    classes,
    children,
    style,
    data,
    onDoubleClick,
    ...restProps
  }) => {
    return (
      <Appointments.Appointment
        className={classnames([
          classes.container,
        ])}
        data={data}
        onDoubleClick={this.toggleAppointmentForm}
        {...restProps}
      >
        {children}
      </Appointments.Appointment>
    )
  }

  render () {
    const { aptFormVisible } = this.state
    const { appointment } = this.props
    const { displayData, currentView } = appointment
    console.log('appointment state', this.state)
    return (
      <React.Fragment>
        <Paper>
          <Scheduler data={displayData}>
            <ViewState
              currentDate={moment(appointment.currentDate).format(_dateFormat)}
              currentViewName={currentView}
              // onCurrentViewNameChange={this.handleViewChange}
            />
            <EditingState
              onCommitChanges={this.handleCommitChanges}
              onEditingAppointmentIdChange={this.onEditingAppointmentIdChange}
              onAddedAppointmentChange={this.onAddedAppointmentChange}
            />

            <DayView
              name={CALENDAR_VIEWS.DAY}
              startDayHour={8}
              endDayHour={19}
              cellDuration={15}
            />
            <WeekView
              name={CALENDAR_VIEWS.WEEK}
              startDayHour={8}
              endDayHour={19}
              cellDuration={15}
            />
            <MonthView name={CALENDAR_VIEWS.MONTH} />
            <Appointments
              containerComponent={AppointmentContainer}
              appointmentContentComponent={AppointmentContent}
              appointmentComponent={AppointmentComponent}
            />
            <AppointmentTooltip
              showOpenButton
              showCloseButton
              showDeleteButton
              commandButtonComponent={EditButton}
              headerComponent={TooltipHeader}
              contentComponent={TooltipContent}
            />
            <AppointmentForm
              visible={aptFormVisible}
              onVisibilityChange={this.toggleAptFormVisibility}
              popupComponent={this._AptFormComponent}
            />
          </Scheduler>
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'Calendar' })(Calendar)
