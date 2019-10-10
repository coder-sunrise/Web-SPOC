import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import classnames from 'classnames'
// formik
import { Field } from 'formik'
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
import PatientProfile from '@/pages/PatientDatabase/Detail'
import PatientSearchModal from '../../PatientSearch'
import DeleteConfirmation from './DeleteConfirmation'
import AppointmentDataGrid from './AppointmentDataGrid'
import PatientInfoInput from './PatientInfo'
import AppointmentDateInput from './AppointmentDate'
// import Recurrence from './Recurrence'
import FormFooter from './FormFooter'
import SeriesUpdateConfirmation from '../../SeriesUpdateConfirmation'
import RescheduleForm from './RescheduleForm'
// utils
import { ValidationSchema, mapPropsToValues, sortDataGrid } from './formUtils'
import { getAppendUrl } from '@/utils/utils'
import { APPOINTMENT_STATUS } from '@/utils/constants'
import styles from './style'

@connect(
  ({
    loginSEMR,
    loading,
    user,
    calendar,
    codetable,
    patient,
    patientSearch,
  }) => ({
    loginSEMR,
    loading,
    patientProfile: patient.entity,
    patientProfileDefaultValue: patient.default,
    user: user.data,
    events: calendar.list,
    conflicts: calendar.conflicts,
    viewingAppointment: calendar.currentViewAppointment,
    isEditedAsSingleAppointment: calendar.isEditedAsSingleAppointment,
    mode: calendar.mode,
    cachedPayload: calendar.cachedPayload,
    appointmentStatuses: codetable.ltappointmentstatus,
    clinicianProfiles: codetable.clinicianprofile,
    patientSearchResult: patientSearch.list,
  }),
)
@withFormikExtend({
  displayName: 'AppointmentForm',
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
})
class Form extends React.PureComponent {
  state = {
    showPatientProfile: false,
    showSearchPatientModal: false,
    showDeleteConfirmationModal: false,
    showRescheduleForm: false,
    datagrid:
      this.props.values && this.props.values.currentAppointment
        ? this.props.values.currentAppointment.appointments_Resources
        : [],
    showSeriesUpdateConfirmation: false,
    tempNewAppointmentStatusFK: -1,
    isDataGridValid: false,
    editingRows: [],
    _tempCallback: undefined,
  }

