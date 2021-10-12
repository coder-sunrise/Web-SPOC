import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'pharmacyWorklist',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => { },
    effects: {},
    reducers: {},
  },
})
