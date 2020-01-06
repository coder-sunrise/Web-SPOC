import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import * as service from '../services/cannedText'

const defaultState = {
  clinicianNote: [],
  chiefComplaints: [],
  associatedHistory: [],
  intraOral: [],
  extraOral: [],
  selectedNote: undefined,
}

export default createFormViewModel({
  namespace: 'cannedText',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      ...defaultState,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {
      setList (state, { payload }) {
        const { field, list } = payload
        return { ...state, [field]: list }
      },
      setSelectedNote (state, { payload }) {
        return { ...state, selectedNote: payload }
      },
    },
  },
})
