import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { bool } from 'prop-types'
import _ from 'lodash'
import { cleanFields } from '@/pages/Consultation/utils'
import { VISIT_TYPE, VISITDOCTOR_CONSULTATIONSTATUS } from '@/utils/constants'
import { notification } from '@/components'
import { VISIT_STATUS } from '../variables'
import { roundTo } from '@/utils/utils'

const filterDeletedFiles = item => {
  // filter out not yet confirmed files
  // fileIndexFK ===
  if (item.fileIndexFK === undefined && item.isDeleted) return false
  return true
}

const mapAttachmentToUploadInput = (
  {
    fileIndexFK,
    fileName,
    attachmentType,
    attachmentTypeFK,
    isDeleted,
    thumbnail,
    ...rest
  },
  index,
) =>
  !fileIndexFK
    ? {
        // file status === uploaded, only 4 info needed for API
        fileIndexFK: rest.id,
        thumbnailIndexFK: thumbnail ? thumbnail.id : undefined,
        sortOrder: index,
        fileName,
        attachmentType,
        attachmentTypeFK,
        isDeleted,
        remarks: rest.remarks,
      }
    : {
        // file status === confirmed, need to provide full object for API
        ...rest,
        fileIndexFK,
        thumbnailIndexFK: thumbnail ? thumbnail.id : undefined,
        fileName,
        attachmentType,
        attachmentTypeFK,
        isDeleted,
        sortOrder: index,
      }

export const formikMapPropsToValues = ({
  clinicInfo,
  queueLog,
  visitRegistration,
  doctorProfiles,
  history,
  clinicSettings,
  patientInfo,
}) => {
  try {
    let qNo = 0.0
    let doctorProfile
    let doctorProfileFK
    let visitPurposeFK = clinicSettings.defaultVisitType
    let roomAssignmentFK
    let consReady
    let resourceRoomFK
    if (clinicInfo) {
      doctorProfileFK = clinicInfo.primaryRegisteredDoctorFK
    }

    const { visitInfo, roomFK, appointment, maxQueueNo } = visitRegistration
    if (queueLog) {
      const { list } = queueLog
      const largestQNo = maxQueueNo
        ? parseFloat(maxQueueNo)
        : list.reduce(
            (largest, { queueNo }) =>
              parseFloat(queueNo) > largest ? parseFloat(queueNo) : largest,
            0,
          )
      qNo = parseFloat(largestQNo + 1).toFixed(
        clinicSettings.settings.isQueueNoDecimal ? 1 : 0,
      )
    }

    if (Object.keys(visitInfo).length > 0) {
      qNo = visitInfo.queueNo
    }
    const {
      visit = {
        visitDoctor: [],
        isDoctorInCharge: true,
      },
    } = visitInfo

    const visitEntries = Object.keys(visit).reduce(
      (entries, key) => ({
        ...entries,
        [key]: visit[key] === null ? undefined : visit[key],
      }),
      {},
    )
    const { location } = history

    if (!visitEntries.id) {
      if (doctorProfile) {
        if (doctorProfile.clinicianProfile.roomAssignment) {
          roomAssignmentFK =
            doctorProfile.clinicianProfile.roomAssignment.roomFK
        }
      } else if (doctorProfileFK) {
        const defaultDoctor = doctorProfiles.find(
          doctor => doctor.id === doctorProfileFK,
        )
        if (defaultDoctor.clinicianProfile.roomAssignment) {
          roomAssignmentFK =
            defaultDoctor.clinicianProfile.roomAssignment.roomFK
        }
      }
      if (appointment && appointment.appointments.length) {
        resourceRoomFK =
          appointment.appointments[0].appointments_Resources[0].calendarResource
            ?.resourceDto?.roomFK
        if (
          appointment.appointments[0].appointments_Resources[0].calendarResource
            .resourceType === 'Doctor'
        ) {
          doctorProfileFK =
            appointment.appointments[0].appointments_Resources[0]
              .calendarResource.clinicianProfileDto.doctorProfileFK
        }
      }
    }

    let referralType = 'None'
    // Edit visit
    if (visitEntries.id) {
      if (visitEntries.referralSourceFK || visitEntries.referralPersonFK) {
        referralType = 'Company'
      } else if (visitEntries.referralPatientProfileFK) {
        referralType = 'Patient'
      }
    } else if (
      patientInfo &&
      (patientInfo.referredBy === 'Company' ||
        patientInfo.referredBy === 'Patient')
    ) {
      referralType = patientInfo.referredBy
    } else if (clinicSettings.settings.isVisitReferralSourceMandatory) {
      referralType = 'Company'
    }

    if (visitRegistration.consReady === undefined) consReady = true

    return {
      queueNo: qNo,
      visitPurposeFK: visitRegistration.isRegisterOtc
        ? VISIT_TYPE.OTC
        : VISIT_TYPE.BF,
      consReady,
      roomFK: resourceRoomFK || roomAssignmentFK || roomFK,
      visitStatus: VISIT_STATUS.WAITING,
      // doctorProfileFK: doctorProfile ? doctorProfile.id : undefined,
      doctorProfileFK,
      ...visitEntries,
      referredBy: referralType,
      referralRemarks: visitEntries.id
        ? visitEntries.referralRemarks
        : patientInfo.referralRemarks,
      referralSourceFK: visitEntries.id
        ? visitEntries.referralSourceFK
        : patientInfo.referralSourceFK,
      referralPersonFK: visitEntries.id
        ? visitEntries.referralPersonFK
        : patientInfo.referralPersonFK,
      referralPatientProfileFK: visitEntries.id
        ? visitEntries.referralPatientProfileFK
        : patientInfo.referredByPatientFK,
      visitDoctor: [
        ...visitEntries.visitDoctor.filter(d => !d.isPrimaryDoctor),
      ],
      visitPrimaryDoctor: visitEntries.visitDoctor.find(d => d.isPrimaryDoctor),
    }
  } catch (error) {
    console.log({ error })
    return {}
  }
}

