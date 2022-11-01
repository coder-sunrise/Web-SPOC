import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'patientResults',
  param: {
    service,
    state: {
      default: {},
      list: [],
    },
    subscriptions: {},
    effects: {},
    reducers: {},
  },
})
