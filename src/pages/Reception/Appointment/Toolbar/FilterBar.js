import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// custom component
import { GridContainer, GridItem, TextField, AntdSelect } from '@/components'
// sub components
import AppointmentTypeSelector from '../Calendar/Appointments/AppointmentTypeSelector'

const styles = () => ({
  searchField: {
    paddingTop: 22,
  },
  addPadding: {
    paddingTop: '15px !important',
  },
  selectorContainer: {
    textAlign: 'left',
  },
  showAllBtn: {
    paddingLeft: '10px',
  },
})

const doctors = [
  { value: 'all', name: 'All' },
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  { value: 'tan', name: 'Tan' },
  { value: 'tan1', name: 'Tan1' },
  { value: 'tan2', name: 'Tan2' },
  { value: 'tan3', name: 'Tan3' },
  { value: 'tan4', name: 'Tan4' },
  { value: 'tan5', name: 'Tan5' },
]

const getTagCount = (values = []) => {
  const value = `${values.length} Tags Selected`
  const result = [
    value,
  ]
  return result
}

@connect(({ appointment }) => ({ appointment }))
class FilterBar extends PureComponent {
  state = {
    searchQuery: '',
    isTyping: false,
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const { searchQuery: newQuery } = nextState
  //   const { searchQuery: oldQuery } = this.state

  //   const { appointment: { selectedDoctors: newSelectedDoctors } } = nextProps
  //   const { appointment: { selectedDoctors: oldSelectedDoctors } } = this.props

  //   const isSame =
  //     oldSelectedDoctors.length !== newSelectedDoctors.length
  //       ? false
  //       : compare(oldSelectedDoctors, newSelectedDoctors)

  //   return !isSame || newQuery !== oldQuery
  // }

  onSearchQueryChange = (event) => {
    const { target } = event
    this.setState({ searchQuery: target.value, isTyping: true })

    this.onSearchDebounced(target.value)
  }

  onSearchDebounced = debounce((value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'appointment/updateFilterQuery',
      searchQuery: value,
    })
    this.setState({
      isTyping: false,
    })
  }, 500)

  onFilterAppointmentTypeChange = (values) => {
    const { dispatch } = this.props

    dispatch({
      type: 'appointment/updateFilterAppointmentType',
      appointmentType: values,
    })
  }

  onFilterByDoctorChange = (event) => {
    const { target } = event
    const { dispatch } = this.props

    dispatch({
      type: 'appointment/updateFilterDoctor',
      doctors: target !== undefined ? target : event,
    })
  }

  render () {
    const { searchQuery, isTyping } = this.state
    const { classes, appointment } = this.props
    const { filter } = appointment

    const doctorsFilter = getTagCount(filter.doctors)

    return (
      <GridContainer>
        <GridItem className={classnames(classes.searchField)} xs md={4}>
          <TextField
            value={searchQuery}
            onChange={this.onSearchQueryChange}
            label={formatMessage({
              id: 'reception.appt.searchByPatientName',
            })}
            suffix={isTyping && <CircularProgress size={16} />}
          />
        </GridItem>
        <GridItem xs md={2}>
          <AntdSelect
            label='Filter by Doctor'
            mode='tags'
            options={doctors}
            value={doctorsFilter}
            onChange={this.onFilterByDoctorChange}
          />
        </GridItem>
        <GridItem xs md={4}>
          <GridItem className={classnames(classes.selectorContainer)}>
            <AppointmentTypeSelector
              label='Filter by Appointment Type'
              value={filter.appointmentType}
              onChange={this.onFilterAppointmentTypeChange}
              helpText='Leave blank to show all appointment type'
              mode='multiple'
            />
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'CalendarFilterBar' })(FilterBar)
