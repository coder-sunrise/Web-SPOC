import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'radiologyWorklist',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {},
    reducers: {},
  },
})
