import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

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
      default: {
        scribleNotes: 'Test notes',
      },
    },
    effects: {
      *queryTemplateList ({ payload }, { call, put }) {
        const response = yield call(service.queryTemplateList, payload)
        return response
      },
    },
    reducers: {},
  },
})
