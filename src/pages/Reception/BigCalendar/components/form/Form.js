import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// custom component
import {
  CommonModal,
  GridContainer,
  GridItem,
  SizeContainer,
  OutlinedTextField,
} from '@/components'
// medisys components
import { Recurrence } from '@/components/_medisys'
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

@connect(({ loginSEMR, user, calendar, codetable }) => ({
  loginSEMR,
  user: user.data,
  events: calendar.list,
  viewingAppointment: calendar.currentViewAppointment,
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
      this.props.values && this.props.values.appointment
        ? this.props.values.appointment.appointments_Resources
        : [],
    showSeriesUpdateConfirmation: false,
    tempNewAppointmentStatusFK: -1,
  }

  componentWillMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      code: 'ltappointmentstatus',
    })
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
      this.setState({
        datagrid: rows,
      })
    }
    if (deleted) {
      const { datagrid } = this.state
      this.setState({
        datagrid: datagrid.filter((event) => !deleted.includes(event.id)),
      })
    }
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
      const { appointment, recurrenceDto, ...restValues } = values
      const { recurrenceDto: originalRecurrenceDto } = viewingAppointment

      const isRecurrenceChanged = compareDto(
        recurrenceDto,
        originalRecurrenceDto,
      )
      const appointmentResources = datagrid.map(
        mapDatagridToAppointmentResources(
          isRecurrenceChanged || restValues.updateAllOthers,
        ),
      )

      const singleAppointment = {
        ...appointment,
        appointmentStatusFk: appointmentStatusFK,
        appointments_Resources: [
          ...appointmentResources,
        ],
      }
      const appointments = generateRecurringAppointments(
        recurrenceDto,
        singleAppointment,
        restValues.editSingleAppointment,
        isRecurrenceChanged || restValues.updateAllOthers,
      )
      if (!appointments) {
        setSubmitting(false)
        return
      }

      const filteredRecurrenceDto = restValues.isEnableRecurrence
        ? filterRecurrenceDto(recurrenceDto)
        : null

      const updated = {
        ...restValues,
        recurrenceDto: filteredRecurrenceDto,
        appointments,
      }

      const payload = constructPayload(updated, appointmentStatusFK)
      console.log({ payload, values, appointmentStatusFK })
      const updateKey =
        appointmentStatusFK === 1 || appointmentStatusFK === 2
          ? 'calendar/saveAppointment'
          : 'calendar/rescheduleAppointment'
      const actionKey = validate ? 'calendar/validate' : updateKey

      setSubmitting(false)
      dispatch({
        type: actionKey,
        payload,
      })
      resetForm()
      onClose && onClose()
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
    const { appointmentStatuses, values } = this.props
    const appointmentStatusFK = appointmentStatuses.find(
      (item) => item.code === 'DRAFT',
    ).id
    this.setState(
      {
        tempNewAppointmentStatusFK: appointmentStatusFK,
      },
      () => {
        if (values.editSingleAppointment) this.openSeriesUpdateConfirmation()
        else this._submit()
      },
    )
  }

  onConfirmClick = () => {
    const { appointmentStatuses, values } = this.props
    const isScheduled =
      values.appointment &&
      (values.appointment.appointmentStatusFk === 1 ||
        values.appointment.appointmentStatusFk === 5)
    try {
      let newAppointmentStatusFK = appointmentStatuses.find(
        (item) => item.code === 'SCHEDULED',
      ).id
      const rescheduleFK = appointmentStatuses.find(
        (item) => item.code === 'RESCHEDULED',
      ).id
      if (values.appointment && values.appointment.appointmentStatusFk === 1)
        newAppointmentStatusFK = rescheduleFK
      this.setState(
        {
          tempNewAppointmentStatusFK: newAppointmentStatusFK,
        },
        () => {
          if (isScheduled)
            return !values.editSingleAppointment
              ? this.openSeriesUpdateConfirmation()
              : this._submit()

          return this._submit()
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
    await this.props.setFieldValue('updateAllOthers', type === '2', false)
    this.closeSeriesUpdateConfirmation(this._submit)
  }

  render () {
    const { classes, onClose, isLoading, values } = this.props

    const {
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      datagrid,
    } = this.state
    // console.log({ props: this.props })
    // console.log({ values: this.props.values })
    return (
      <SizeContainer>
        <React.Fragment>
          {isLoading && (
            <div className={classnames(classes.loading)}>
              <CircularProgress />
              <h3 style={{ fontWeight: 400 }}>Populating patient info...</h3>
            </div>
          )}

          <GridContainer
            className={classnames(classes.formContent)}
            // alignItems='center'
            // justify='center'
          >
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
                name='appointment.appointmentRemarks'
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
                appointmentDate={values.appointment.appointmentDate}
                data={datagrid}
                handleCommitChanges={this.onCommitChanges}
              />
            </GridItem>

            <GridItem xs md={12}>
              <Recurrence
                disabled={values.id !== undefined && values.isEnableRecurrence}
                formValues={values}
                recurrenceDto={values.recurrenceDto}
                handleRecurrencePatternChange={this.onRecurrencePatternChange}
              />
            </GridItem>
          </GridContainer>

          <FormFooter
            // isNew={slotInfo.type === 'add'}
            appointmentStatusFK={values.appointment.appointmentStatusFk}
            onClose={onClose}
            disabled={datagrid.length === 0}
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
            <PatientSearchModal handleSelectClick={this.onSelectPatientClick} />
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
    )
  }
}

const FormComponent = withStyles(styles, { name: 'ApptForm' })(Form)

export default FormComponent
