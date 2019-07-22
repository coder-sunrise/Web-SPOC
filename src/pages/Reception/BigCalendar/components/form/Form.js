import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import moment from 'moment'
import * as Yup from 'yup'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Divider, CircularProgress, withStyles } from '@material-ui/core'
// custom component
import {
  CardContainer,
  CommonModal,
  GridContainer,
  GridItem,
  SizeContainer,
  OutlinedTextField,
  Checkbox,
  Select,
} from '@/components'
// custom components
import NewPatient from '../../../../PatientDatabase/New'
import PatientSearchModal from '../../PatientSearch'
import DeleteConfirmation from './DeleteConfirmation'
import AppointmentDataGrid from './AppointmentDataGrid'
import PatientInfoInput from './PatientInfo'
import AppointmentDateInput from './AppointmentDate'
import Recurrence from './Recurrence'
import FormFooter from './FormFooter'
import SeriesUpdateConfirmation from '../../SeriesUpdateConfirmation'
// services
import {
  fetchPatientListByName,
  fetchPatientInfoByPatientID,
} from '../../service/appointment'
import {
  handleSubmit as submitForm,
  mapPropsToValues,
  getEventSeriesByID,
} from './formikUtils'

import { getUniqueGUID } from '@/utils/utils'
import styles from './style'

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string().required(),
  contactNo: Yup.string().required(),
  startDate: Yup.string().required(),
})

@connect(({ loginSEMR }) => ({ loginSEMR }))
@withFormik({
  enableReinitialize: true,
  validationSchema: AppointmentSchema,
  handleSubmit: submitForm,
  mapPropsToValues,
})
class Form extends React.PureComponent {
  state = {
    showNewPatientModal: false,
    showSearchPatientModal: false,
    showDeleteConfirmationModal: false,
    patientList: [],
    eventSeries: getEventSeriesByID(
      this.props.slotInfo._appointmentID,
      this.props.calendarEvents,
    ),
    isRegisteredPatient: false,
    showSeriesUpdateConfirmation: false,
  }

  toggleNewPatientModal = () => {
    const { showNewPatientModal } = this.state
    this.setState({ showNewPatientModal: !showNewPatientModal })
  }

  openSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: true })
  }

  closeSearchPatientModal = () => {
    this.setState({ showSearchPatientModal: false })
  }

  onSearchPatient = () => {
    const { values } = this.props
    this.searchPatient(values.patientName)
  }

  searchPatient = (patientName) => {
    fetchPatientListByName(patientName).then((response) => {
      if (response) {
        const { data: { data = [] } } = response
        this.setState({
          patientList: [
            ...data,
          ],
          showSearchPatientModal: true,
        })
      }
    })
  }

  handleSelectPatient = (patientID) => {
    fetchPatientInfoByPatientID(patientID).then((response) => {
      if (response) {
        const patientInfo = { ...response.data }
        const { name, contact } = patientInfo
        const patientName = name !== undefined ? name : ''
        let contactNumber = ''
        if (contact) {
          const { mobileContactNumber } = contact
          contactNumber = mobileContactNumber.number
        }
        const { setFieldValue, setFieldTouched } = this.props

        setFieldValue('patientName', patientName)
        setFieldValue('contactNo', contactNumber)

        setFieldTouched('patientName', true)
        setFieldTouched('contactNo', true)

        this.setState({
          showSearchPatientModal: false,
          isRegisteredPatient: true,
        })
      }
    })
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
    const { handleDeleteEvent, slotInfo } = this.props
    console.log({ slotInfo })
    this.setState(
      {
        showDeleteConfirmationModal: false,
      },
      () => {
        handleDeleteEvent(slotInfo.id, slotInfo._appointmentID)
      },
    )
  }

  onCommitChanges = ({ rows, deleted }) => {
    if (rows) {
      this.setState({
        eventSeries: rows,
      })
    }
    if (deleted) {
      const { eventSeries } = this.state
      this.setState({
        eventSeries: eventSeries.filter((event) => !deleted.includes(event.id)),
      })
    }
  }

  onConfirmClick = () => {
    const { slotInfo } = this.props
    if (slotInfo.series) {
      this.openSeriesUpdateConfirmation()
    } else {
      this._confirm()
    }
  }

  _confirm = () => {
    const { eventSeries, isRegisteredPatient } = this.state
    const {
      values,
      handleUpdateEventSeries,
      resetForm,
      slotInfo,
      resources,
    } = this.props

    const { _appointmentID, patientName, contactNo, remarks } = values

    const calendarEvents = eventSeries.map((event) => {
      const { timeFrom, timeTo, doctor, id, ...restColumn } = event
      const dateTimeFormat = 'DD-MM-YYYY hh:mm a'
      const timeIn = moment(timeFrom).format(dateTimeFormat)
      const timeOut = moment(timeTo).format(dateTimeFormat)

      const matchedResource = resources.find(
        (resource) =>
          resource.doctorName.toUpperCase() === doctor.toUpperCase(),
      )

      const doctorResource =
        matchedResource !== undefined ? matchedResource.doctorProfileFK : '4'

      return {
        ...event,
        id: id !== undefined ? id : getUniqueGUID(),
        resourceId: doctorResource,
        start: timeFrom,
        end: timeTo,
      }
      // return {
      //   _appointmentID,
      //   id:
      //   ...restColumn,
      //   patientName,
      //   isRegisteredPatient,
      //   contactNo,
      //   remarks,
      //   timeFrom,
      //   timeTo,
      //   doctor,
      //   // doctorProfileFK: doctorResource,
      //   resourceId: doctorResource,
      //   start: timeFrom,
      //   end: timeTo,
      //   // for Queue Listing
      //   visitStatus: 'APPOINTMENT',
      //   timeIn,
      //   timeOut,
      // }
    })
    const updated = {
      ...values,
      appointmentResources: calendarEvents,
    }

    handleUpdateEventSeries({
      [slotInfo.type]: updated,
      _appointmentID,
    })

    resetForm()
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
    const { classes, onClose, slotInfo, isLoading, values } = this.props

    const {
      showNewPatientModal,
      showSearchPatientModal,
      showDeleteConfirmationModal,
      showSeriesUpdateConfirmation,
      patientList,
      eventSeries,
    } = this.state

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
                isRegisteredPatient={values.isRegisteredPatient}
                patientName={values.patientName}
              />
              <AppointmentDateInput />
            </GridItem>
            <GridItem xs md={6} className={classnames(classes.remarksField)}>
              <FastField
                name='remarks'
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
                data={eventSeries}
                handleCommitChanges={this.onCommitChanges}
              />
            </GridItem>

            <GridItem xs md={12}>
              <Recurrence values={values} />
            </GridItem>
          </GridContainer>

          <FormFooter
            isNew={slotInfo.type === 'add'}
            isDraft={slotInfo.draft}
            onCancelAppointmentClick={this.onCancelAppointmentClick}
            onClose={onClose}
            onConfirmClick={this.onConfirmClick}
          />

          <CommonModal
            open={showNewPatientModal}
            title='Register New Patient'
            onClose={this.toggleNewPatientModal}
            onConfirm={this.toggleNewPatientModal}
            fullScreen
            showFooter={false}
          >
            {showNewPatientModal ? <NewPatient /> : null}
          </CommonModal>
          <CommonModal
            open={showSearchPatientModal}
            title='Search Patient'
            onClose={this.closeSearchPatientModal}
            onConfirm={this.closeSearchPatientModal}
            maxWidth='md'
            showFooter={false}
          >
            <PatientSearchModal
              searchPatientName={values.patientName}
              patientList={patientList}
              handleSearchPatient={this.searchPatient}
              onBackClick={this.closeSearchPatientModal}
              onSelectClick={this.handleSelectPatient}
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
            onConfirm={this.onConfirmSeriesUpdate}
            maxWidth='sm'
          >
            <SeriesUpdateConfirmation />
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
