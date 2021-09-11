import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/patient'
const chasBalanceUrl = '/api/PatientCoPaymentScheme/ChasBalance'
const medisaveBalanceUrl = '/api/PatientCoPaymentScheme/MedisaveBalance'
const stickyNotesUrl = '/api/PatientStickyNotes'

// const { api } = config
// const { url, subjects, getListWithoutCheckRights } = api

const fns = {
  queryList: params => service.queryList(url, params),
  remove: params => service.remove(url, params),
  query: params => service.query(url, params),
  // create: params => service.create(url, params),
  // update: (params) => service.update(url, params),
  upsert: params => service.upsert(url, params),
  requestChasBalance: params => service.upsert(chasBalanceUrl, params),
  requestMedisaveBalance: params => service.upsert(medisaveBalanceUrl, params),
  queryDeposit: params => service.query(`${url}/Deposit`, params),
  duplicateCheck: async params => {
    const r = await request(`${url}/DuplicateCheck`, {
      method: 'GET',
      data: {
        ...params,
      },
    })
    return r
  },
  queryStickyNotes: params => service.query(stickyNotesUrl, params.patientProfileFK),
  createStickyNotes: params => service.upsert(stickyNotesUrl, params),
  upsertStickyNotes: params => service.upsert(stickyNotesUrl, params),
}
export default fns
