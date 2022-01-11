import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'nonClaimableHistory',
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
