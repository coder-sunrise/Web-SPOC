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
      selectedIndex: '',
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
      *queryTemplateList({ payload }, { call, put }) {
        const response = yield call(service.queryTemplateList, payload)
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
