import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import * as service from '../service/appointment'

export default createListViewModel({
  namespace: 'bigcalendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      showAll: false,
    },
    subscriptions: {},
    effects: {},
    reducers: {},
  },
})
