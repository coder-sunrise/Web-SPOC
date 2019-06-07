import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import * as service from '../service/appointment'
// events data
import { dndEvents } from '../events'

export default createListViewModel({
  namespace: 'bigcalendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      calendarEvents: dndEvents,
      showAll: false,
    },
    subscriptions: {},
    effects: {},
    reducers: {},
  },
})
