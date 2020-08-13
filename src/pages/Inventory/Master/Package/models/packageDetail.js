import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { queryServiceCenter } from '../services'

const { upsert } = service

export default createFormViewModel({
  namespace: 'packageDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentId: '',
      default: {
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        isUserMaintainable: true,
        // serviceOrderSetItem: [],
        // consumableOrderSetItem: [],
        // medicationOrderSetItem: [],
        // vaccinationOrderSetItem: [],
        isActive: true,
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
        }
      })
    },
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(upsert, payload)
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: {
            ...data,
            effectiveDates: [
              data.effectiveStartDate,
              data.effectiveEndDate,
            ],
          },
        }
      },
    },
  },
})
