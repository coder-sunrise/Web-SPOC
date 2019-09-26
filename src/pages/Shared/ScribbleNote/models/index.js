import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'scriblenotes',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      entity: '',
      selectedIndex: '',
      ClinicianNote: {
        notesScribbleArray: [],
      },
      ChiefComplaints: {
        chiefComplaintsScribbleArray: [],
      },
      Plan: {
        planScribbleArray: [],
      },
      default: {
        scribleNotes: 'Test notes',
      },
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
            }
          }),
        }
      },
    },
  },
})
