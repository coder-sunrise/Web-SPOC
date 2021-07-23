import React from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
import moment from 'moment'
import classnames from 'classnames'
import { Link } from 'umi'
// formik
import { Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  CommonModal,
  CardContainer,
  GridContainer,
  GridItem,
  SizeContainer,
  OutlinedTextField,
  withFormikExtend,
  Button
} from '@/components'
// medisys components
import { LoadingWrapper, Recurrence } from '@/components/_medisys'
// custom components
import PatientProfile from '@/pages/PatientDatabase/Detail'
import { getAppendUrl } from '@/utils/utils'
import { APPOINTMENT_STATUS, APPOINTMENT_CANCELLEDBY } from '@/utils/constants'
import { getBizSession } from '@/services/queue'
import Authorized from '@/utils/Authorized'
import PatientBanner from '@/pages/PatientDashboard/Banner'
import AppointmentHistory from './AppointmentHistory'
import PatientSearchModal from '../../PatientSearch'
import DeleteConfirmation from './DeleteConfirmation'
import AppointmentDataGrid from './AppointmentDataGrid'
import PatientInfoInput from './PatientInfo'
import AppointmentDateInput from './AppointmentDate'
// import Recurrence from './Recurrence'
import FormFooter from './FormFooter'
import SeriesUpdateConfirmation from '../../SeriesUpdateConfirmation'
import RescheduleForm from './RescheduleForm'
import PreOrder from './PreOrder'
import SelectPreOrder from './SelectPreOrder'
// utils
import {
  ValidationSchema,
  mapPropsToValues,
  sortDataGrid,
  getEndTime,
} from './formUtils'
import styles from './style'

const gridValidationSchema = Yup.object().shape({
  startTime: Yup.string().required(),
  endTime: Yup.string().required(),
  apptDurationHour: Yup.number().required(),
  apptDurationMinute: Yup.number().required(),
  clinicianFK: Yup.string().required(),
})

@connect(
  ({
    loginSEMR,
    loading,
    user,
    calendar,
    codetable,
    patient,
    patientSearch,
    global,
    visitRegistration
  }) => ({
    loginSEMR,
    loading,
    commitCount: global.commitCount || 1,
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
    visitRegistration
  }),
)
@withFormikExtend({
  notDirtyDuration: 1,
  displayName: 'AppointmentForm',
  // enableReinitialize: true,
  validationSchema: ValidationSchema,
  mapPropsToValues,
})
class Form extends React.PureComponent {
  state = {
    submitCount: this.props.commitCount,
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
    isDataGridValid: this.props.values.id !== undefined,
    editingRows: [],
    hasActiveSession: false,
    showSelectPreOrder: false,
  }

