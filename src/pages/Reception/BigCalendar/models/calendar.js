import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import * as service from '../service/appointment'
import { dndEvents } from '../events'

export default createListViewModel({
  namespace: 'calendar',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      calendarEvents: [
        ...dndEvents,
      ],
    },
    subscriptions: {},
    effects: {},
    reducers: {
      moveEvent (state, { calendarEvents }) {
        return { ...state, calendarEvents }
      },
      updateEventListing (state, { added, edited, deleted }) {
        const { calendarEvents } = state

        let newCalendarEvents = [
          ...calendarEvents,
        ]

        if (added) {
          newCalendarEvents = [
            ...calendarEvents,
            added,
          ]
        }

        if (edited) {
          const removeEdited = (event) => event.id !== edited.id
          newCalendarEvents = [
            ...newCalendarEvents.filter(removeEdited),
            edited,
          ]
        }

        if (deleted) {
          const removeDeleted = (event) => event.id === deleted
          newCalendarEvents = newCalendarEvents.filter(removeDeleted)
        }

        return { ...state, calendarEvents: newCalendarEvents }
      },
    },
  },
})
