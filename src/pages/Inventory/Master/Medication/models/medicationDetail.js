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
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        isActive: true,
        lastCostPriceBefBonus: 0,
        lastCostPriceAftBonus: 0,
        averageCostPrice: 0,
        markupMargin: 0,
        suggestSellingPrice: 0,
        sellingPrice: 0,
        maxDiscount: 0,
        medicationStock: [],
        isChasAcuteClaimable: true,
        isChasChronicClaimable: true,
        prescriptionToDispenseConversion: 1.0,
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct) => {
        const { pathname, query = {} } = loct
        if (query.uid) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: query.uid,
            },
          })
        }
        if (
          pathname === '/inventory/master/editmedication' ||
          pathname === '/inventory/master/medication'
        ) {
          dispatch({
            type: 'medicPrecautionList',
            payload: {
              isActive: true,
              pagesize: 999,
            },
          })
        }
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
          payload: response.status === '200' ? response.data : {},
        })
      },
    },
    reducers: {
      getMedicPrecautionList (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          ctmedicationprecaution: data.map((x) => {
            return {
              medicationPrecautionFK: x.id,
              value: x.displayValue,
            }
          }),
        }
      },

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
