import React, { memo } from 'react'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Print from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'

import {
  Button,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  Field,
  CodeSelect,
  withFormikExtend,
  DateRangePicker,
  ClinicianSelect,
  DatePicker,
  Select,
} from '@/components'
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import { appointmentStatusReception } from '@/utils/codes'

const FilterBar = ({ values, handleSubmit, handleAddAppointmentClick }) => {
  const {
    filterByDoctor = [],
    filterByApptType = [],
    filterByRoomBlockGroup = [],
  } = values

  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxApptTypeTagCount = filterByApptType.length <= 1 ? 1 : 0
  const maxRoomBlockGroupTagCount = filterByRoomBlockGroup.length <= 1 ? 1 : 0
  const renderDropdown = (option) => <DoctorLabel doctor={option} />

  return (
    <GridContainer>
      <GridItem md={6}>
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
      <GridItem md={6}>
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
      <GridItem md={6}>
        <FastField
          name='apptDate'
          render={(args) => (
            <DateRangePicker label='Appt Date From' label2='To' {...args} />
          )}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='filterByRoomBlockGroup'
          render={(args) => {
            return (
              <CodeSelect
                label='Room'
                code='ctRoom'
                mode='multiple'
                // allValue={-99}
                maxTagCount={maxRoomBlockGroupTagCount}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={6}>
        <Field
          name='bookBy'
          render={(args) => {
            return <ClinicianSelect label='Book By' {...args} />
          }}
        />
      </GridItem>

      <GridItem md={6}>
        <Field
          name='filterByApptType'
          render={(args) => (
            <CodeSelect
              {...args}
              mode='multiple'
              allowClear={false}
              all={-99}
              label='Appt Type'
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
              maxTagCount={maxApptTypeTagCount}
              maxTagPlaceholder='appointment types'
            />
          )}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='bookOn'
          render={(args) => <DatePicker label='Book On' {...args} />}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='appointmentStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.appointment.status',
                })}
                options={appointmentStatusReception}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs md={12}>
        <Button color='primary' size='sm' onClick={handleSubmit}>
          <Search />
          Search
        </Button>
        <Button color='primary' size='sm' onClick={handleAddAppointmentClick}>
          <Add />
          Add Appointment
        </Button>
        <Button color='primary' size='sm'>
          <Print />
          Print
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default memo(
  withFormikExtend({
    enableReinitialize: true,
    handleSubmit: (values, { props }) => {
      const { dispatch } = props
      const payload = {}
      dispatch({
        type: 'appointment/query',
        payload,
      }).then((r) => {})
    },
  })(FilterBar),
)
