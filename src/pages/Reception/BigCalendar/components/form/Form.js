import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import * as Yup from 'yup'
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
// custom components
import PatientSearchModal from '../../PatientSearch'
import DeleteConfirmation from './DeleteConfirmation'
import AppointmentDataGrid from './AppointmentDataGrid'
import PatientInfoInput from './PatientInfo'
import AppointmentDateInput from './AppointmentDate'
import Recurrence from './Recurrence'
import FormFooter from './FormFooter'
import SeriesUpdateConfirmation from '../../SeriesUpdateConfirmation'
// utils
import {
  mapPropsToValues,
  getEventSeriesByID,
  parseDateToServerDateFormatString,
  mapDatagridToAppointmentResources,
} from './formikUtils'
import styles from './style'

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string().required('Patient Name is required'),
  patientContactNo: Yup.string().required('Contact No. is required'),
  appointmentDate: Yup.date().required('Appointment Date is required'),
})

@connect(({ loginSEMR, user, calendar, codetable }) => ({
  loginSEMR,
  user: user.data,
  events: calendar.list,
  appointmentStatuses: codetable.ltappointmentstatus,
}))
@withFormik({
  enableReinitialize: true,
  validationSchema: AppointmentSchema,
  mapPropsToValues,
})
class Form extends React.PureComponent {
  state = {
    showSearchPatientModal: false,
    showDeleteConfirmationModal: false,
    datagrid: getEventSeriesByID(
      this.props.selectedAppointmentID,
      this.props.events,
    ),
    showSeriesUpdateConfirmation: false,
  }

  componentWillMount () {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      code: 'ltappointmentstatus',
    })
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

  // handleSelectPatient = (patientID) => {
  //   fetchPatientInfoByPatientID(patientID).then((response) => {
  //     if (response) {
  //       const patientInfo = { ...response.data }
  //       const { name, contact } = patientInfo
  //       const patientName = name !== undefined ? name : ''
  //       let contactNumber = ''
  //       if (contact) {
  //         const { mobileContactNumber } = contact
  //         contactNumber = mobileContactNumber.number
  //       }
  //       const { setFieldValue, setFieldTouched } = this.props

  //       setFieldValue('patientName', patientName)
  //       setFieldValue('contactNo', contactNumber)

  //       setFieldTouched('patientName', true)
  //       setFieldTouched('contactNo', true)

  //       this.setState({
  //         showSearchPatientModal: false,
  //         isRegisteredPatient: true,
  //       })
  //     }
  //   })
  // }

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

  onCancelAppointmentClick = () => {
    this.setState({
      showDeleteConfirmationModal: true,
    })
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
    this._confirm()
  }

  submit = async (appointmentStatusFK) => {
    const { validateForm, setSubmitting } = this.props
    setSubmitting(true)
    const formError = await validateForm()

    if (Object.keys(formError).length > 0) {
      setSubmitting(false)
      return
    }

    const { datagrid } = this.state
    const { values, onClose, dispatch, resetForm } = this.props

    const {
      appointmentRemarks,
      appointmentDate,
      isEnableRecurrence,
      recurrenceDto,
      ...appointmentValues
    } = values

    const appointmentResources = datagrid.map(mapDatagridToAppointmentResources)

    const appointments = [
      {
        appointmentStatusFK,
        appointmentRemarks,
        appintmentDate: parseDateToServerDateFormatString(appointmentDate),
        appointments_Resources: [
          ...appointmentResources,
        ],
      },
    ]

    const updated = {
      ...appointmentValues,
      isEnableRecurrence,
      recurrenceDto: !isEnableRecurrence ? undefined : recurrenceDto,
      appointments,
    }

    console.log({ updated })
    setSubmitting(false)
    dispatch({
      type: 'calendar/upsert',
      payload: updated,
    })
    resetForm()
    onClose && onClose()
  }

  onDeleteClick = () => {}

  onSaveDraftClick = () => {
    const appointmentStatusFK = this.props.appointmentStatuses.find(
      (item) => item.code === 'DRAFT',
    ).id
    console.log({ appointmentStatus: this.props.appointmentStatuses })

    this.submit(appointmentStatusFK)
  }

  _confirm = () => {
    const appointmentStatusFK = this.props.appointmentStatuses.find(
      (item) => item.code === 'SCHEDULED',
    ).id

    this.submit(appointmentStatusFK)
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
    this._confirm()
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
              <FastField
                name='appointmentRemarks'
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
                appointmentDate={values.appointmentDate}
                data={datagrid}
                handleCommitChanges={this.onCommitChanges}
              />
            </GridItem>

            <GridItem xs md={12}>
              <Recurrence values={values} />
            </GridItem>
          </GridContainer>

          <FormFooter
            // isNew={slotInfo.type === 'add'}
            appointmentStatusFK={values.appointmentStatusFk}
            onCancelAppointmentClick={this.onCancelAppointmentClick}
            onClose={onClose}
            handleDeleteClick={this.onDeleteClick}
            handleSaveDraftClick={this.onSaveDraftClick}
            handleConfirmClick={this.onConfirmClick}
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
            onConfirm={this.onConfirmSeriesUpdate}
            maxWidth='sm'
          >
            <SeriesUpdateConfirmation />
          </CommonModal>
        </React.Fragment>
      </SizeContainer>
    )
  }
}

const FormComponent = withStyles(styles, { name: 'ApptForm' })(Form)

export default FormComponent
