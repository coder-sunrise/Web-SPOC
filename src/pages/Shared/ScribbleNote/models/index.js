import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'

export default createFormViewModel({
  namespace: 'scriblenotes',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      entity: '',
      selectedIndex: '',
      notes: {
        notesScribbleArray: [],
      },
      ChiefComplaints:{
        chiefComplaintsScribbleArray: [],
      },
      Plan:{
        planScribbleArray: [],
      },
      default: {
        scribleNotes: 'Test notes',
      },
    },
    effects: {},
    reducers: {},
  },
})
