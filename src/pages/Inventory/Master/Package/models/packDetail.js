import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { getUniqueGUID } from '@/utils/cdrss'
import { queryServiceCenter } from '../services'
const { upsert } = service

export default createFormViewModel({
  namespace: 'packDetail',
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
        isOrderable: true,
        servicePackageItem: [],
        consumablePackageItem: [],
        medicationPackageItem: [],
        vaccinationPackageItem: [],
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
              entity: undefined,
            },
          })
        }
      })
      dispatch({
        type: 'serviceCenterList',
        payload: {
          pagesize: 99999,
        },
      })
    },
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(upsert, payload)
      },

      *serviceCenterList ({ payload }, { call, put }) {
        const response = yield call(queryServiceCenter, payload)
        yield put({
          type: 'getServiceCenterList',
          payload: response.status == '200' ? response.data : {},
        })
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

      getServiceCenterList (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          ctServiceCenter: data.map((x) => {
            return {
              value: x.id,
              name: x.name,
            }
          }),
        }
      },
    },
  },
})
