import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
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
        effectiveDates: [
          moment(),
          moment('2099-12-31'),
        ],
        itemGroupMaxCapacityDtoRdoValue: 'all',
        itemGroupValueDtoRdoValue: 'all',
        patientMinCoPaymentAmountType: '$',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct) => {
        const { pathname, search, query = {} } = loct
        // console.log(pathname)
        if (pathname.indexOf('/finance/scheme/') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              currentTab: Number(query.t) || 0,
            },
          })
        }
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
