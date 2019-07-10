import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const { upsert } = service

export default createFormViewModel({
  namespace: 'schemeDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentId: '',
      entity: [],
      default: {
        schemeType: 'Corporate',
        schemeCategory: 'Corporate',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct) => {
        const { query = {} } = loct
        if (query.uid) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: query.uid,
            },
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: '',
              entity: '',
            },
          })
        }
      })
    },
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(upsert, payload)
      },
    },
    reducers: {},
  },
})
