import { createListViewModel } from 'medisys-model'
import service from '../services'

console.log('service', service)

export default createListViewModel({
  namespace: 'radiologyWorklist',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    effects: {},
    reducers: {},
  },
})
