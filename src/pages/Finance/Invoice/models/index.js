import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'invoiceList',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {},
  },
})
