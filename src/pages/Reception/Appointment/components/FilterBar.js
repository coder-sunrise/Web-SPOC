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
  SizeContainer,
} from '@/components'
// sub components
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'

const styles = () => ({
  selectorContainer: {
    textAlign: 'left',
  },
  antdSelect: {
    width: '100%',
  },
})

const FilterBar = ({
  classes,
  onDoctorEventClick,
  onAddAppointmentClick,
  handleUpdateFilter,
  values,
}) => {
  const onFilterClick = () => handleUpdateFilter(values)

  const renderDropdown = (option) => {
    return <DoctorLabel doctor={option} />
    // const { name, doctorProfile } = option
    // const title = option.title || ''
    // const mcrNo =
    //   doctorProfile !== null && doctorProfile !== undefined
    //     ? `(${doctorProfile.doctorMCRNo})`
    //     : ''
    // return <div>{`${title} ${name} ${mcrNo}`}</div>
  }
  const { filterByDoctor = [], filterByApptType = [] } = values
  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxDoctorTagPlaceholder = filterByDoctor
    ? `${filterByDoctor.filter((o) => o !== -99).length} doctors selected...`
    : ''

  const maxAppointmentTagCount = filterByApptType.length <= 1 ? 1 : 0
  const maxAppointmentTagPlaceholder = `${filterByApptType.length} appointment types selected...`
  return (
    <SizeContainer>
      <React.Fragment>
        <GridContainer>
          <GridItem xs md={3}>
            <FastField
              name='search'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.appt.searchByPatientName',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <Field
              name='filterByDoctor'
              render={(args) => (
                <CodeSelect
                  {...args}
                  allValue={-99}
                  allLabel='All Doctors'
                  allowClear={false}
                  label='Filter by Doctor'
                  mode='multiple'
                  code='clinicianprofile'
                  labelField='name'
                  valueField='id'
                  // code='doctorprofile'
                  // labelField='clinicianProfile.name'
                  // valueField='clinicianProfile.id'
                  maxTagCount={maxDoctorTagCount}
                  maxTagPlaceholder={maxDoctorTagPlaceholder}
                  renderDropdown={renderDropdown}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3} className={classnames(classes.selectorContainer)}>
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
                  maxTagCount={maxAppointmentTagCount}
                  maxTagPlaceholder={maxAppointmentTagPlaceholder}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={12}>
            <Button color='primary' size='sm' onClick={onFilterClick}>
              <Search />
              Filter
            </Button>
            <Button color='primary' size='sm' onClick={onAddAppointmentClick}>
              <AddIcon />
              Add Appointment
            </Button>
            <Button color='primary' size='sm' onClick={onDoctorEventClick}>
              <AddIcon />
              Add Doctor Block
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

const StyledFilterBar = withStyles(styles, { name: 'CalendarFilterBar' })(
  FilterBar,
)

export default memo(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      filterByDoctor: [
        -99,
      ],
      filterByApptType: [
        -99,
      ],
    }),
  })(StyledFilterBar),
)