  componentDidMount = async () => {
    const { values, dispatch } = this.props
    const response = await dispatch({
      type: 'visitRegistration/getVisitOrderTemplateList',
      payload: {
        pagesize: 9999,
      },
    })
    if (response) {
      const { data } = response
      const templateOptions = data
        .filter((template) => template.isActive)
        .map((template) => {
          return {
            ...template,
            value: template.id,
            name: template.displayValue,
          }
        })

      dispatch({
        type: 'visitRegistration/updateState',
        payload: {
          visitOrderTemplateOptions: templateOptions,
        },
      })
    }

    this.checkHasActiveSession()
    Promise.all([
      dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ltappointmentstatus' },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ltcancelreasontype' },
      }),
    ])

    if (values && values.patientProfileFK) {
      this.refreshPatient(values.patientProfileFK)
    }

    this.validateDataGrid()
  }

  checkHasActiveSession = async () => {
    try {
      const bizSessionPayload = {
        IsClinicSessionClosed: false,
      }
      const result = await getBizSession(bizSessionPayload)
      const { data } = result.data

      this.setState(() => {
        return {
          hasActiveSession: data.length > 0,
        }
      })
    } catch (error) {
    }
  }

  refreshPatient = (id) => {
    this.props
      .dispatch({
        type: 'patient/query',
        payload: {
          id,
        },
      })
      .then((pat) => {
        this.props.dispatch({
          type: 'patient/updateState',
          payload: { entity: pat },
        })
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

  toggleSearchPatientModal = () => {
    const { showSearchPatientModal } = this.state
    this.setState({ showSearchPatientModal: !showSearchPatientModal })
    if (showSearchPatientModal) {
      // this.props.dispatch({
      //   type: 'patientSearch/updateState',
      //   payload: {
      //     filter: {},
      //     list: [],
      //   },
      // })
      this.resetPatientSearchResult()
    }
  }

  togglePatientProfileModal = () => {
    const { patientProfileDefaultValue, dispatch, values } = this.props
    const entity = {
      ...patientProfileDefaultValue,
      name: values.patientName,
      callingName: values.patientName,
      contact: {
        ...patientProfileDefaultValue.contact,
        mobileContactNumber: {
          ...patientProfileDefaultValue.contact.mobileContactNumber,
          number: values.patientContactNo,
          countryCodeFK: values.countryCodeFK,
        },
      },
    }

    dispatch({
      type: 'patient/openPatientModal',
      payload: {
        callback: this.onConfirmCreatePatient,
      },
    })
    dispatch({
      type: 'patient/updateDefaultEntity',
      payload: {
        ...entity,
        // currentId: undefined,
      },
    })

    // this.setState(
    //   (preState) => ({
    //     ...preState,
    //     showPatientProfile: !preState.showPatientProfile,
    //   }),
    //   () => {
    //     dispatch({
    //       type: 'patient/updateState',
    //       payload: {
    //         entity,
    //         currentId: undefined,
    //       },
    //     })
    //   },
    // )
  }

  checkShouldPopulate = (patientSearchResult) =>
    patientSearchResult.length === 1

  onSearchPatient = async () => {
    const { dispatch, values } = this.props
    const prefix = 'like_'
    await dispatch({
      type: 'patientSearch/query',
      payload: {
        // group: [
        //   {
        //     [`${prefix}name`]: values.patientName,
        //     [`${prefix}patientAccountNo`]: values.patientName,
        //     [`${prefix}patientReferenceNo`]: values.patientName,
        //     [`${prefix}contactFkNavigation.contactNumber.number`]: `${values.patientContactNo ||
        //       ''}`,
        //     combineCondition: 'or',
        //   },
        // ],
        apiCriteria: {
          searchValue: values.search,
        },
      },
    })
    this.showSearchResult()
  }

  resetPatientSearchResult = () => {
    this.props.dispatch({
      type: 'patientSearch/updateState',
      payload: {
        filter: {},
        list: [],
      },
    })
  }

  showSearchResult = () => {
    const { patientSearchResult } = this.props

    if (patientSearchResult) {
      const shouldPopulate = this.checkShouldPopulate(patientSearchResult)

      if (shouldPopulate) {
        this.onSelectPatientClick(patientSearchResult[0], true)
        this.resetPatientSearchResult()
      } else this.toggleSearchPatientModal()
    }
  }

  onSelectPatientClick = async (patientProfile, autoPopulate = false) => {
    const {
      id,
      patientAccountNo,
      name,
      mobileNo,
      countryCodeFK,
    } = patientProfile
    const { values, setValues } = this.props
    await setValues({
      ...values,
      patientAccountNo,
      patientProfileFK: id,
      patientName: name,
      patientContactNo: mobileNo,
      countryCodeFK,
    })
    this.refreshPatient(id)
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

  onConfirmCreatePatient = () => {
    const { patientProfile, dispatch } = this.props
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
    // const doneUpdateFields = await this.onSelectPatientClick(payload, true)
    this.onSelectPatientClick(payload, true)
    // if (doneUpdateFields && values.id) {
    //   this._submit(false, true)
    // }
  }

  onConfirmCancelAppointment = ({
    type,
    cancelBy = APPOINTMENT_CANCELLEDBY.CLINIC,
    reasonType,
    reason,
  }) => {
    const { values, onClose, user, dispatch } = this.props
    // const noShowStatus = APPOINTMENT_STATUS.NOSHOW
    const cancelStatus =
      cancelBy === APPOINTMENT_CANCELLEDBY.PATIENT
        ? APPOINTMENT_STATUS.PFA_CANCELLED
        : APPOINTMENT_STATUS.CANCELLED

    const payload = {
      id: values.currentAppointment.id,
      concurrencyToken: values.currentAppointment.concurrencyToken,
      appointmentStatusFK: cancelStatus,
      cancellationDateTime: moment().formatUTC(),
      cancellationReasonTypeFK: reasonType,
      cancellationReason: reason,
      cancelByUserFk: user.id,
      cancelSeries: type === '2',
      cancelledByFK: cancelBy,
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

  validateWithSchema = (datagrid = []) => {
    const endResult = datagrid.reduce((result, data) => {
      try {
        if (!data.isDeleted) {
          gridValidationSchema.validateSync(data, {
            abortEarly: false,
          })
        }

        return [
          ...result,
          { ...data, _errors: [] },
        ]
      } catch (error) {
        return [
          ...result,
          { ...data, _errors: error.inner },
        ]
      }
    }, [])
    return endResult
  }

  onCommitChanges = ({ rows, deleted, ...restProps }) => {
    const { setFieldValue } = this.props
    setFieldValue('_fakeField', 'fakeValue')
    if (deleted) {
      const { datagrid } = this.state
      // const newDatagrid = datagrid.filter(
      //   (event) => !deleted.includes(event.id),
      // )
      const afterDelete = datagrid.map((item) => ({
        ...item,
        isDeleted: item.isDeleted || deleted.includes(item.id),
      }))
      const primayDoctor = afterDelete.find(
        (item) => !item.isDeleted && item.isPrimaryClinician,
      )
      const firstUnDelete = afterDelete.filter((item) => !item.isDeleted)[0]
      let newDataGrid = [
        ...afterDelete,
      ]
      if (primayDoctor) {
        newDataGrid = afterDelete
      } else {
        newDataGrid = afterDelete.map((item) => ({
          ...item,
          isPrimaryClinician: firstUnDelete.id === item.id,
        }))
      }

      this.setState(
        {
          datagrid: newDataGrid,
        },
        this.validateDataGrid,
      )
      return newDataGrid
    }

    if (rows) {
      const updatedRows = this.validateWithSchema(
        rows.sort(sortDataGrid).map((item, index) => ({
          ...item,
          sortOrder: index,
          conflicts: [],
          endTime: getEndTime(item),
          startTime: item.startTime
            ? moment(item.startTime, 'hh:mm A').format('HH:mm')
            : undefined,
        })),
      )
      this.setState(
        {
          datagrid: updatedRows,
        },
        this.validateDataGrid,
      )
      return updatedRows
    }

    return rows
  }

  validateDataGrid = () => {
    const { datagrid = [], editingRows } = this.state

    let isDataGridValid = true

    // editing at least 1 row
    if (editingRows.length > 0) isDataGridValid = false

    if (
      this.validateWithSchema(datagrid).filter(
        (item) => item._errors && item._errors.length > 0,
      ).length > 0
    )
      isDataGridValid = false

    // has at least 1 row of appointment_resources
    if (datagrid.length === 0) isDataGridValid = false

    const filterDeleted = datagrid.filter((item) => !item.isDeleted)
    const hasPrimary = filterDeleted.reduce(
      (hasPrimaryClinician, item) =>
        item.isPrimaryClinician || hasPrimaryClinician,
      false,
    )

    if (!hasPrimary) isDataGridValid = false
    this.setState({
      isDataGridValid,
      // datagrid: newDataGrid,
    })
  }

  _submit = async (validate = false) => {
    try {
      const {
        validateForm,
        setSubmitting,
        handleSubmit,
        values,
        onConfirm,
        dispatch,
      } = this.props
      const {
        datagrid,
        tempNewAppointmentStatusFK: appointmentStatusFK,
      } = this.state

      if (!validate) {
        handleSubmit() // fake submit to touch all fields
        setSubmitting(true)
        const formError = await validateForm(values)

        if (Object.keys(formError).length > 0) {
          setSubmitting(false)
          return
        }
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
        if (validate && response) {
          const conflicts = [
            ...response,
          ]

          this.setState(
            (preState) => ({
              submitCount: preState.submitCount + 1,
              datagrid: preState.datagrid.reduce(
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
              ),
            }),
            () => {
              this.props.dispatch({
                type: 'global/updateState',
                payload: {
                  commitCount: this.state.submitCount + 1,
                },
              })
            },
          )
        }
        if (!validate && response) {
          onConfirm()
        }
      })
    } catch (error) {
    }
  }

  onDeleteClick = () => { }

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
            openConfirmContent: `Delete this draft appointment?`,
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
      const { datagrid } = this.state
      let newAppointmentStatusFK = APPOINTMENT_STATUS.CONFIRMED
      const rescheduleFK = APPOINTMENT_STATUS.RESCHEDULED
      let originalAppointment = viewingAppointment.appointments.find(
        (t) => t.id === values.currentAppointment.id,
      )

      let newResource = Array.from(datagrid, (resource) => {
        let startTime = `${resource.startTime}:00`
        let endTime = `${resource.endTime}:00`
        const {
          appointmentFK,
          clinicianFK,
          clinicianName,
          clinicianTitle,
          sortOrder,
          isPrimaryClinician,
          id,
          isDeleted,
          concurrencyToken,
          apptDurationHour,
          apptDurationMinute,
          preClinicianFK,
          roomFk,
          appointmentTypeFK,
        } = resource
        return {
          appointmentFK,
          clinicianFK,
          clinicianName,
          clinicianTitle,
          startTime,
          endTime,
          sortOrder,
          isPrimaryClinician,
          id,
          isDeleted,
          concurrencyToken,
          apptDurationHour,
          apptDurationMinute,
          preClinicianFK,
          roomFk,
          appointmentTypeFK,
        }
      })
      let originalResource = {}
      if (originalAppointment) {
        originalResource = Array.from(
          originalAppointment.appointments_Resources,
          (resource) => {
            const {
              appointmentFK,
              clinicianFK,
              clinicianName,
              clinicianTitle,
              startTime,
              endTime,
              sortOrder,
              isPrimaryClinician,
              id,
              isDeleted,
              concurrencyToken,
              apptDurationHour,
              apptDurationMinute,
              preClinicianFK,
              roomFk,
              appointmentTypeFK,
            } = resource
            return {
              appointmentFK,
              clinicianFK,
              clinicianName,
              clinicianTitle,
              startTime,
              endTime,
              sortOrder,
              isPrimaryClinician,
              id,
              isDeleted,
              concurrencyToken,
              apptDurationHour,
              apptDurationMinute,
              preClinicianFK,
              roomFk,
              appointmentTypeFK,
            }
          },
        )
      }
      let resourceChanged =
        originalAppointment &&
        JSON.stringify(originalResource) !== JSON.stringify(newResource)
      let dateChanged =
        originalAppointment &&
        originalAppointment.appointmentDate.indexOf(
          values.currentAppointment.appointmentDate,
        ) === -1
      const canChangeToRescheduleStatus = [
        APPOINTMENT_STATUS.CONFIRMED,
        APPOINTMENT_STATUS.RESCHEDULED,
        APPOINTMENT_STATUS.PFA_RESCHEDULED,
      ]
      if (
        values.currentAppointment &&
        canChangeToRescheduleStatus.includes(
          values.currentAppointment.appointmentStatusFk,
        )
      ) {
        if (resourceChanged || dateChanged) {
          newAppointmentStatusFK = rescheduleFK
        }
      }

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
    }
  }

  openRescheduleForm = () => {
    this.setState({ showRescheduleForm: true })
  }

  openSeriesUpdateConfirmation = () => {
    this.setState({
      showSeriesUpdateConfirmation: true,
    })
  }

  closeSeriesUpdateConfirmation = (callback = (f) => f) => {
    this.setState({ showSeriesUpdateConfirmation: false }, callback)
  }

  closeRescheduleForm = () => {
    this.setState({ showRescheduleForm: false })
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
    // const { rescheduledByFK } = rescheduleValues
    // let { appointmentStatusFk } = values

    // by patient
    // if (rescheduledByFK === '2') {
    //   appointmentStatusFk = APPOINTMENT_STATUS.PFA_RESCHEDULED
    //   this.setState({ tempNewAppointmentStatusFK: appointmentStatusFk })
    // }
    this.setState({ tempNewAppointmentStatusFK: APPOINTMENT_STATUS.CONFIRMED })
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
    const firstResource = datagrid.find((i) => i.sortOrder === 0)

    const parameters = {
      md: 'visreg',
      pid: values.patientProfileFK,
      apptid: values.currentAppointment.id,
      pdid: primaryDoctorResource.clinicianFK, // primary clinician id
    }

    if (firstResource.roomFk) {
      // pdroomid: primaryDoctorResource.roomFk || null, // primary clinician resource room fk
      parameters.pdroomid = firstResource.roomFk
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
    if (
      !isDataGridValid ||
      !values.patientName ||
      values.patientContactNo === undefined ||
      values.patientContactNo === null
    )
      return true

    return false
  }

  shouldDisableCheckAvailabilityButtonAction = () => {
    const { patientProfile, values = {} } = this.props
    const { isDataGridValid } = this.state
    const patientIsActive =
      values.patientProfileFK > 0
        ? patientProfile && patientProfile.isActive
        : true
    if (!isDataGridValid || !patientIsActive) return true

    return false
  }

  shouldDisableDatagrid = () => {
    const { values, patientProfile } = this.props

    const { currentAppointment = {} } = values
    const patientIsActive =
      values.patientProfileFK > 0
        ? patientProfile && patientProfile.isActive
        : true

    const _disabledStatus = [
      APPOINTMENT_STATUS.CANCELLED,
      APPOINTMENT_STATUS.TURNEDUP,
      APPOINTMENT_STATUS.TURNEDUPLATE,
    ]
    if (
      _disabledStatus.includes(currentAppointment.appointmentStatusFk) ||
      !patientIsActive
    )
      return true
    return false
  }

  shouldDisableAppointmentDate = () => {
    const { values } = this.props
    const { appointmentStatusFk } = values
    if (!values.id) return false
    const disablingList = [
      APPOINTMENT_STATUS.CANCELLED,
      // APPOINTMENT_STATUS.NOSHOW,
      APPOINTMENT_STATUS.TURNEDUP,
      APPOINTMENT_STATUS.TURNEDUPLATE,
    ]
    return (
      values.isEnableRecurrence || disablingList.includes(appointmentStatusFk)
    )
  }

  openSelectPreOrder = () => {
    this.setState({ showSelectPreOrder: true })
  }

  updatePreOrderSequence = (appointmentPreOrderItem = []) => {
    let sequence = 0;
    appointmentPreOrderItem.forEach(po => {
      if (!po.isDeleted) {
        po.sequence = sequence
        sequence = sequence + 1
      }
    })
  }

  onSelectPreOrder = (selectPreOrder = []) => {
    const { values, setFieldValue } = this.props
    const { currentAppointment = {} } = values
    let { appointmentPreOrderItem = [] } = currentAppointment
    selectPreOrder.forEach(po => {
      let currentPreOrder = appointmentPreOrderItem.find(apo => apo.actualizedPreOrderItemFK === po.id)
      if (currentPreOrder) {
        currentPreOrder.isDeleted = false
      }
      else {
        const { id, ...resetPreOrderItem } = po
        appointmentPreOrderItem = [...appointmentPreOrderItem, { ...resetPreOrderItem, actualizedPreOrderItemFK: id }]
      }
    })
    this.updatePreOrderSequence(appointmentPreOrderItem)
    setFieldValue("currentAppointment.appointmentPreOrderItem", [...appointmentPreOrderItem])
    this.setState({ showSelectPreOrder: false })
  }

  closeSelectPreOrder = () => {
    this.setState({ showSelectPreOrder: false })
  }

  checkedRecurrence = () => {
    const { dispatch, values, setFieldValue } = this.props
    const { currentAppointment = {} } = values
    if ((currentAppointment.appointmentPreOrderItem || []).length) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmText: 'ok',
          openConfirmContent: `Check Recurrence will remove all Pre-Order.`,
          onConfirmSave: () => {
            setFieldValue("currentAppointment.appointmentPreOrderItem", [])
          },
          onConfirmClose: () => {
            setFieldValue('isEnableRecurrence', false)
          }
        },
      })
    }
  }

  showPreOrder = () => {
    const { values, mode } = this.props
    const { isEnableRecurrence, patientProfileFK } = values
    const actualizePreOrderAccessRight = Authorized.check('appointment.actualizepreorder') || { rights: 'hidden' }
    if (actualizePreOrderAccessRight.rights === 'hidden') return false
    if (values.id) {
      return mode !== 'series'
    }
    return patientProfileFK && !isEnableRecurrence
  }

  deletePreOrderItem = (actualizedPreOrderItemFK) => {
    const { values, setFieldValue } = this.props
    const { currentAppointment = {} } = values
    let { appointmentPreOrderItem = [] } = currentAppointment

    var item = appointmentPreOrderItem.find(poi => poi.actualizedPreOrderItemFK === actualizedPreOrderItemFK)
    if (item) {
      if (item.id) {
        item.isDeleted = true
      }
      else {
        appointmentPreOrderItem = [...appointmentPreOrderItem.filter(poi => poi.actualizedPreOrderItemFK !== actualizedPreOrderItemFK)]
      }
    }
    this.updatePreOrderSequence(appointmentPreOrderItem)
    setFieldValue("currentAppointment.appointmentPreOrderItem", [...appointmentPreOrderItem])
  }

  render () {
    const {
      classes,
      theme,
      onClose,
      loading,
      values,
      mode,
      conflicts,
      selectedSlot,
      height,
      onHistoryRowSelected,
      patientProfile,
      visitRegistration: { visitOrderTemplateOptions = [] },
      dispatch,
    } = this.props

    const {
      showPatientProfile,
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      showRescheduleForm,
      datagrid,
      editingRows,
      showSelectPreOrder,
    } = this.state

    const patientIsActive =
      values.patientProfileFK > 0
        ? patientProfile && patientProfile.isActive
        : true

    const { currentAppointment = {}, isEnableRecurrence } = values
    const { appointmentPreOrderItem = [] } = currentAppointment
    const disablePatientInfo = this.shouldDisablePatientInfo()
    const disableFooterButton = this.shouldDisableButtonAction()
    const disableCheckAvailabilityFooterButton = this.shouldDisableCheckAvailabilityButtonAction()
    const disableDataGrid = this.shouldDisableDatagrid()

    const _datagrid =
      conflicts.length > 0
        ? datagrid
          .filter((item) => !item.isDeleted)
          .sort(sortDataGrid)
          .map((item, index) => ({ ...item, sortOrder: index }))
        : [
          ...datagrid,
        ]

    const show =
      loading.effects['patientSearch/query'] || loading.models.calendar
    const _disableAppointmentDate =
      this.shouldDisableAppointmentDate() || !patientIsActive

    const { pendingPreOrderItem = [] } = patientProfile || {}
    const draftPreOrderItem = [...pendingPreOrderItem.filter(x => x.preOrderItemStatus === 'New').filter(po => !appointmentPreOrderItem.find(apo => !apo.isDeleted && apo.actualizedPreOrderItemFK === po.id)),
    ...appointmentPreOrderItem.filter(apo => apo.isDeleted).map(apo => {
      const { isDeleted, ...resetPreOrderItem } = apo
      return { ...resetPreOrderItem, id: resetPreOrderItem.actualizedPreOrderItemFK }
    })]

    const actualizePreOrderAccessRight = Authorized.check('appointment.actualizepreorder') || { rights: 'hidden' }
    return (
      <LoadingWrapper loading={show} text='Loading...'>
        <SizeContainer size='sm'>
          <React.Fragment>
            {values.patientProfileFK && <div style={{ marginTop: -20 }}>
              <PatientBanner extraCmt={
                <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: '100%',
                paddingBottom: 10,
              }}>
                  {actualizePreOrderAccessRight.rights !== 'hidden' && <Link disabled={actualizePreOrderAccessRight.rights === 'disable'} >
                    <span style={{ textDecoration: 'underline' }} onClick={(e) => {
                      e.preventDefault()
                      if (actualizePreOrderAccessRight.rights === 'disable') return
                      if (draftPreOrderItem.length)
                      {
                        if (values.id && mode === 'series') {
                          dispatch({
                            type: 'global/updateAppState',
                            payload: {
                              openConfirm: true,
                              isInformType: true,
                              openConfirmText: 'ok',
                              openConfirmContent: `Pre-Order is not allowed for entire series appointment.`,
                            },
                          })
                          return
                        }
                        if (!values.id && isEnableRecurrence) {
                          dispatch({
                            type: 'global/updateAppState',
                            payload: {
                              openConfirm: true,
                              isInformType: true,
                              openConfirmText: 'ok',
                              openConfirmContent: `Pre-Order is not allowed for recurring appointment.`,
                            },
                          })
                          return
                        }
                        this.openSelectPreOrder()
                      }
                    }}>{`Pre-Order(${draftPreOrderItem.length})`}</span>
                  </Link>
                  }
                </div>} />
            </div>}
            <GridContainer
              className={classnames(classes.formContent)}
              alignItems='flex-start'
            >
              <GridItem container xs={12} md={7}>
                <GridItem
                  container
                  xs
                  md={12}
                  style={{
                    height: this.props.height - 270,
                    overflow: 'auto',
                  }}
                  justify='flex-start'
                >
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
                    patientIsActive={patientIsActive}
                    appointmentStatusFK={currentAppointment.appointmentStatusFk}
                    values={values}
                    hasActiveSession={this.state.hasActiveSession}
                  />
                  <AppointmentDateInput disabled={_disableAppointmentDate} visitOrderTemplateOptions={visitOrderTemplateOptions} />
                  <GridItem xs md={12} className={classes.verticalSpacing}>
                    <AppointmentDataGrid
                      validationSchema={gridValidationSchema}
                      disabled={disableDataGrid}
                      appointmentDate={currentAppointment.appointmentDate}
                      data={_datagrid}
                      handleCommitChanges={this.onCommitChanges}
                      handleEditingRowsChange={this.onEditingRowsChange}
                      editingRows={editingRows}
                      selectedSlot={selectedSlot}
                    />
                  </GridItem>
                  <GridItem xs md={12}>
                    <Field
                      name='currentAppointment.appointmentRemarks'
                      render={(args) => (
                        <OutlinedTextField
                          {...args}
                          disabled={disableDataGrid}
                          rows='2'
                          multiline
                          maxLength={2000}
                          label='Appointment Remarks'
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs md={12}>
                    <Recurrence
                      size='lg'
                      disabled={values.id !== undefined}
                      formValues={values}
                      recurrenceDto={values.recurrenceDto}
                      handleRecurrencePatternChange={
                        this.onRecurrencePatternChange
                      }
                      checkedRecurrence={this.checkedRecurrence}
                    />
                  </GridItem>
                  <GridItem xs md={12}>
                    {this.showPreOrder() && <PreOrder {...this.props} deletePreOrderItem={this.deletePreOrderItem}></PreOrder>}
                  </GridItem>
                </GridItem>

                <GridItem xs md={12} className={classes.footerGrid}>
                  <FormFooter
                    // isNew={slotInfo.type === 'add'}
                    appointmentStatusFK={currentAppointment.appointmentStatusFk}
                    onClose={onClose}
                    disabled={disableFooterButton}
                    patientIsActive={patientIsActive}
                    disabledCheckAvailability={
                      disableCheckAvailabilityFooterButton
                    }
                    handleCancelOrDeleteClick={this.onCancelOrDeleteClick}
                    handleSaveDraftClick={this.onSaveDraftClick}
                    handleConfirmClick={this.onConfirmClick}
                    handleValidateClick={this.onValidateClick}
                  />
                </GridItem>
              </GridItem>
              <GridItem xs={12} md={5}>
                <CardContainer
                  hideHeader
                  className={classes.appointmentHistory}
                  style={{ maxHeight: this.props.height - 200 }}
                >
                  <h4 style={{ fontWeight: 500 }}>Appointment History</h4>
                  <AppointmentHistory
                    handleRowDoubleClick={(data) => {
                      onHistoryRowSelected({ ...data, isHistory: true })
                    }}
                  />
                </CardContainer>
              </GridItem>
            </GridContainer>
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
                search={values.patientName}
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
            <CommonModal
              open={showSelectPreOrder}
              title='Select Pre-Order'
              onClose={this.closeSelectPreOrder}
              maxWidth='lg'
            >
              <SelectPreOrder onSelectPreOrder={this.onSelectPreOrder} activePreOrderItem={draftPreOrderItem} />
            </CommonModal>
          </React.Fragment>
        </SizeContainer>
      </LoadingWrapper>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'ApptForm', withTheme: true })(
  Form,
)

export default FormComponent
