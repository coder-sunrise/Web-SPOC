import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { queryMedicPrecaution } from '../services'
import { getUniqueGUID } from '@/utils/cdrss'

const { upsert } = service

export default createFormViewModel({
  namespace: 'medicationDetail',
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
      },
    },
    subscriptions: ({ dispatch, history, searchField }) => {
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
              entity: undefined,
            },
          })
        }
      })
      dispatch({
        type: 'medicPrecautionList',
        payload: {
          pagesize: 99999,
        },
      })
    },
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(upsert, payload)
      },
      *medicPrecautionList ({ payload }, { call, put }) {
        const response = yield call(queryMedicPrecaution, payload)
        yield put({
          type: 'getMedicPrecautionList',
          payload: response.status == '200' ? response.data : {},
        })
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

      getMedicPrecautionList (state, { payload }) {
        const { data } = payload
        // console.log('payload', payload)
        return {
          ...state,
          ctmedicationprecaution: data.map((x) => {
            return {
              medicationPrecautionFK: x.id,
              value: x.name,
            }
          }),
        }
      },
    },
  },
})
