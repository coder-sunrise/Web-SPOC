import React, { memo, useState } from 'react'
import moment from 'moment'
import classnames from 'classnames'
// formik
import { withFormik, Field, FastField } from 'formik'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { withStyles, Fab, Paper } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
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
} from '@/components'
// sub components
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
import FilterTemplateTooltip from './FilterTemplateTooltip'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
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
const FilterBar = (props) => {
  const {
    dispatch,
    loading,
    classes,
    onDoctorEventClick,
    onAddAppointmentClick,
    handleUpdateFilter,
    toggleSearchAppointmentModal,
    values,
  } = props
  const onFilterClick = () => handleUpdateFilter(values)

  const renderDropdown = (option) => <DoctorLabel doctor={option} />

  const { filterByDoctor = [] } = values
  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const [
    showFilterTemplate,
    setShowFilterTemplate,
  ] = useState(false)

  const handleFilterTemplate = () => {
    setShowFilterTemplate(!showFilterTemplate)
  }

  return (
    <React.Fragment>
      <GridContainer alignItems='center'>
        <GridItem xs md={3}>
          <FastField
            name='search'
            render={(args) => (
              <TextField
                {...args}
                label={formatMessage({
                  id: 'reception.queue.patientSearchPlaceholder',
                })}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={2}>
          <Field
            name='filterByDoctor'
            render={(args) => (
              <Authorized authority='appointment.viewotherappointment'>
                <CodeSelect
                  {...args}
                  disableAll
                  allowClear={false}
                  label='Filter by Doctor'
                  mode='multiple'
                  remoteFilter={{
                    'clinicianProfile.isActive': true,
                  }}
                  localFilter={(option) => option.clinicianProfile.isActive}
                  code='doctorprofile'
                  labelField='clinicianProfile.name'
                  valueField='clinicianProfile.id'
                  maxTagCount={maxDoctorTagCount}
                  maxSelected={5}
                  maxTagPlaceholder='doctors'
                  renderDropdown={renderDropdown}
                  onChange={(v) => {
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
        <GridItem xs md={2} className={classnames(classes.selectorContainer)}>
          <Field
            name='filterByApptType'
            render={(args) => (
              <CodeSelect
                {...args}
                mode='multiple'
                allowClear={false}
                all={-99}
                label='Filter by Appointment Type'
                code='ctappointmenttype'
                labelField='displayValue'
                renderDropdown={(option) => (
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
        </GridItem>

        <GridItem md={1}>
          <Popover
            icon={null}
            trigger='click'
            placement='bottom'
            visible={showFilterTemplate}
            onVisibleChange={handleFilterTemplate}
            content={
              <Paper className={classes.container}>
                <FilterTemplateTooltip
                  filterByDoctor={values.filterByDoctor}
                  filterByApptType={values.filterByApptType}
                  handleFilterTemplate={handleFilterTemplate}
                />
              </Paper>
            }
          >
            <Tooltip title='Manage Filter Template'>
              <Fab
                size='small'
                color='secondary'
                className={classes.fabButtonStyle}
                onClick={handleFilterTemplate}
              >
                <BookmarkIcon />
              </Fab>
            </Tooltip>
          </Popover>
        </GridItem>

        <GridItem md={4}>
          <ProgressButton
            icon={<Search />}
            color='primary'
            onClick={onFilterClick}
          >
            Filter
          </ProgressButton>
          <ProgressButton
            icon={<Search />}
            color='primary'
            onClick={toggleSearchAppointmentModal}
          >
            Search Appointment
          </ProgressButton>
        </GridItem>

        <GridItem xs md={12}>
          <Authorized authority='appointment.newappointment'>
            <Button
              color='primary'
              size='sm'
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
              size='sm'
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
  connect(({ appointment }) => ({
    appointment,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ filterByDoctor, appointment }) => {
      count += 1
      if (appointment.currentFilterTemplate) {
        const {
          filterByDoctor: doctorFilterTemplate,
          filterByApptType: apptTypeFiltertemplate,
        } = appointment.currentFilterTemplate
        return {
          filterByDoctor: [
            ...doctorFilterTemplate,
          ],
          filterByApptType: [
            ...apptTypeFiltertemplate,
          ],
          count,
        }
      }

      return {
        filterByDoctor: [
          ...filterByDoctor,
        ],
        filterByApptType: [
          -99,
        ],
        count,
      }
    },
  }),
)(memo(StyledFilterBar))
