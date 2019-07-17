const _modelKey = 'calendar/'

export const CalendarActions = {
  UpdateEvent: `${_modelKey}updateEventListing`,
  MoveEvent: `${_modelKey}moveEvent`,
  AddEventSeries: `${_modelKey}addEventSeries`,
  UpdateEventByEventID: `${_modelKey}updateEventSeriesByEventID`,
  DeleteEventByEventID: `${_modelKey}deleteEventSeriesByEventID`,
}

export const SeriesAlert = {
  0: 'single',
  1: 'series',
}

export const _updateEventKey = `${_modelKey}updateEventListing`

export default _modelKey