  componentDidMount () {
    Promise.all([
      this.props.dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'clinicianprofile',
        },
      }),
      this.props.dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ltappointmentstatus' },
      }),
      this.props.dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ltcancelreasontype' },
      }),
    ])

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

  toggleSearchPatientModal = () => {
    const { showSearchPatientModal } = this.state
    this.setState({ showSearchPatientModal: !showSearchPatientModal })
    if (showSearchPatientModal) {
      this.props.dispatch({
        type: 'patientSearch/updateState',
        payload: {
          filter: {},
          list: [],
        },
      })
    }
  }

  togglePatientProfileModal = () => {
    const { patientProfileDefaultValue, dispatch, values } = this.props
    const entity = {
      ...patientProfileDefaultValue,
      name: values.patientName,
      contact: {
        ...patientProfileDefaultValue.contact,
        mobileContactNumber: {
          number: values.patientContactNo,
        },
      },
    }
    this.setState(
      (preState) => ({
        ...preState,
        showPatientProfile: !preState.showPatientProfile,
      }),
      () => {
        dispatch({
          type: 'patient/updateState',
          payload: {
            entity,
            currentId: undefined,
          },
        })
      },
    )
  }

  checkShouldPopulate = (patientSearchResult) =>
    patientSearchResult.length === 1

  onSearchPatient = async () => {
    const { dispatch, values } = this.props
    const prefix = 'like_'
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        keepFilter: false,
        group: [
          {
            [`${prefix}name`]: values.patientName,
            [`${prefix}patientAccountNo`]: values.patientName,
            [`${prefix}contactFkNavigation.contactNumber.number`]: `${values.patientContactNo}`,
            combineCondition: 'or',
          },
        ],
      },
    })
    this.showSearchResult()
  }

  showSearchResult = () => {
    const { patientSearchResult } = this.props

    if (patientSearchResult) {
      const shouldPopulate = this.checkShouldPopulate(patientSearchResult)

      if (shouldPopulate) {
        this.onSelectPatientClick(patientSearchResult[0], true)
      } else this.toggleSearchPatientModal()
    }
  }

  onSelectPatientClick = async (patientProfile, autoPopulate = false) => {
    const { id, patientAccountNo, name, mobileNo } = patientProfile
    const { values, setValues } = this.props
    await setValues({
      ...values,
      patientAccountNo,
      patientProfileFK: id,
      patientName: name,
      patientContactNo: mobileNo,
    })
    if (!autoPopulate) this.toggleSearchPatientModal()

    return true
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

  onConfirmCreatePatient = async () => {
    const { patientProfile, dispatch } = this.props
    console.log('onConfirmCreatePatient', this.props)
    const { id, name, contact, patientAccountNo } = patientProfile
    const payload = {
      id,
      name,
      patientAccountNo,
      mobileNo: contact.mobileContactNumber.number,
    }
    dispatch({
      type: 'patient/closePatientModal',
    })
    console.log('payload', payload)
    this.togglePatientProfileModal()
    const doneUpdateFields = await this.onSelectPatientClick(payload, true)
    if (doneUpdateFields) {
      this._submit(false, true)
    }
  }

  onConfirmCancelAppointment = ({ type, reasonType, reason }) => {
    const { values, onClose, user, dispatch } = this.props
    const noShowStatus = APPOINTMENT_STATUS.NOSHOW
    const cancelStatus = APPOINTMENT_STATUS.CANCELLED

    const payload = {
      id: values.currentAppointment.id,
      concurrencyToken: values.currentAppointment.concurrencyToken,
      appointmentStatusFK: reasonType === '1' ? noShowStatus : cancelStatus,
      cancellationDateTime: moment().formatUTC(),
      cancellationReasonTypeFK: reasonType,
      cancellationReason: reason,
      cancelByUserFk: user.id,
      cancelSeries: type === '2',
      isCancelled: false,
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
      const newDatagrid = datagrid.filter(
        (event) => !deleted.includes(event.id),
      )
      this.setState(
        {
          datagrid:
            newDatagrid.length === 1
              ? [
                  { ...newDatagrid[0], isPrimaryClinician: true },
                ]
              : newDatagrid,
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
    // const hasPrimaryDoctor = datagrid.reduce(
    //   (hasPrimary, row) => (row.isPrimaryClinician ? true : hasPrimary),
    //   false,
    // )
    // if (!hasPrimaryDoctor) isDataGridValid = false
    // this.setState({ isDataGridValid })
    const newDataGrid =
      datagrid.length === 1
        ? [
            {
              ...datagrid[0],
              isPrimaryClinician:
                datagrid[0].isPrimaryClinician === undefined
                  ? true
                  : datagrid[0].isPrimaryClinician,
            },
          ]
        : [
            ...datagrid,
          ]
    this.setState({ isDataGridValid, datagrid: newDataGrid })
  }

  _submit = async (validate = false, preSubmit = false) => {
    try {
      const {
        cachedPayload,
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
        newAppointmentStatusFK: preSubmit
          ? values.appointmentStatusFk
          : appointmentStatusFK,
      }

      setSubmitting(false)

      dispatch({
        type: 'calendar/submit',
        payload: submitPayload,
      }).then((response) => {
        if (response) {
          if (preSubmit) {
            dispatch({
              type: 'calendar/getAppointmentDetails',
              payload: {
                ...cachedPayload,
              },
            })
          } else {
            dispatch({
              type: 'formik/clean',
              payload: 'AppointmentForm',
            })
            resetForm()
            onClose()
          }
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
            onConfirmSave: () => this.deleteDraft(currentAppointment.id),
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
    const { values, mode, viewingAppointment } = this.props
    const appointmentStatusFK = APPOINTMENT_STATUS.DRAFT

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
          mode === 'series' &&
          hasModifiedAsSingle &&
          viewingAppointment.isEnableRecurrence
        )
          this.openSeriesUpdateConfirmation()
        else this._submit()
      },
    )
  }

  onConfirmClick = () => {
    const { values, mode, viewingAppointment } = this.props

    try {
      let newAppointmentStatusFK = APPOINTMENT_STATUS.SCHEDULED
      const rescheduleFK = APPOINTMENT_STATUS.RESCHEDULED

      if (
        values.currentAppointment &&
        (values.currentAppointment.appointmentStatusFk ===
          APPOINTMENT_STATUS.SCHEDULED ||
          values.currentAppointment.appointmentStatusFk ===
            APPOINTMENT_STATUS.RESCHEDULED)
      )
        newAppointmentStatusFK = rescheduleFK

      const hasModifiedAsSingle = viewingAppointment.appointments.reduce(
        (editedAsSingle, appointment) =>
          appointment.isEditedAsSingleAppointment || editedAsSingle,
        false,
      )

      this.setState(
        {
          tempNewAppointmentStatusFK: newAppointmentStatusFK,
        },
        () => {
          if (
            values.id !== undefined &&
            mode === 'series' &&
            hasModifiedAsSingle &&
            viewingAppointment.isEnableRecurrence
          ) {
            this.openSeriesUpdateConfirmation(this.openRescheduleForm)
            return true
          }

          if (newAppointmentStatusFK === APPOINTMENT_STATUS.RESCHEDULED) {
            this.openRescheduleForm()
          } else {
            this._submit()
          }
          return true
        },
      )
    } catch (error) {
      console.log({ error })
    }
  }

  openRescheduleForm = (callback) => {
    this.setState({ showRescheduleForm: true, _tempCallback: callback })
  }

  openSeriesUpdateConfirmation = (callback) => {
    this.setState({
      showSeriesUpdateConfirmation: true,
      _tempCallback: callback,
    })
  }

  closeSeriesUpdateConfirmation = (callback = (f) => f) => {
    this.setState({ showSeriesUpdateConfirmation: false }, callback)
  }

  closeRescheduleForm = () => {
    this.setState({ showRescheduleForm: false, _tempCallback: undefined })
  }

  onConfirmSeriesUpdate = async (type) => {
    await this.props.setFieldValue('overwriteEntireSeries', type === '2', false)
    const { tempNewAppointmentStatusFK } = this.state

    if (tempNewAppointmentStatusFK === APPOINTMENT_STATUS.RESCHEDULED) {
      this.closeSeriesUpdateConfirmation()
      this.openRescheduleForm()
    } else this.closeSeriesUpdateConfirmation(this._submit)
  }

  onConfirmReschedule = async (rescheduleValues) => {
    const { setValues, values } = this.props
    await setValues({ ...values, ...rescheduleValues })
    this.closeRescheduleForm()
    this._submit()
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

  onCloseFormClick = () => {
    const { onClose, dispatch } = this.props
    dispatch({
      type: 'patientSearch/updateState',
      payload: { list: undefined },
    })
    onClose()
  }

  actualizeAppointment = () => {
    const { datagrid } = this.state
    const { values, history } = this.props
    const primaryDoctorResource = datagrid.find(
      (item) => item.isPrimaryClinician,
    )

    const parameters = {
      md: 'visreg',
      pid: values.patientProfileFK,
      apptid: values.currentAppointment.id,
      pdid: primaryDoctorResource.clinicianFK, // primary clinician id
    }

    this.onCloseFormClick()

    history.push(getAppendUrl(parameters))
  }

  onViewPatientProfile = () => {
    const { values, history } = this.props
    history.push(
      getAppendUrl({
        md: 'pt',
        cmt: '1',
        pid: values.patientProfileFK,
        v: Date.now(),
      }),
    )
  }

  shouldDisablePatientInfo = () => {
    const { values } = this.props

    return values.id !== undefined
  }

  shouldDisableButtonAction = () => {
    const { values } = this.props
    const { isDataGridValid } = this.state
    if (!isDataGridValid || !values.patientName || !values.patientContactNo)
      return true

    return false
  }

  shouldDisableDatagrid = () => {
    const { values } = this.props

    const { currentAppointment = {} } = values

    const _disabledStatus = [
      APPOINTMENT_STATUS.CANCELLED,
      APPOINTMENT_STATUS.TURNEDUP,
    ]
    if (_disabledStatus.includes(currentAppointment.appointmentStatusFk))
      return true
    return false
  }

  render () {
    const {
      classes,
      onClose,
      loading,
      values,
      isSubmitting,
      mode,
      conflicts,
    } = this.props

    const {
      showPatientProfile,
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      showRescheduleForm,
      datagrid,
    } = this.state

    const { currentAppointment = {} } = values
    const disablePatientInfo = this.shouldDisablePatientInfo()
    const disableFooterButton = this.shouldDisableButtonAction()
    const disableDataGrid = this.shouldDisableDatagrid()

    const _datagrid =
      conflicts.length > 0
        ? datagrid
            .sort(sortDataGrid)
            .map((item, index) => ({ ...item, sortOrder: index }))
            .reduce(
              (data, d) => [
                ...data,
                {
                  ...d,
                  conflicts:
                    conflicts[d.sortOrder] && conflicts[d.sortOrder].conflicts
                      ? conflicts[d.sortOrder].conflicts
                      : undefined,
                },
              ],
              [],
            )
        : [
            ...datagrid,
          ]

    const show = loading.effects['patientSearch/query'] || isSubmitting
    return (
      <LoadingWrapper loading={show} text='Loading...'>
        <SizeContainer>
          <React.Fragment>
            <GridContainer className={classnames(classes.formContent)}>
              <GridItem container xs md={6}>
                <PatientInfoInput
                  disabled={disablePatientInfo}
                  isEdit={values.id}
                  onViewPatientProfileClick={this.onViewPatientProfile}
                  onSearchPatientClick={this.onSearchPatient}
                  onCreatePatientClick={this.togglePatientProfileModal}
                  onRegisterToVisitClick={this.actualizeAppointment}
                  patientContactNo={values.patientContactNo}
                  patientName={values.patientName}
                  patientProfileFK={values.patientProfileFK}
                  appointmentStatusFK={currentAppointment.appointmentStatusFk}
                />
                <AppointmentDateInput />
              </GridItem>
              <GridItem xs md={6} className={classnames(classes.remarksField)}>
                <Field
                  name='currentAppointment.appointmentRemarks'
                  render={(args) => (
                    <OutlinedTextField
                      {...args}
                      disabled={disableDataGrid}
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
                  disabled={disableDataGrid}
                  appointmentDate={currentAppointment.appointmentDate}
                  data={_datagrid}
                  handleCommitChanges={this.onCommitChanges}
                  handleEditingRowsChange={this.onEditingRowsChange}
                />
              </GridItem>

              <GridItem xs md={12}>
                <Recurrence
                  disabled={values.id !== undefined}
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
              disabled={disableFooterButton}
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
              open={showPatientProfile}
              onClose={this.togglePatientProfileModal}
              onConfirm={this.onConfirmCreatePatient}
              title='Create Patient Profile'
              observe='PatientDetail'
              authority='patient'
              fullScreen
              overrideLoading
              showFooter={false}
            >
              <PatientProfile history={this.props.history} />
            </CommonModal>
            <CommonModal
              open={showDeleteConfirmationModal}
              title='Alert'
              onClose={this.closeDeleteConfirmation}
              maxWidth='sm'
            >
              <DeleteConfirmation
                handleConfirmClick={this.onConfirmCancelAppointment}
                isSeries={values.isEnableRecurrence && mode === 'series'}
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
            <CommonModal
              open={showRescheduleForm}
              title='Alert'
              onClose={this.closeRescheduleForm}
              maxWidth='sm'
            >
              <RescheduleForm onConfirmReschedule={this.onConfirmReschedule} />
            </CommonModal>
          </React.Fragment>
        </SizeContainer>
      </LoadingWrapper>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'ApptForm' })(Form)

export default FormComponent
