import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import { getUniqueGUID } from 'utils'
import moment from 'moment'

export default createFormViewModel({
  namespace: 'patientVitalSign',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        patientVitalSign: [
          {
            temperatureC: 37,
            bpSysMMHG: 90,
            bpDiaMMHG: 60,
            pulseRateBPM: 70,
            weightKG: 80,
            heightCM: 180,
            bmi: 24.69,
          },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {},
  },
})
