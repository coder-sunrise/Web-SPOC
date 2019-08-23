const filterDeletedFiles = (item) => {
  // filter out not yet confirmed files
  // fileIndexFK ===
  if (item.fileIndexFK === undefined && item.isDeleted) return false
  return true
}

const mapAttachmentToUploadInput = (
  { fileIndexFK, fileName, attachmentType, isDeleted, ...rest },
  index,
) =>
  !fileIndexFK
    ? {
        // file status === uploaded, only 4 info needed for API
        fileIndexFK: rest.id,
        sortOrder: index,
        fileName,
        attachmentType,
        isDeleted,
      }
    : {
        // file status === confirmed, need to provide full object for API
        ...rest,
        fileIndexFK,
        fileName,
        attachmentType,
        isDeleted,
        sortOrder: index,
      }

export const formikMapPropsToValues = ({ queueLog, visitRegistration }) => {
  let qNo = 0.0
  if (queueLog) {
    const { list } = queueLog
    const largestQNo = list.reduce(
      (largest, { queueNo }) =>
        parseFloat(queueNo) > largest ? parseFloat(queueNo) : largest,
      0,
    )
    qNo = parseFloat(largestQNo + 1).toFixed(1)
  }

  const { visitInfo } = visitRegistration

  if (Object.keys(visitInfo).length > 0) {
    qNo = visitInfo.queueNo
  }
  const { visit = {} } = visitInfo

  const visitEntries = Object.keys(visit).reduce(
    (entries, key) => ({
      ...entries,
      [key]: visit[key] === null ? undefined : visit[key],
    }),
    {},
  )

  return {
    queueNo: qNo,
    visitPurposeFK: 1,
    ...visitEntries,
  }
}

export const formikHandleSubmit = (values, { props, resetForm }) => {
  const { queueNo, visitAttachment, ...restValues } = values
  const { dispatch, queueLog, visitRegistration, onConfirm } = props

  const { sessionInfo } = queueLog
  const {
    visitInfo: { id = undefined, visit, ...restVisitInfo },
    patientInfo,
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

  const payload = {
    id,
    ...restVisitInfo,
    queueNo: parseFloat(queueNo).toFixed(1),
    queueNoPrefix: sessionInfo.sessionNoPrefix,
    visit: {
      visitAttachment: uploaded,
      patientProfileFK,
      bizSessionFK,
      visitReferenceNo,
      visitStatus: 'WAITING',
      visitRemarks: null,
      temperatureC: null,
      bpSysMMHG: null,
      bpDiaMMHG: null,
      heightCM: null,
      weightKG: null,
      bmi: null,
      pulseRateBPM: null,
      priorityTime: null,
      priorityType: null,
      referralPersonFK: null,
      referralCompanyFK: null,
      referralPerson: null,
      referralDate: null,
      ...restValues, // override using formik values
    },
  }

  const type =
    id === undefined
      ? 'visitRegistration/registerVisitInfo'
      : 'visitRegistration/saveVisitInfo'

  resetForm({})
  if (onConfirm) onConfirm()

  dispatch({
    type,
    payload,
  }).then((response) => {
    resetForm({})
    return response && onConfirm()
  })
}
