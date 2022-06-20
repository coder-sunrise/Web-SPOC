import { createFormViewModel } from 'medisys-model'
import service from '../services'

export default createFormViewModel({
  namespace: 'scriblenotes',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      entity: '',
      selectedItemUid: '',
      Note: {
        notesScribbleArray: [],
      },
      ChiefComplaints: {
        chiefComplaintsScribbleArray: [],
      },
      Plan: {
        planScribbleArray: [],
      },
      History: {
        historyScribbleArray: [],
      },
      RadiologyFindings: {
        radiologyFindingsScribbleArray: [],
      },
      default: {
        scribleNotes: 'Test notes',
      },
    },
    effects: {
      *queryTemplate({ payload }, { call, put }) {
        const response = yield call(service.queryTemplate, payload)
        return response
      },
      *queryTemplateList({ payload }, { call, put }) {
        const response = yield call(service.queryTemplateList, payload)
        return response
      },
      *upsertTemplate({ payload }, { call, put }) {
        const response = yield call(service.upsertTemplate, payload)
        return response
      },
      *removeScribble({ payload }, { call, put }) {
        const response = yield call(service.remove, payload)
        return response
      },
    },
    reducers: {},
  },
})