export const formikHandleSubmit = (
  values,
  { props, resetForm, setSubmitting },
) => {
  const { queueNo, visitAttachment, referralBy = [], ...restValues } = values
  const {
    history,
    dispatch,
    queueLog,
    patientInfo,
    visitRegistration,
    clinicSettings,
    onConfirm,
    doctorProfiles,
  } = props

  const { sessionInfo } = queueLog
  const {
    visitInfo: { id = undefined, visit, ...restVisitInfo },
    // patientInfo,
    appointmentFK,
    roomFK,
  } = visitRegistration
  const bizSessionFK = sessionInfo.id

  const visitReferenceNo = `${sessionInfo.sessionNo}-${parseFloat(id).toFixed(
    1,
  )}`

  const patientProfileFK = patientInfo.id

  let uploaded = []
  if (visitAttachment) {
    uploaded = visitAttachment
      .filter(filterDeletedFiles)
      .map(mapAttachmentToUploadInput)
  }

  let _referralBy = null

  if (typeof referralBy === 'string') {
    _referralBy = referralBy
  } else if (Array.isArray(referralBy) && referralBy.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    _referralBy = referralBy[0]
  }

  let newVisitDoctor = restValues.visitDoctor
    .filter(d => d.id > 0 || !d.isDeleted)
    .map((d, index) => {
      return {
        ...d,
        sequence: index,
        consultationStatus:
          d.consultationStatus || VISITDOCTOR_CONSULTATIONSTATUS.WAITING,
      }
    })

  var primaryDoctor = doctorProfiles.find(
    x => x.id === restValues.doctorProfileFK,
  )
  if (restValues.visitPrimaryDoctor) {
    newVisitDoctor.push({
      ...restValues.visitPrimaryDoctor,
      doctorProfileFK: restValues.doctorProfileFK,
      specialtyFK: primaryDoctor?.clinicianProfile?.specialtyFK,
    })
  } else {
    newVisitDoctor.push({
      doctorProfileFK: restValues.doctorProfileFK,
      isPrimaryDoctor: true,
      sequence: -1,
      consultationStatus: VISITDOCTOR_CONSULTATIONSTATUS.WAITING,
      specialtyFK: primaryDoctor?.clinicianProfile?.specialtyFK,
    })
  }

  const payload = {
    cfg: {
      message: id ? 'Visit updated' : 'Visit created',
    },
    id,
    ...restVisitInfo,
    queueNo: parseFloat(queueNo).toFixed(
      clinicSettings.settings.isQueueNoDecimal ? 1 : 0,
    ),
    queueNoPrefix: sessionInfo.sessionNoPrefix,
    visit: {
      visitAttachment: uploaded,
      patientProfileFK,
      bizSessionFK,
      visitReferenceNo,
      appointmentFK,
      roomFK,
      visitStatus: VISIT_STATUS.WAITING,
      ...restValues, // override using formik values
      visitDoctor: newVisitDoctor,
      referralBy: _referralBy,
    },
  }

  dispatch({
    type: 'visitRegistration/upsert',
    payload,
  }).then(response => {
    if (response) {
      const { location } = history
      sendQueueNotification({
        message: 'New visit created.',
        queueNo: payload && payload.queueNo,
      })
      if (location.pathname === '/reception/appointment')
        dispatch({
          type: 'calendar/refresh',
        })
      else {
        dispatch({
          type: 'queueLog/initState',
        })
        dispatch({
          type: 'queueLog/refresh',
        })
      }
      // reset form can not after onConfirm function.
      // bcz in NewVisit component have function 'componentWillUnmount'
      // there will use this.props.values when close registration visit page
      resetForm({})
      onConfirm()
    } else {
      setSubmitting(false)
    }
  })
}
