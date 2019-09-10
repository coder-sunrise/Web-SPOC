import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  CommonModal,
  GridContainer,
  GridItem,
  SizeContainer,
  OutlinedTextField,
  withFormikExtend,
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
import { ValidationSchema, mapPropsToValues } from './formikUtils'
import styles from './style'

@connect(({ loginSEMR, loading, user, calendar, codetable }) => ({
  loginSEMR,
  loading,
  user: user.data,
  events: calendar.list,
  viewingAppointment: calendar.currentViewAppointment,
  isEditedAsSingleAppointment: calendar.isEditedAsSingleAppointment,
  appointmentStatuses: codetable.ltappointmentstatus,
  clinicianProfiles: codetable.clinicianprofile,
}))
@withFormikExtend({
  displayName: 'AppointmentForm',
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
    editingRows: [],
  }

  componentWillMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ltappointmentstatus' },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ltcancelreasontype' },
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
      payload: { id },
      callback: onClose,
    })
  }

  onConfirmCancelAppointment = ({ type, reasonType, reason }) => {
    const { values, onClose, user, dispatch } = this.props
    console.log({ type })
    const payload = {
      id: values.currentAppointment.id,
      concurrencyToken: values.currentAppointment.concurrencyToken,
      appointmentStatusFK: 3,
      isCancelled: true,
      cancellationDateTime: moment().format(),
      cancellationReasonTypeFK: reasonType,
      cancellationReason: reason,
      cancelByUserFk: user.id,
      cancelSeries: type === '2',
    }

    dispatch({
      type: 'calendar/cancelAppointment',
      payload,
    }).then((response) => {
      if (response) {
        this.setState({
          showDeleteConfirmationModal: false,
        })
        onClose()
      }
    })

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
    const { datagrid = [], editingRows } = this.state

    let isDataGridValid = true

    // editing at least 1 row
    if (editingRows.length > 0) isDataGridValid = false

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
      const submitPayload = {
        validate,
        datagrid,
        formikValues: values,
        appointmentResources: [],
        newAppointmentStatusFK: appointmentStatusFK,
      }

      setSubmitting(false)

      dispatch({
        type: 'calendar/submit',
        payload: submitPayload,
      }).then((response) => {
        if (response) {
          resetForm()
          onClose()
        }
      })
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

  onCancelOrDeleteClick = () => {
    const { values, dispatch } = this.props
    const { currentAppointment } = values

    if (currentAppointment.appointmentStatusFk !== undefined) {
      if (currentAppointment.appointmentStatusFk === 2) {
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: `Are you sure want to delete this draft appointment?`,
            onOpenConfirm: () => this.deleteDraft(currentAppointment.id),
          },
        })
      } else {
        this.setState({
          showDeleteConfirmationModal: true,
        })
      }
    }
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
    const hasModifiedAsSingle = viewingAppointment.appointments.reduce(
      (editedAsSingle, appointment) =>
        appointment.isEditedAsSingleAppointment || editedAsSingle,
      false,
    )
    this.setState(
      {
        tempNewAppointmentStatusFK: appointmentStatusFK,
      },
      () => {
        if (
          values.id !== undefined &&
          !isEditedAsSingleAppointment &&
          hasModifiedAsSingle &&
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

  onEditingRowsChange = (rows) => {
    this.setState(
      {
        editingRows: [
          ...rows,
        ],
      },
      () => this.validateDataGrid(),
    )
    return rows
  }

  render () {
    const {
      classes,
      onClose,
      loading,
      values,
      isSubmitting,
      isEditedAsSingleAppointment,
    } = this.props

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
                  isEdit={values.id}
                  appointmentStatusFK={currentAppointment.appointmentStatusFk}
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
                  handleEditingRowsChange={this.onEditingRowsChange}
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
              maxWidth='sm'
            >
              <DeleteConfirmation
                handleConfirmClick={this.onConfirmCancelAppointment}
                isSeries={
                  !isEditedAsSingleAppointment && values.isEnableRecurrence
                }
              />
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
