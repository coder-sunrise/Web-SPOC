import React, { PureComponent } from 'react'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  SizeContainer,
} from '@/components'
// sub components
import AppointmentTypeSelector from './AppointmentTypeSelector'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
  },
})

const doctors = [
  { value: 'all', name: 'All' },
  { value: 'medisys', name: 'Medisys' },
  { value: 'levinne', name: 'Dr Levinne' },
  { value: 'cheah', name: 'Dr Cheah' },
  { value: 'tan', name: 'Dr Tan' },
  { value: 'lim', name: 'Dr Lim' },
  { value: 'liu', name: 'Dr Liu' },
]

const getTagCount = (values = []) => {
  const value = `${values.length} Tags Selected`
  const result = [
    value,
  ]
  return result
}

class FilterBar extends PureComponent {
  state = {
    searchQuery: '',
    isTyping: false,
  }

  onSearchQueryChange = (event) => {
    const { target } = event
    this.setState({ searchQuery: target.value, isTyping: true })

    this.onSearchDebounced(target.value)
  }

  onSearchDebounced = debounce((value) => {
    const { handleUpdateFilter, filter } = this.props
    handleUpdateFilter({ ...filter, searchQuery: value })
    this.setState({
      isTyping: false,
    })
  }, 500)

  onFilterAppointmentTypeChange = (values) => {
    const { handleUpdateFilter, filter } = this.props
    handleUpdateFilter({ ...filter, appointmentType: values })
  }

  onFilterByDoctorChange = (event) => {
    const { target } = event
    const { handleUpdateFilter, filter } = this.props

    const values = target !== undefined ? target : event
    const newItemAll = values.indexOf('all') === values.length - 1

    let newDoctorsFilter = values
    if (newItemAll) {
      // new item === 'all', clear list and left 'all' only
      newDoctorsFilter = values.filter((doc) => doc === 'all')
    } else {
      // new item !== 'all'
      newDoctorsFilter =
        values.includes('all') && values.length > 1
          ? values.filter((doc) => doc !== 'all')
          : values
    }

    handleUpdateFilter({
      ...filter,
      doctors: [
        ...newDoctorsFilter,
      ],
    })
  }

  render () {
    const { searchQuery, isTyping } = this.state
    const { classes, filter, onDoctorEventClick } = this.props

    // const doctorsFilter = getTagCount(filter.doctors)

    return (
      <SizeContainer>
        <GridContainer>
          <GridItem xs md={2}>
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
            <Select
              label='Filter by Doctor'
              mode='multiple'
              options={doctors}
              value={filter.doctors}
              onChange={this.onFilterByDoctorChange}
            />
          </GridItem>
          <GridItem xs md={3} className={classnames(classes.selectorContainer)}>
            <AppointmentTypeSelector
              label='Filter by Appointment Type'
              value={filter.appointmentType}
              onChange={this.onFilterAppointmentTypeChange}
              // helpText='Leave blank to show all appointment type'
              mode='multiple'
            />
          </GridItem>

          <GridItem xs md={5} container justify='flex-end'>
            <GridItem>
              <Button color='info' onClick={onDoctorEventClick}>
                Doctor Event
              </Button>
            </GridItem>
          </GridItem>
        </GridContainer>
      </SizeContainer>
    )
  }
}

export default withStyles(styles, { name: 'CalendarFilterBar' })(FilterBar)
