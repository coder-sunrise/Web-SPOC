import React, { memo, Fragment, useState, useRef } from 'react'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Print from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import moment from 'moment'
import ReactToPrint from 'react-to-print'
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
  reversedDateFormat,
} from '@/components'
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import { appointmentStatusReception } from '@/utils/codes'
import AppointmentPrintPreview from './AppointmentPrintPreview'

const FilterBar = ({
  values,
  handleSubmit,
  handleAddAppointmentClick,
  appointment,
  setFieldValue,
}) => {
  const {
    filterByDoctor = [],
    filterByApptType = [],
    filterByRoomBlockGroup = [],
    filterByAppointmentStatus = [],
  } = values

  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxApptTypeTagCount = filterByApptType.length <= 1 ? 1 : 0
  const maxRoomBlockGroupTagCount = filterByRoomBlockGroup.length <= 1 ? 1 : 0
  const maxAppointmentStatusTagCount =
    filterByAppointmentStatus.length <= 1 ? 1 : 0
  const renderDropdown = (option) => <DoctorLabel doctor={option} />

  const componentRef = useRef()

  const getAllRelatedAppt = async () => {
    await setFieldValue('print', true)
    await handleSubmit()
    await new Promise((r, j) => setTimeout(r, 3000))
  }

  return (
    <Fragment>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name='searchValue'
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
                // disableAll
                // allValue={-99}
                allValueOption={{
                  clinicianProfile: {
                    name: 'All',
                    id: -99,
                  },
                }}
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
                  maxTagPlaceholder='rooms'
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
              return (
                <ClinicianSelect
                  label='Book By'
                  noDefaultValue
                  mode='multiple'
                  maxTagPlaceholder='book by'
                  {...args}
                />
              )
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
            name='filterByAppointmentStatus'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'sms.appointment.status',
                  })}
                  mode='multiple'
                  options={appointmentStatusReception}
                  maxTagCount={maxAppointmentStatusTagCount}
                  maxTagPlaceholder='appointment status'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs md={12}>
          <Button
            color='primary'
            size='sm'
            onClick={async () => {
              await setFieldValue('print', undefined)
              handleSubmit()
            }}
          >
            <Search />
            Search
          </Button>
          <Button color='primary' size='sm' onClick={handleAddAppointmentClick}>
            <Add />
            Add Appointment
          </Button>

          {/* <ReactToPrint
            trigger={() => (
              <Button color='primary' size='sm'>
                <Print /> Print
              </Button>
            )}
            content={() => componentRef.current}
            onBeforeGetContent={getAllRelatedAppt}
            copyStyles={false}
          /> */}
        </GridItem>
      </GridContainer>

      <div style={{ display: 'none' }}>
        <AppointmentPrintPreview appointment={appointment} ref={componentRef} />
      </div>
    </Fragment>
  )
}

export default memo(
  withFormikExtend({
    handleSubmit: (values, { props }) => {
      const { dispatch } = props
      const {
        filterByDoctor = [],
        filterByRoomBlockGroup = [],
        filterByApptType = [],
        filterByAppointmentStatus = [],
        bookBy = [],
        bookOn,
        searchValue,
        apptDate,
        print,
      } = values
      const query = print ? 'queryAllAppointments' : 'query'
      dispatch({
        type: `appointment/${query}`,
        payload: {
          pagesize: print ? 9999 : 10,
          apiCriteria: {
            searchValue: searchValue || undefined,
            bookBy: bookBy.join() || undefined,
            bookOn: bookOn
              ? moment(bookOn).format(reversedDateFormat)
              : undefined,
            apptDateFrom:
              apptDate && apptDate.length > 0
                ? moment(apptDate[0]).formatUTC()
                : undefined,
            apptDateTo:
              apptDate && apptDate.length > 0
                ? moment(apptDate[1]).formatUTC(false)
                : undefined,
            doctor: filterByDoctor.join() || undefined,
            room: filterByRoomBlockGroup.join() || undefined,
            appType: filterByApptType.join() || undefined,
            appStatus: filterByAppointmentStatus.join() || undefined,
          },
        },
      })
    },
  })(FilterBar),
)
