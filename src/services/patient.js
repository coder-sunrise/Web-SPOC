import * as service from '@/services/common'
import request from '@/utils/request'

const url = '/api/patient'
const stickyNotesUrl = '/api/PatientStickyNotes'
import { stringify } from 'qs'
// const { api } = config
// const { url, subjects, getListWithoutCheckRights } = api

const fns = {
  queryList: params => service.queryList(url, params),
  remove: params => service.remove(url, params),
  query: params => service.query(url, params),
  queryForNewVisit: params => service.queryList(`${url}/forvisit`, params),
  // create: params => service.create(url, params),
  // update: (params) => service.update(url, params),
  upsert: params => service.upsert(url, params),
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
  queryStickyNotes: params =>
    service.query(stickyNotesUrl, params.patientProfileFK),
  createStickyNotes: params => service.upsert(stickyNotesUrl, params),
  upsertStickyNotes: params => service.upsert(stickyNotesUrl, params),
  getFamilyMembersInfo: async params => {
    return await request(`${url}/GetFamilyMembersInfo?${stringify(params)}`)
  },
}
export default fns
