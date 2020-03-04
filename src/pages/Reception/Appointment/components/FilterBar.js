import React, { memo } from 'react'
import classnames from 'classnames'
// formik
import { withFormik, Field, FastField } from 'formik'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  ProgressButton,
} from '@/components'
// sub components
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
  },
  antdSelect: {
    width: '100%',
  },
})

const FilterBar = ({
  loading,
  classes,
  onDoctorEventClick,
  onAddAppointmentClick,
  handleUpdateFilter,
  toggleSearchAppointmentModal,
  values,
}) => {
  const onFilterClick = () => handleUpdateFilter(values)

  const renderDropdown = (option) => <DoctorLabel doctor={option} />

  const { filterByDoctor = [], filterByApptType = [] } = values
  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxAppointmentTagCount = filterByApptType.length <= 1 ? 1 : 0

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
              <CodeSelect
                {...args}
                // allLabel='All Doctors'
                disableAll
                // allValue={-99}
                // allValueOption={{
                //   clinicianProfile: {
                //     name: 'All',
                //     id: -99,
                //   },
                // }}
                allowClear={false}
                label='Filter by Doctor'
                mode='multiple'
                // code='clinicianprofile'
                // labelField='name'
                // valueField='id'
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
              />
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
                maxTagPlaceholder='appointment types'
              />
            )}
          />
        </GridItem>
        <GridItem md={1}>
          <ProgressButton
            icon={<Search />}
            color='primary'
            onClick={onFilterClick}
          >
            Filter
          </ProgressButton>
        </GridItem>

        <GridItem md={3}>
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

          <Button
            color='primary'
            size='sm'
            onClick={onDoctorEventClick}
            disabled={loading}
          >
            <AddIcon />
            Add Doctor Block
          </Button>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

const StyledFilterBar = withStyles(styles, { name: 'CalendarFilterBar' })(
  FilterBar,
)

export default memo(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ filterByDoctor }) => ({
      filterByDoctor: [
        ...filterByDoctor,
      ],
      filterByApptType: [
        -99,
      ],
    }),
  })(StyledFilterBar),
)
