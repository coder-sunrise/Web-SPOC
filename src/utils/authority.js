const roleAccessRightsMapping = {
  tester: [
    { name: 'tester', rights: 'enable' },
    { name: 'patient.test', rights: 'enable' },
    // { name: 'patient.edit', rights: 'disable' },
    { name: 'patient.edit', rights: 'enable' },
    { name: 'patient.view', rights: 'enable' },
    { name: 'patient.history', rights: 'disable' },
    { name: 'systemSettings.edit', rights: 'enable' },
    { name: 'consultation.view', rights: 'enable' },
    { name: 'consultation.edit', rights: 'enable' },
    { name: 'dispense.view', rights: 'enable' },
    { name: 'dispense.edit', rights: 'enable' },
    { name: 'schemeDetail.view', rights: 'enable' },
    { name: 'schemeDetail.edit', rights: 'enable' },
    { name: 'settingCompany.view', rights: 'enable' },
    { name: 'settingCompany.edit', rights: 'enable' },
  ],
  editor: [
    { name: 'editor', rights: 'enable' },
    { name: 'patient.edit', rights: 'enable' },
    { name: 'patient.new', rights: 'enable' },
    { name: 'patient.view', rights: 'enable' },
  ],
}
const accessRightsMapping = {
  'patient.edit': 'SEMRWebApp:PatientDatabase:EditPatientProfile',
  'patient.new': 'SEMRWebApp:PatientDatabase:NewPatient',
  'patient.view': 'SEMRWebApp:PatientDatabase',
}
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority (str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  // g_app

  return JSON.parse(sessionStorage.getItem('accessRights')) || []

  if (!window.g_app || !window.g_app._store) return []
  const { accessRights } = window.g_app._store.getState().user
  console.log(accessRights)

  return accessRights
  const authorityString =
    typeof str === 'undefined'
      ? localStorage.getItem('antd-pro-authority')
      : str

  // authorityString could be admin, "admin", ["admin"]
  let authority
  try {
    authority = JSON.parse(authorityString)
  } catch (e) {
    authority = authorityString
  }
  let result = authority
  if (!result) return []
  // console.log(result, authority)
  if (typeof authority === 'string') {
    result = [
      authority,
    ]
  }
  const r = result
    .map((o) => roleAccessRightsMapping[o] || [])
    .reduce((a, b) => {
      return a.concat(b)
    })
  // console.log(r)
  return r
}

export function setAuthority (authority) {
  const proAuthority =
    typeof authority === 'string'
      ? [
          authority,
        ]
      : authority
  return localStorage.setItem(
    'antd-pro-authority',
    JSON.stringify(proAuthority),
  )
}
