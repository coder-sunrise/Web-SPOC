import React, { memo, Fragment, useState, useRef } from 'react'
import { formatMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import Print from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  Button,
  CommonModal,
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
import { CALENDAR_RESOURCE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

const createPayload = (
  values,
  viewOtherApptAccessRight,
  isActiveCalendarResource,
) => {
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
    dob,
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

  let selectedDoctor = filterByDoctor

  if (
    (!viewOtherApptAccessRight ||
      viewOtherApptAccessRight.rights !== 'enable') &&
    !isActiveCalendarResource
  ) {
    selectedDoctor = [-1]
  }
  if (isPrint) {
    return {
      ...commonPayload,
      bookBy: bookBy.length > 0 ? bookBy : undefined,
      doctor: selectedDoctor.length > 0 ? selectedDoctor : undefined,
      room: filterByRoomBlockGroup > 0 ? filterByRoomBlockGroup : undefined,
      SearchText: searchValue || '',
      ApptType:
        filterByApptType.length == 0 || filterByApptType.indexOf(-99) > -1
          ? undefined
          : filterByApptType,
      ApptStatus:
        filterByAppointmentStatus.length > 0
          ? filterByAppointmentStatus
          : undefined,
      dob: dob,
    }
  }

  return {
    ...commonPayload,
    bookBy: bookBy.join() || undefined,
    doctor: selectedDoctor.join() || undefined,
    room: filterByRoomBlockGroup.join() || undefined,
    searchValue: searchValue || undefined,
    appType:
      filterByApptType.indexOf(-99) >= 0 ? undefined : filterByApptType.join(),
    appStatus: filterByAppointmentStatus.join() || undefined,
    isIncludeRescheduledByClinic: true,
    isIncludeHistory: true,
    dob: dob,
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

  const { viewOtherApptAccessRight, isActiveCalendarResource } = restValues

  const [showReport, setShowReport] = useState(false)

  const maxDoctorTagCount = filterByDoctor.length <= 1 ? 1 : 0
  const maxApptTypeTagCount = filterByApptType.length <= 1 ? 1 : 0
  const maxRoomBlockGroupTagCount = filterByRoomBlockGroup.length <= 1 ? 1 : 0
  const maxAppointmentStatusTagCount =
    filterByAppointmentStatus.length <= 1 ? 1 : 0
  const renderDropdown = option => {
    if (option.resourceType === CALENDAR_RESOURCE.DOCTOR)
      return (
        <DoctorLabel
          doctor={{ clinicianProfile: option.clinicianProfileDto }}
        />
      )
    return option.name
  }

  const toggleReport = () => {
    // if (!values.searchValue) return
    setShowReport(!showReport)
  }

  return (
    <Fragment>
      <GridContainer>
        <GridItem md={6}>
          <FastField
            name='searchValue'
            render={args => (
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
        <GridItem md={1}>
          <FastField
            name='dob'
            render={args => <DatePicker {...args} label='DOB' />}
          />
        </GridItem>
        <GridItem md={5}>
          <Field
            name='filterByDoctor'
            render={args => (
              <Authorized authority='appointment.viewotherappointment'>
                <CodeSelect
                  {...args}
                  // allLabel='All Doctors'
                  // disableAll
                  allValue={-99}
                  allowClear={false}
                  label='Filter by Resource'
                  mode='multiple'
                  localFilter={option => option.isActive}
                  code='ctcalendarresource'
                  valueField='id'
                  maxTagCount={maxDoctorTagCount}
                  maxTagPlaceholder='resources'
                  renderDropdown={renderDropdown}
                />
              </Authorized>
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='apptDate'
            render={args => (
              <DateRangePicker label='Appt Date From' label2='To' {...args} />
            )}
          />
        </GridItem>
        <GridItem md={1}>
          <FastField
            name='bookOn'
            render={args => <DatePicker label='Book On' {...args} />}
          />
        </GridItem>
        <GridItem md={5}>
          <Field
            name='bookBy'
            render={args => {
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
        {/* <GridItem md={6}>
          <FastField
            name='filterByRoomBlockGroup'
            render={args => {
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
        </GridItem> */}
        <GridItem md={6}>
          <Field
            name='filterByApptType'
            render={args => (
              <CodeSelect
                {...args}
                mode='multiple'
                allowClear={false}
                all={-99}
                label='Appt Type'
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
                maxTagCount={maxApptTypeTagCount}
                maxTagPlaceholder='appointment types'
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='filterByAppointmentStatus'
            render={args => {
              return (
                <CodeSelect
                  mode='multiple'
                  code='ltappointmentstatus'
                  label={formatMessage({
                    id: 'sms.appointment.status',
                  })}
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
            icon={<Search />}
            color='primary'
            size='sm'
            onClick={async () => {
              await setFieldValue('isPrint', false)
              handleSubmit()
            }}
          >
            Search
          </ProgressButton>
          <Authorized authority='appointment.newappointment'>
            <Button
              color='primary'
              size='sm'
              onClick={handleAddAppointmentClick}
            >
              <Add />
              Add Appointment
            </Button>
          </Authorized>
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
            ...createPayload(
              values,
              viewOtherApptAccessRight,
              isActiveCalendarResource,
            ),
          }}
          defaultScale={1.5}
        />
      </CommonModal>
    </Fragment>
  )
}

export default memo(
  withFormikExtend({
    // validationSchema: Yup.object().shape({
    //   searchValue: Yup.string().when('isPrint', {
    //     is: v => v === true,
    //     then: Yup.string().required(),
    //   }),
    // }),
    handleSubmit: (values, { props }) => {
      const {
        dispatch,
        viewOtherApptAccessRight,
        isActiveCalendarResource,
      } = props

      dispatch({
        type: `appointment/query`,
        payload: {
          apiCriteria: {
            ...createPayload(
              values,
              viewOtherApptAccessRight,
              isActiveCalendarResource,
            ),
          },
        },
      })
    },
  })(FilterBar),
)
