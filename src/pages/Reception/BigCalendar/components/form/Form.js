import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// custom component
import {
  CommonModal,
  GridContainer,
  GridItem,
  SizeContainer,
  Switch,
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
  }

  componentWillMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      code: 'ltappointmentstatus',
    })
  }

  onRecurrencePatternChange = (recurrencePatternFK) => {
    const { setFieldValue, setFieldTouched } = this.props
    // reset other field first
    setFieldValue('recurrenceDto.recurrenceDaysOfTheWeek', undefined)
    setFieldValue('recurrenceDto.recurrenceDayOfTheMonth', undefined)
    setFieldTouched('recurrenceDto.recurrenceDayOfTheMonth', false, false)
    setFieldTouched('recurrenceDto.recurrenceDaysOfTheWeek', false, false)

    // initialize value accordingly
    if (recurrencePatternFK === 3) {
      setFieldValue('recurrenceDto.recurrenceDayOfTheMonth', 1)
      setFieldTouched('recurrenceDto.recurrenceDayOfTheMonth', true, true)
    }

    if (recurrencePatternFK === 2) {
      setFieldValue('recurrenceDto.recurrenceDaysOfTheWeek', [])
      setFieldTouched('recurrenceDto.recurrenceDaysOfTheWeek', true, false)
    }
  }

  toggleNewPatientModal = () => {
    this.props.dispatch({
      type: 'patient/openPatientModal',
    })
  }

  openSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: true })
  }

  closeSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: false })
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
    result && this.openSearchPatientModal()
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

    this.closeSearchPatientModal()
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

  onConfirmClick = () => {
    // const { slotInfo } = this.props
    // if (slotInfo.series) {
    //   this.openSeriesUpdateConfirmation()
    // } else {
    //   this._confirm()
    // }
    this.confirm()
  }

  _submit = async (appointmentStatusFK, validate = false) => {
    const { validateForm, setSubmitting, handleSubmit } = this.props
    handleSubmit() // fake submit to touch all fields
    setSubmitting(true)
    const formError = await validateForm()

    if (Object.keys(formError).length > 0) {
      console.log({ formError })
      setSubmitting(false)
      return
    }

    const { datagrid } = this.state
    const { values, onClose, dispatch, resetForm } = this.props

    // const {
    //   appointmentRemarks,
    //   appointmentDate,
    //   isEnableRecurrence,
    //   recurrenceDto,
    //   concurrencyToken,
    //   appointmentGroupFK,
    //   ...restValues
    // } = values

    // const appointments = [
    //   {
    //     id: appointmentGroupFK,
    //     concurrencyToken,
    //     appointmentGroupFK,
    //     appointmentStatusFK,
    //     appointmentRemarks,
    //     appointmentDate: parseDateToServerDateFormatString(appointmentDate),
    //     appointments_Resources: [
    //       ...appointmentResources,
    //     ],
    //   },
    // ]

    const appointmentResources = datagrid.map(mapDatagridToAppointmentResources)
    const { appointment, recurrenceDto, ...restValues } = this.props.values
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

    console.log({ updated, values })
    const actionKey = validate
      ? 'calendar/validate'
      : 'calendar/saveAppointment'

    setSubmitting(false)
    dispatch({
      type: actionKey,
      payload: updated,
    })
    resetForm()
    onClose && onClose()
  }

  onDeleteClick = () => {}

  onValidateClick = () => {
    const appointmentStatusFK = this.props.appointmentStatuses.find(
      (item) => item.code === 'SCHEDULED',
    ).id

    this._submit(appointmentStatusFK, true)
  }

  onSaveDraftClick = () => {
    const { appointmentStatuses, values } = this.props
    const appointmentStatusFK = appointmentStatuses.find(
      (item) => item.code === 'DRAFT',
    ).id
    if (values.editEntireSeries) this.openSeriesUpdateConfirmation()
    else this._submit(appointmentStatusFK)
  }

  confirm = () => {
    const appointmentStatusFK = this.props.appointmentStatuses.find(
      (item) => item.code === 'SCHEDULED',
    ).id

    this._submit(appointmentStatusFK)
  }

  openSeriesUpdateConfirmation = () => {
    this.setState({
      showSeriesUpdateConfirmation: true,
    })
  }

  closeSeriesUpdateConfirmation = () => {
    this.setState({ showSeriesUpdateConfirmation: false })
  }

  onConfirmSeriesUpdate = (type) => {
    console.log({ type })
    this.closeSeriesUpdateConfirmation()
  }

  render () {
    const { classes, onClose, isLoading, values } = this.props

    const {
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      datagrid,
    } = this.state
    console.log({ values })

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
              <AppointmentDateInput />
            </GridItem>
            <GridItem xs md={6} className={classnames(classes.remarksField)}>
              {values.isEnableRecurrence && (
                <div style={{ float: 'right', paddingRight: '4px' }}>
                  <FastField
                    name='editEntireSeries'
                    render={(args) => (
                      <Switch {...args} suffix='Edit entire series' disabled />
                    )}
                  />
                </div>
              )}
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
                disabled={!values.updateEntireSeries}
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
            handleCancelOrDeleteClick={this.onCancelOrDeleteClick}
            handleSaveDraftClick={this.onSaveDraftClick}
            handleConfirmClick={this.onConfirmClick}
            handleValidateClick={this.onValidateClick}
          />
          <CommonModal
            open={showSearchPatientModal}
            title='Search Patient'
            onClose={this.closeSearchPatientModal}
            onConfirm={this.closeSearchPatientModal}
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
