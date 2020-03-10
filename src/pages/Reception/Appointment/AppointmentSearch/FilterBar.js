import React, { memo, Fragment, useState, useRef } from 'react'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Print from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import moment from 'moment'
import Yup from '@/utils/yup'
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
  ProgressButton,
} from '@/components'
import {
  AppointmentTypeLabel,
  DoctorLabel,
  ReportViewer,
} from '@/components/_medisys'
import { appointmentStatusReception } from '@/utils/codes'

const createPayload = (values) => {
  const {
    filterByDoctor = [],
    filterByRoomBlockGroup = [],
    filterByApptType = [],
    filterByAppointmentStatus = [],
    bookBy = [],
    bookOn,
    searchValue,
    apptDate,
    isPrint,
  } = values

  const commonPayload = {
    bookOn: bookOn ? moment(bookOn).format(reversedDateFormat) : undefined,
    apptDateFrom:
      apptDate && apptDate.length > 0
        ? moment(apptDate[0]).formatUTC()
        : undefined,
    apptDateTo:
      apptDate && apptDate.length > 0
        ? moment(apptDate[1]).formatUTC(false)
        : undefined,
  }

  if (isPrint) {
    return {
      ...commonPayload,
      bookBy: bookBy.length > 0 ? bookBy : undefined,
      doctor: filterByDoctor.length > 0 ? filterByDoctor : undefined,
      room: filterByRoomBlockGroup > 0 ? filterByRoomBlockGroup : undefined,
      SearchText: searchValue || undefined,
      ApptType: filterByApptType.length > 0 ? filterByApptType : undefined,
      AapptStatus:
        filterByAppointmentStatus.length > 0
          ? filterByAppointmentStatus
          : undefined,
    }
  }

  return {
    ...commonPayload,
    bookBy: bookBy.join() || undefined,
    doctor: filterByDoctor.join() || undefined,
    room: filterByRoomBlockGroup.join() || undefined,
    searchValue: searchValue || undefined,
    appType: filterByApptType.join() || undefined,
    appStatus: filterByAppointmentStatus.join() || undefined,
  }
}

const FilterBar = ({
  values,
  handleSubmit,
  handleAddAppointmentClick,
  setFieldValue,
  ...restValues
}) => {
  const {
    filterByDoctor = [],
    filterByApptType = [],
    filterByRoomBlockGroup = [],
    filterByAppointmentStatus = [],
  } = values

  const [
    showReport,
    setShowReport,
  ] = useState(false)

  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxApptTypeTagCount = filterByApptType.length <= 1 ? 1 : 0
  const maxRoomBlockGroupTagCount = filterByRoomBlockGroup.length <= 1 ? 1 : 0
  const maxAppointmentStatusTagCount =
    filterByAppointmentStatus.length <= 1 ? 1 : 0
  const renderDropdown = (option) => <DoctorLabel doctor={option} />

  const toggleReport = () => {
    if (!values.searchValue) return
    setShowReport(!showReport)
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
                autoFocus
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
          <ProgressButton
            icon={null}
            color='primary'
            size='sm'
            onClick={async () => {
              await setFieldValue('isPrint', false)
              handleSubmit()
            }}
          >
            <Search />
            Search
          </ProgressButton>
          <Button color='primary' size='sm' onClick={handleAddAppointmentClick}>
            <Add />
            Add Appointment
          </Button>
          <Button
            color='primary'
            size='sm'
            onClick={async () => {
              await setFieldValue('isPrint', true)
              toggleReport()
            }}
          >
            <Print />
            Print
          </Button>
        </GridItem>
      </GridContainer>

      <CommonModal
        open={showReport}
        onClose={toggleReport}
        title='Appointment'
        maxWidth='lg'
      >
        <ReportViewer
          showTopDivider={false}
          reportID={38}
          reportParameters={{
            ...createPayload(values),
          }}
        />
      </CommonModal>
    </Fragment>
  )
}

export default memo(
  withFormikExtend({
    validationSchema: Yup.object().shape({
      searchValue: Yup.string().when('isPrint', {
        is: (v) => v === true,
        then: Yup.string().required(),
      }),
    }),
    handleSubmit: (values, { props }) => {
      const { dispatch } = props

      dispatch({
        type: `appointment/query`,
        payload: {
          apiCriteria: {
            ...createPayload(values),
          },
        },
      })
    },
  })(FilterBar),
)
