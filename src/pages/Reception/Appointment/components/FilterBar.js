import React, { memo, useState } from 'react'
import classnames from 'classnames'
// formik
import { withFormik, Field, FastField } from 'formik'
// umi
import { formatMessage } from 'umi'
// material ui
import { withStyles, Fab, Paper } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import Refresh from '@material-ui/icons/Refresh'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import { connect } from 'dva'
import { compose } from 'redux'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  ProgressButton,
  Tooltip,
  Popover,
  DatePicker,
} from '@/components'
// sub components
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import { CALENDAR_VIEWS, CALENDAR_RESOURCE } from '@/utils/constants'
import FilterTemplateTooltip from './FilterTemplateTooltip'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
    minWidth: 290,
  },
  antdSelect: {
    width: '100%',
  },
  fabButtonStyle: {
    color: 'white',
  },
  container: {
    maxWidth: 450,
    minWidth: 450,
    padding: 15,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -12,
    marginBottom: -12,
  },
})
let count = 0
const FilterBar = props => {
  const {
    loading,
    classes,
    onDoctorEventClick,
    onAddAppointmentClick,
    handleUpdateFilter,
    toggleSearchAppointmentModal,
    values,
    calendarView,
  } = props
  const onFilterClick = async () => await handleUpdateFilter(values)

  const renderDropdown = option => {
    if (option.resourceType === CALENDAR_RESOURCE.DOCTOR)
      return (
        <DoctorLabel
          doctor={{ clinicianProfile: option.clinicianProfileDto }}
        />
      )
    return option.name
  }

  const { filterByDoctor = [], dob } = values
  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const [showFilterTemplate, setShowFilterTemplate] = useState(false)

  const handleFilterTemplate = () => {
    setShowFilterTemplate(!showFilterTemplate)
  }
  const handleApplyTemplate = selectedTemplate => {
    const {
      filterByApptType: appTypes,
      filterByDoctor: doctors,
      dob,
    } = selectedTemplate

    handleUpdateFilter({
      ...values,
      filterByApptType: appTypes,
      filterByDoctor: doctors,
      dob,
      filterBySingleDoctor: doctors && doctors.length ? doctors[0] : undefined,
    })
  }

  const isDayView = calendarView === CALENDAR_VIEWS.DAY
  return (
    <React.Fragment>
      <GridContainer alignItems='center'>
        <GridItem xs md={3}>
          <FastField
            name='search'
            render={args => (
              <TextField
                {...args}
                label={formatMessage({
                  id: 'reception.queue.patientSearchPlaceholder',
                })}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={1}>
          <FastField
            name='dob'
            render={args => <DatePicker {...args} label='DOB' />}
          />
        </GridItem>
        {isDayView && (
          <GridItem xs md={2} style={{ minWidth: 220 }}>
            <Field
              name='filterByDoctor'
              render={args => (
                <Authorized authority='appointment.viewotherappointment'>
                  <CodeSelect
                    {...args}
                    allowClear={false}
                    all={-99}
                    label='Filter by Resource'
                    mode='multiple'
                    localFilter={option => option.isActive}
                    code='ctcalendarresource'
                    valueField='id'
                    maxTagCount={maxDoctorTagCount}
                    maxTagPlaceholder='resources'
                    renderDropdown={renderDropdown}
                    onChange={v => {
                      sessionStorage.setItem(
                        'appointmentDoctors',
                        JSON.stringify(v),
                      )
                    }}
                  />
                </Authorized>
              )}
            />
          </GridItem>
        )}
        {!isDayView && (
          <GridItem xs md={2} style={{ minWidth: 220 }}>
            <Field
              name='filterBySingleDoctor'
              render={args => (
                <Authorized authority='appointment.viewotherappointment'>
                  <CodeSelect
                    {...args}
                    allowClear={false}
                    label='Filter by Resource'
                    localFilter={option => option.isActive}
                    code='ctcalendarresource'
                    valueField='id'
                    renderDropdown={renderDropdown}
                  />
                </Authorized>
              )}
            />
          </GridItem>
        )}
        <GridItem xs md={2} className={classnames(classes.selectorContainer)}>
          <div style={{ display: 'flex' }}>
            <Field
              name='filterByApptType'
              render={args => (
                <CodeSelect
                  {...args}
                  mode='multiple'
                  allowClear={false}
                  all={-99}
                  label='Filter by Appointment Type'
                  code='ctappointmenttype'
                  labelField='displayValue'
                  renderDropdown={option => (
                    <AppointmentTypeLabel
                      color={option.tagColorHex}
                      label={option.displayValue}
                    />
                  )}
                  defaultOptions={[
                    {
                      isExtra: true,
                      id: -99,
                      displayValue: 'All appointment types',
                    },
                  ]}
                  maxTagCount={0}
                  maxTagPlaceholder='appt. types'
                />
              )}
            />

            <Popover
              icon={null}
              trigger='click'
              placement='bottom'
              visible={showFilterTemplate}
              onVisibleChange={handleFilterTemplate}
              content={
                <Paper className={classes.container}>
                  <FilterTemplateTooltip
                    visible={showFilterTemplate}
                    filterByDoctor={
                      isDayView
                        ? values.filterByDoctor
                        : values.filterBySingleDoctor
                        ? [values.filterBySingleDoctor]
                        : []
                    }
                    filterByApptType={values.filterByApptType}
                    dob={values.dob}
                    handleFilterTemplate={handleFilterTemplate}
                    handleApplyTemplate={handleApplyTemplate}
                  />
                </Paper>
              }
            >
              <Tooltip title='Manage Filter Template'>
                <div style={{ marginLeft: 20, alignSelf: 'center', width: 30 }}>
                  <Fab
                    size='small'
                    color='secondary'
                    className={classes.fabButtonStyle}
                    onClick={handleFilterTemplate}
                  >
                    <BookmarkIcon />
                  </Fab>
                </div>
              </Tooltip>
            </Popover>
          </div>
        </GridItem>
        <GridItem xs md={3}>
          <ProgressButton
            icon={<Refresh />}
            color='primary'
            onClick={onFilterClick}
          >
            Refresh
          </ProgressButton>
          <Button color='primary' onClick={toggleSearchAppointmentModal}>
            {<Search />}Search Appointment
          </Button>
        </GridItem>
        <GridItem xs md={8}>
          <Authorized authority='appointment.newappointment'>
            <Button
              color='primary'
              onClick={onAddAppointmentClick}
              disabled={loading}
            >
              <AddIcon />
              Add Appointment
            </Button>
          </Authorized>

          <Authorized authority='settings.clinicsetting.doctorblock'>
            <Button
              color='primary'
              onClick={onDoctorEventClick}
              disabled={loading}
            >
              <AddIcon />
              Add Doctor Block
            </Button>
          </Authorized>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

const StyledFilterBar = withStyles(styles, { name: 'CalendarFilterBar' })(
  FilterBar,
)

export default compose(
  connect(({ appointment, calendar }) => ({
    appointment,
    calendarView: calendar.calendarView,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({
      filterByDoctor,
      filterBySingleDoctor,
      filterByApptType,
      dob,
      search,
    }) => {
      count += 1

      return {
        dob,
        search,
        filterByDoctor: [...filterByDoctor],
        filterBySingleDoctor,
        filterByApptType: filterByApptType || [-99],
        count,
      }
    },
  }),
)(memo(StyledFilterBar))
