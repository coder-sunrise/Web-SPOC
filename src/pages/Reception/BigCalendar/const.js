const _modelKey = 'calendar/'

export const CalendarActions = {
  UpdateEvent: `${_modelKey}updateEventListing`,
  MoveEvent: `${_modelKey}moveEvent`,
  AddEventSeries: `${_modelKey}addEventSeries`,
  UpdateEventSeriesByID: `${_modelKey}updateEventSeriesBySeriesID`,
  DeleteEventSeriesByID: `${_modelKey}deleteEventSeriesBySeriesID`,
}

export const _updateEventKey = `${_modelKey}updateEventListing`

export default _modelKey
