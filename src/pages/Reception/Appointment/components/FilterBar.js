import React, { PureComponent } from 'react'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
// formik
import { withFormik, FastField } from 'formik'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  CodeSelect,
  SizeContainer,
} from '@/components'
// sub components
import { AppointmentTypeLabel } from 'medisys-components'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
  },
  antdSelect: {
    width: '100%',
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

@withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    appointmentType: [],
    doctorProfile: [],
  }),
})
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
    console.log({ values })
    // const { handleUpdateFilter, filter } = this.props

    // handleUpdateFilter({
    //   ...filter,
    //   appointmentType: this.processValues(values),
    // })
  }

  processValues = (values) => {
    const newItemAll = values.indexOf('all') === values.length - 1

    let processedValues = [
      ...values,
    ]
    if (newItemAll) {
      // new item === 'all', clear list and left 'all' only
      processedValues = values.filter((eachValue) => eachValue === 'all')
    } else {
      // new item !== 'all'
      processedValues =
        values.includes('all') && values.length > 1
          ? values.filter((eachValue) => eachValue !== 'all')
          : values
    }

    return processedValues
  }

  onFilterByDoctorChange = (event) => {
    const { target } = event
    const { handleUpdateFilter, filter } = this.props

    const values = target !== undefined ? target : event
    handleUpdateFilter({
      ...filter,
      doctors: this.processValues(values),
    })
  }

  render () {
    const { searchQuery, isTyping } = this.state
    const { classes, filter, onDoctorEventClick, values } = this.props

    const maxDoctorTagCount = values.doctorProfile.length === 1 ? 1 : 0
    const maxDoctorTagPlaceholder = `${values.doctorProfile
      .length} doctors selected...`

    const maxAppointmentTagCount = values.appointmentType.length === 1 ? 1 : 0
    const maxAppointmentTagPlaceholder = `${values.appointmentType
      .length} appointment types selected...`

    return (
      <SizeContainer>
        <React.Fragment>
          <GridContainer>
            <GridItem xs md={3}>
              <TextField
                value={searchQuery}
                onChange={this.onSearchQueryChange}
                label={formatMessage({
                  id: 'reception.appt.searchByPatientName',
                })}
                suffix={isTyping && <CircularProgress />}
              />
            </GridItem>
            <GridItem xs md={3}>
              <FastField
                name='doctorProfile'
                render={(args) => (
                  <CodeSelect
                    {...args}
                    code='doctorprofile'
                    label='Filter by Doctor'
                    mode='multiple'
                    labelField='clinicianInfomation.name'
                    maxTagCount={maxDoctorTagCount}
                    maxTagPlaceholder={maxDoctorTagPlaceholder}
                    renderDropdown={(option) => {
                      return (
                        <div>
                          <p>MCR No.: {option.doctorMCRNo}</p>
                          <p>
                            {`${option.clinicianInfomation.title} ${option
                              .clinicianInfomation.name}`}
                          </p>
                        </div>
                      )
                    }}
                  />
                )}
              />
            </GridItem>
            <GridItem
              xs
              md={3}
              className={classnames(classes.selectorContainer)}
            >
              <FastField
                name='appointmentType'
                render={(args) => (
                  <CodeSelect
                    {...args}
                    mode='multiple'
                    label='Filter by Appointment Type'
                    code='ctappointmenttype'
                    labelField='displayValue'
                    renderDropdown={(option) => (
                      <AppointmentTypeLabel
                        color={option.tagColorHex}
                        label={option.displayValue}
                      />
                    )}
                    maxTagCount={maxAppointmentTagCount}
                    maxTagPlaceholder={maxAppointmentTagPlaceholder}
                  />
                )}
              />
            </GridItem>

            <GridItem
              xs
              md={3}
              container
              justify='flex-end'
              alignItems='center'
            >
              <GridItem>
                <Button color='info' onClick={onDoctorEventClick} size='sm'>
                  <AddIcon />
                  Doctor Block
                </Button>
              </GridItem>
            </GridItem>
          </GridContainer>
        </React.Fragment>
      </SizeContainer>
    )
  }
}

export default withStyles(styles, { name: 'CalendarFilterBar' })(FilterBar)
