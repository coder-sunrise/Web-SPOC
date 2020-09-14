import { navigateDirtyCheck, getRemovedUrl, getAppendUrl } from '@/utils/utils'

const mapEntityToValues = (entity) => {
  const mappedValues = {
    ...entity,
    pdpaConsent: entity.patientPdpaConsent.reduce(
      (consents, item) =>
        item.isConsent
          ? [
              ...consents,
              item.pdpaConsentTypeFK,
            ]
          : [
              ...consents,
            ],
      [],
    ),
  }
  return {
    ...mappedValues,
    nationalityFK: entity.id ? entity.nationalityFK : 173,
  }
}

const upsertPatient = async ({
  values,
  history,
  dispatch,
  patient,
  onConfirm,
  resetForm,
}) => {
  const { location } = history
  const cfg = {
    message: 'Patient profile saved.',
  }

  const shouldCloseForm = location.pathname
    ? !location.pathname.includes('patientdb')
    : false

  const response = await dispatch({
    type: 'patient/upsert',
    payload: {
      ...values,
      patientScheme: values.patientScheme.map((ps) => {
        if (ps.isDeleted)
          return {
            ...ps,
            schemeTypeFK: ps.schemeTypeFK || ps.preSchemeTypeFK,
          }
        return ps
      }),
      cfg,
    },
  })

  dispatch({
    type: 'global/updateState',
    payload: {
      disableSave: false,
    },
  })
  dispatch({
    type: 'patient/updateState',
    payload: {
      shouldQueryOnClose: location.pathname.includes('patientdb'),
    },
  })

  if (response) {
    if (response.id) {
      if (!patient.callback) {
        history.push(
          getRemovedUrl(
            [
              'new',
            ],
            getAppendUrl({
              pid: response.id,
            }),
          ),
        )
      }
    }

    const newPatient = await dispatch({
      type: 'patient/query',
      payload: {
        id: response.id || values.id,
      },
    })

    if (newPatient) {
      if (patient.callback) patient.callback(response.id)
      const newEntity = mapEntityToValues(newPatient)
      resetForm(newEntity)
    }
    if (onConfirm && shouldCloseForm) {
      onConfirm()
    }
  }
  return response
}
export { upsertPatient, mapEntityToValues }