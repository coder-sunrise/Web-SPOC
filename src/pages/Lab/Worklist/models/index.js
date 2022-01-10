import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'labWorklist',
  config: { queryOnLoad: false },
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {},
    reducers: {},
  },
})
