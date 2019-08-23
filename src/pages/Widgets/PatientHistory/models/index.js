import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'patientHistory',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        console.log(2)

        if (pathname.indexOf('/reception/queue/patientdashboard') === 0) {
          console.log(
            '1',
            pathname,
            query,
            pathname.indexOf('/reception/queue/patientdashboard') === 0,
          )
          dispatch({
            type: 'updateState',
            payload: {
              patientId: Number(query.pid) || 0,
            },
          })
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     patientProfileFK: Number(query.pid),
          //     sorting: [
          //       {
          //         columnName: 'VisitDate',
          //         direction: 'desc',
          //       },
          //     ],
          //   },
          // })
        }
      })
    },
    effects: {},
    reducers: {},
  },
})
