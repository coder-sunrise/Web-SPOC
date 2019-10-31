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
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        VaccinationGroup: 'MedisaveVaccination',
        isActive: true,
        lastCostPriceBefBonus: 0,
        lastCostPriceAftBonus: 0,
        averageCostPrice: 0,
        suggestSellingPrice: 0,
        sellingPrice: 0,
        maxDiscount: 0,
        markupMargin: 0,
        vaccinationStock: [],
        isChasAcuteClaimable: true,
        isChasChronicClaimable: true,
        prescriptionToDispenseConversion: 1.0,
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
