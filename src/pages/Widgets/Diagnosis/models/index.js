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
        // corDiagnosis: [
        //   {
        //     uid: getUniqueGUID(),
        //     onsetDate: moment(),
        //     isPersist: false,
        //     remarks: '',
        //   },
        // ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *removeWidget ({ payload }, { call, put, select }) {
        console.log(window)
        yield put({
          type: 'updateState',
          payload: {
            entity: false,
          },
        })
        // yield put({
        //   type: 'consuupdateState',
        //   payload: {
        //     entity: false,
        //   },
        // })
      },
    },
    reducers: {},
  },
})
