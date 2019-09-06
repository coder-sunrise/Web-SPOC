import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  CommonModal,
  GridContainer,
  GridItem,
  SizeContainer,
  OutlinedTextField,
} from '@/components'
// medisys components
import { LoadingWrapper, Recurrence } from '@/components/_medisys'
// custom components
import PatientSearchModal from '../../PatientSearch'
import DeleteConfirmation from './DeleteConfirmation'
import AppointmentDataGrid from './AppointmentDataGrid'
import PatientInfoInput from './PatientInfo'
import AppointmentDateInput from './AppointmentDate'
// import Recurrence from './Recurrence'
import FormFooter from './FormFooter'
import SeriesUpdateConfirmation from '../../SeriesUpdateConfirmation'
// utils
import {
  ValidationSchema,
  mapPropsToValues,
  generateRecurringAppointments,
  mapDatagridToAppointmentResources,
  filterRecurrenceDto,
  compareDto,
  constructPayload,
} from './formikUtils'
import styles from './style'

const actionKeys = {
  insert: 'calendar/insertAppointment',
  save: 'calendar/saveAppointment',
  reschedule: 'calendar/rescheduleAppointment',
  delete: 'calendar/deleteDraft',
}

@connect(({ loginSEMR, loading, user, calendar, codetable }) => ({
  loginSEMR,
  loading,
  user: user.data,
  events: calendar.list,
  viewingAppointment: calendar.currentViewAppointment,
  isEditedAsSingleAppointment: calendar.isEditedAsSingleAppointment,
  appointmentStatuses: codetable.ltappointmentstatus,
}))
@withFormik({
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
})
class Form extends React.PureComponent {
  state = {
    showSearchPatientModal: false,
    showDeleteConfirmationModal: false,
    datagrid:
      this.props.values && this.props.values.currentAppointment
        ? this.props.values.currentAppointment.appointments_Resources
        : [],
    showSeriesUpdateConfirmation: false,
    tempNewAppointmentStatusFK: -1,
    isDataGridValid: false,
  }

  componentWillMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ltappointmentstatus' },
    })
    this.validateDataGrid()
  }

  onRecurrencePatternChange = async (recurrencePatternFK) => {
    const { setFieldValue, setFieldTouched } = this.props
    // reset other field first
    await setFieldValue('recurrenceDto.recurrenceDaysOfTheWeek', [])
    await setFieldValue('recurrenceDto.recurrenceDayOfTheMonth', null)
    await setFieldTouched('recurrenceDto.recurrenceDayOfTheMonth', false, false)
    await setFieldTouched('recurrenceDto.recurrenceDaysOfTheWeek', false, false)

    // initialize value accordingly
    if (recurrencePatternFK === 3) {
      await setFieldValue('recurrenceDto.recurrenceDayOfTheMonth', 1)
      await setFieldTouched('recurrenceDto.recurrenceDayOfTheMonth', true, true)
    }

    if (recurrencePatternFK === 2) {
      await setFieldValue('recurrenceDto.recurrenceDaysOfTheWeek', [])
      await setFieldTouched(
        'recurrenceDto.recurrenceDaysOfTheWeek',
        true,
        false,
      )
    }
  }

  toggleNewPatientModal = () => {
    this.props.dispatch({
      type: 'patient/openPatientModal',
    })
  }

  toggleSearchPatientModal = () => {
    const { showSearchPatientModal } = this.state
    this.setState({ showSearchPatientModal: !showSearchPatientModal })
  }

  onSearchPatient = async () => {
    const { dispatch, values } = this.props
    // this.searchPatient(values.patientName)
    const prefix = 'like_'
    const result = await dispatch({
      type: 'patientSearch/query',
      payload: {
        [`${prefix}name`]: values.patientName,
      },
    })
    result && this.toggleSearchPatientModal()
  }

  onSelectPatientClick = (patientProfile) => {
    const { id, patientAccountNo, name, mobileNo } = patientProfile
    const { setFieldValue, setFieldTouched } = this.props
    setFieldValue('patientProfileFK', id)
    setFieldValue('patientAccountNo', patientAccountNo)
    setFieldValue('patientName', name)
    setFieldValue('patientContactNo', mobileNo)

    setFieldTouched('patientName', true)
    setFieldTouched('contactNo', true)

    this.toggleSearchPatientModal()
  }

  closeDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmationModal: false,
    })
  }

  deleteDraft = (id) => {
    const { onClose, dispatch } = this.props
    dispatch({
      type: 'calendar/deleteDraft',
      id,
      callback: onClose,
    })
  }

  onCancelOrDeleteClick = () => {
    const { values, dispatch } = this.props
    if (values.appointmentStatusFk !== undefined) {
      if (values.appointmentStatusFk === '2') {
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: `Are you sure want to delete this draft appointment?`,
            onOpenConfirm: () => this.deleteDraft(values.id),
          },
        })
      } else {
        this.setState({
          showDeleteConfirmationModal: true,
        })
      }
    }
  }

  onConfirmCancelAppointment = ({ deleteType, reasonType, reason }) => {
    // const { handleDeleteEvent, slotInfo } = this.props
    // this.setState(
    //   {
    //     showDeleteConfirmationModal: false,
    //   },
    //   () => {
    //     handleDeleteEvent(slotInfo.id, slotInfo._appointmentID)
    //   },
    // )
  }

  onCommitChanges = ({ rows, deleted }) => {
    if (rows) {
      this.setState(
        {
          datagrid: rows,
        },
        this.validateDataGrid,
      )
    }
    if (deleted) {
      const { datagrid } = this.state
      this.setState(
        {
          datagrid: datagrid.filter((event) => !deleted.includes(event.id)),
        },
        this.validateDataGrid,
      )
    }
  }

  validateDataGrid = () => {
    const { datagrid = [] } = this.state

    let isDataGridValid = true

    // has at least 1 row of appointment_resources
    if (datagrid.length === 0) isDataGridValid = false

    // has 1 primary doctor
    const hasPrimaryDoctor = datagrid.reduce(
      (hasPrimary, row) => (row.isPrimaryClinician ? true : hasPrimary),
      false,
    )
    if (!hasPrimaryDoctor) isDataGridValid = false

    this.setState({ isDataGridValid })
  }

  _submit = async (validate = false) => {
    try {
      const {
        validateForm,
        resetForm,
        setSubmitting,
        handleSubmit,
        values,
        viewingAppointment,
        isEditedAsSingleAppointment,
        onClose,
        dispatch,
      } = this.props
      const {
        datagrid,
        tempNewAppointmentStatusFK: appointmentStatusFK,
      } = this.state
      handleSubmit() // fake submit to touch all fields
      setSubmitting(true)
      const formError = await validateForm(values)

      if (Object.keys(formError).length > 0) {
        console.log({ formError })
        setSubmitting(false)
        return
      }
      const {
        currentAppointment,
        appointments,
        recurrenceDto,
        overwriteEntireSeries,
        ...restValues
      } = values
      const appointmentGroupDto = {
        ...restValues,
      }
      const { recurrenceDto: originalRecurrenceDto = {} } = viewingAppointment

      const isEdit = restValues.id !== undefined
      const isRecurrenceChanged = values.isEnableRecurrence
        ? compareDto(recurrenceDto, originalRecurrenceDto)
        : false

      let payload = {}
      let actionKey = actionKeys.insert

      const appointmentResources = datagrid.map(
        mapDatagridToAppointmentResources(isRecurrenceChanged),
      )
      console.log({ appointmentResources, appointments })
      const singleAppointment = {
        ...currentAppointment,
        isEditedAsSingleAppointment:
          isEditedAsSingleAppointment ||
          currentAppointment.isEditedAsSingleAppointment,
        appointmentStatusFk: appointmentStatusFK,
        appointments_Resources: [
          ...appointmentResources.map((item, index) => ({
            ...item,
            sortOrder: item.sortOrder !== undefined ? item.sortOrder : index,
          })),
        ],
      }
      const [
        newRecurringAppointments,
        recurrenceEndDate,
      ] =
        !isEdit || isRecurrenceChanged
          ? generateRecurringAppointments(
              recurrenceDto,
              singleAppointment,
              restValues.isEnableRecurrence,
              isRecurrenceChanged,
            )
          : [
              appointments.reduce(
                (updated, appt) =>
                  appt.isEditedAsSingleAppointment && !overwriteEntireSeries
                    ? [
                        ...updated,
                      ]
                    : [
                        ...updated,
                        {
                          ...appt,
                          appointmentStatusFk: appointmentStatusFK,
                          appointmentRemarks:
                            currentAppointment.appointmentRemarks,
                          appointments_Resources: [
                            ...appt.appointments_Resources,
                          ],
                          isEditedAsSingleAppointment:
                            isEditedAsSingleAppointment ||
                            appt.isEditedAsSingleAppointment,
                        },
                      ],
                [],
              ),
              recurrenceDto.recurrenceEndDate,
            ]

      const newResources = appointmentResources.filter((item) => item.isNew)
      const oldResources = appointmentResources.filter((item) => !item.isNew)

      const finalAppointments = newRecurringAppointments.map((item) => {
        return {
          ...item,
          appointments_Resources: [
            ...item.appointments_Resources.reduce((resources, apptResource) => {
              const old = oldResources.find(
                (oldItem) => oldItem.sortOrder === apptResource.sortOrder,
              )
              if (old === undefined)
                return [
                  ...resources,
                  { ...apptResource, isDeleted: true },
                ]

              const {
                clinicianFK,
                appointmentTypeFK,
                startTime,
                endTime,
                roomFk,
                isPrimaryClinician,
              } = old
              return [
                ...resources,
                {
                  ...apptResource,
                  clinicianFK,
                  appointmentTypeFK,
                  startTime,
                  endTime,
                  roomFk,
                  isPrimaryClinician,
                },
              ]
            }, []),
            ...newResources,
          ],
        }
      })
      console.log({ newResources, oldResources, finalAppointments })

      let recurrence = null
      if (restValues.isEnableRecurrence) {
        if (isEdit && isRecurrenceChanged) {
          recurrence = { ...recurrenceDto, recurrenceEndDate }
        } else if (!isEdit) {
          recurrence = { ...recurrenceDto, recurrenceEndDate }
        } else {
          recurrence = { ...recurrenceDto }
        }
      }
      payload = {
        ...appointmentGroupDto,
        recurrenceDto: recurrence,
        appointments: newRecurringAppointments,
      }
      if (isEdit) {
        payload = {
          appointmentGroupDto: {
            ...appointmentGroupDto,
            appointments: finalAppointments,
          },
          recurrenceDto: recurrence,
          recurrenceChanged: isRecurrenceChanged,
          overwriteEntireSeries,
          editSingleAppointment: isEditedAsSingleAppointment,
        }
        actionKey =
          appointmentStatusFK === 5 ? actionKeys.reschedule : actionKeys.save
      }
      console.log({ payload })

      // setSubmitting(false)
      // dispatch({
      //   type: actionKey,
      //   payload,
      // }).then((response) => {
      //   console.log({ response })
      // })

      // if (validate) return
      // resetForm()
      // onClose && onClose()
    } catch (error) {
      console.log({ error })
    }
  }

  onDeleteClick = () => {}

  onValidateClick = () => {
    const appointmentStatus = this.props.appointmentStatuses.find(
      (item) => item.code === 'SCHEDULED',
    )
    const { tempNewAppointmentStatusFK } = this.state
    this.setState(
      {
        tempNewAppointmentStatusFK: appointmentStatus
          ? appointmentStatus.id
          : tempNewAppointmentStatusFK,
      },
      () => this._submit(true),
    )
  }

  onSaveDraftClick = () => {
    const {
      appointmentStatuses,
      values,
      isEditedAsSingleAppointment,
      viewingAppointment,
    } = this.props
    const appointmentStatusFK = appointmentStatuses.find(
      (item) => item.code === 'DRAFT',
    ).id
    this.setState(
      {
        tempNewAppointmentStatusFK: appointmentStatusFK,
      },
      () => {
        if (
          values.id !== undefined &&
          isEditedAsSingleAppointment &&
          viewingAppointment.isEnableRecurrence
        )
          this.openSeriesUpdateConfirmation()
        else this._submit()
      },
    )
  }

  onConfirmClick = () => {
    const {
      appointmentStatuses,
      values,
      isEditedAsSingleAppointment,
      viewingAppointment,
    } = this.props

    try {
      let newAppointmentStatusFK = appointmentStatuses.find(
        (item) => item.code === 'SCHEDULED',
      ).id
      const rescheduleFK = appointmentStatuses.find(
        (item) => item.code === 'RESCHEDULED',
      ).id
      if (
        values.currentAppointment &&
        values.currentAppointment.appointmentStatusFk === 1
      )
        newAppointmentStatusFK = rescheduleFK

      this.setState(
        {
          tempNewAppointmentStatusFK: newAppointmentStatusFK,
        },
        () => {
          if (
            values.id !== undefined &&
            !isEditedAsSingleAppointment &&
            viewingAppointment.isEnableRecurrence
          )
            this.openSeriesUpdateConfirmation()
          else {
            this._submit()
          }
          // if (isScheduled)
          //   return !values.editSingleAppointment
          //     ? this.openSeriesUpdateConfirmation()
          //     : this._submit()

          // return this._submit()
        },
      )
    } catch (error) {
      console.log({ error })
    }
  }

  openSeriesUpdateConfirmation = () => {
    this.setState({
      showSeriesUpdateConfirmation: true,
    })
  }

  closeSeriesUpdateConfirmation = (callback = (f) => f) => {
    this.setState({ showSeriesUpdateConfirmation: false }, callback)
  }

  onConfirmSeriesUpdate = async (type) => {
    await this.props.setFieldValue('overwriteEntireSeries', type === '2', false)
    this.closeSeriesUpdateConfirmation(this._submit)
  }

  render () {
    const { classes, onClose, loading, values, isSubmitting } = this.props

    const {
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      datagrid,
      isDataGridValid,
    } = this.state

    const { currentAppointment } = values
    // console.log({ datagrid })
    // console.log({ values: this.props.values })

    const show = loading.effects['patientSearch/query'] || isSubmitting
    return (
      <LoadingWrapper loading={show} text='Loading...'>
        <SizeContainer>
          <React.Fragment>
            <GridContainer className={classnames(classes.formContent)}>
              <GridItem container xs md={6}>
                <PatientInfoInput
                  onSearchPatient={this.onSearchPatient}
                  onCreatePatient={this.toggleNewPatientModal}
                  patientName={values.patientName}
                  patientProfileFK={values.patientProfileFK}
                />
                <AppointmentDateInput disabled={values.isEnableRecurrence} />
              </GridItem>
              <GridItem xs md={6} className={classnames(classes.remarksField)}>
                <FastField
                  name='currentAppointment.appointmentRemarks'
                  render={(args) => (
                    <OutlinedTextField
                      {...args}
                      multiline
                      rowsMax={3}
                      rows={3}
                      label='Appointment Remarks'
                    />
                  )}
                />
              </GridItem>

              <GridItem xs md={12} className={classes.verticalSpacing}>
                <AppointmentDataGrid
                  appointmentDate={currentAppointment.appointmentDate}
                  data={datagrid}
                  handleCommitChanges={this.onCommitChanges}
                />
              </GridItem>

              <GridItem xs md={12}>
                <Recurrence
                  disabled={
                    values.id !== undefined &&
                    currentAppointment.appointmentStatusFk !== 2
                  }
                  formValues={values}
                  recurrenceDto={values.recurrenceDto}
                  handleRecurrencePatternChange={this.onRecurrencePatternChange}
                />
              </GridItem>
            </GridContainer>

            <FormFooter
              // isNew={slotInfo.type === 'add'}
              appointmentStatusFK={currentAppointment.appointmentStatusFk}
              onClose={onClose}
              disabled={
                !isDataGridValid ||
                !values.patientName ||
                !values.patientContactNo
              }
              handleCancelOrDeleteClick={this.onCancelOrDeleteClick}
              handleSaveDraftClick={this.onSaveDraftClick}
              handleConfirmClick={this.onConfirmClick}
              handleValidateClick={this.onValidateClick}
            />
            <CommonModal
              open={showSearchPatientModal}
              title='Search Patient'
              onClose={this.toggleSearchPatientModal}
              onConfirm={this.toggleSearchPatientModal}
              maxWidth='md'
              showFooter={false}
              overrideLoading
            >
              <PatientSearchModal
                handleSelectClick={this.onSelectPatientClick}
              />
            </CommonModal>
            <CommonModal
              open={showDeleteConfirmationModal}
              title='Alert'
              onClose={this.closeDeleteConfirmation}
              onConfirm={this.onConfirmCancelAppointment}
              maxWidth='sm'
            >
              <DeleteConfirmation isSeries={values.series} />
            </CommonModal>
            <CommonModal
              open={showSeriesUpdateConfirmation}
              title='Alert'
              onClose={this.closeSeriesUpdateConfirmation}
              maxWidth='sm'
            >
              <SeriesUpdateConfirmation
                handleConfirm={this.onConfirmSeriesUpdate}
              />
            </CommonModal>
          </React.Fragment>
        </SizeContainer>
      </LoadingWrapper>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'ApptForm' })(Form)

export default FormComponent
