import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { getUniqueGUID } from '@/utils/cdrss'

const { upsert } = service

export default createFormViewModel({
  namespace: 'vaccinationDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentId: '',
      default: {
        effectiveDates: [
          moment(),
          moment('2099-12-31'),
        ],
        VaccinationGroup: 'MedisaveVaccination',
      },
      // entity: {},
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
              // entity: {},
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
        console.log('data', data)
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
