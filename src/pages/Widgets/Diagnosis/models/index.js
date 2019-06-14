import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import { getUniqueGUID } from 'utils'
import moment from 'moment'

export default createFormViewModel({
  namespace: 'diagnosis',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        diagnosises: [
          {
            id: getUniqueGUID(),
            diagnosis: 'Asthma',
            complication: 'Complication',
            orderDate: moment('2015-01-30'),
            isPersist: false,
            remarks: '',
          },
        ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      // *add ({ payload }, { call, put, select }) {
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       addNew: true,
      //     },
      //   })
      // },
    },
    reducers: {},
  },
})
