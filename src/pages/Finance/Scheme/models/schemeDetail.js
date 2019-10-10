import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
const { upsert } = service
const { queryOne } = service
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

export default createFormViewModel({
  namespace: 'schemeDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        schemeTypeFK: 11,
        copayerTypeFK: 1,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        itemGroupMaxCapacityDtoRdoValue: 'all',
        itemGroupValueDtoRdoValue: 'all',
        patientMinCoPaymentAmountType: 'ExactAmount',
        overalCoPaymentValueType: 'ExactAmount',
        patientMinCoPaymentAmount: 0.0,
        // coverageMaxCap: 0.0,
        itemGroupMaxCapacityDto: {
          consumableMaxCapacity: {
            maxCapValue: 0.0,
          },
          medicationMaxCapacity: {
            maxCapValue: 0.0,
          },
          vaccinationMaxCapacity: {
            maxCapValue: 0.0,
          },
          serviceMaxCapacity: {
            maxCapValue: 0.0,
          },
          packageMaxCapacity: {
            maxCapValue: 0.0,
          },
        },
        // overalCoPaymentValue: 0.0,
        itemGroupValueDto: {
          consumableGroupValue: {
            itemGroupValue: 0.0,
            groupValueType: 'ExactAmount',
          },
          medicationGroupValue: {
            itemGroupValue: 0.0,
            groupValueType: 'ExactAmount',
          },
          vaccinationGroupValue: {
            itemGroupValue: 0.0,
            groupValueType: 'ExactAmount',
          },
          serviceGroupValue: {
            itemGroupValue: 0.0,
            groupValueType: 'ExactAmount',
          },
          packageGroupValue: {
            itemGroupValue: 0.0,
            groupValueType: 'ExactAmount',
          },
        },
        // consumableValueDto: [],
        // medicationValueDto: [],
        // vaccinationValueDto: [],
        // serviceValueDto: [],
        // packageValueDto: [],

        rows: [],
        // packageValueDto: [
        //   {
        //     id: 1,
        //     itemValueType: 'ExactAmount',
        //     itemValue: 788,
        //     unitPrice: 5,
        //     inventoryPackageFK: 1,
        //   },
        // ],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/finance/scheme/') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              currentTab: Number(query.t) || 0,
              currentId: query.id,
            },
          })
        }
      })
    },
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(upsert, payload)
      },
      *querySchemeDetails ({ payload }, { call, put }) {
        const response = yield call(queryOne, payload)
        yield put({
          type: 'schemeDetailsResult',
          payload: response.status == '200' ? response.data : {},
        })
      },
    },
    reducers: {
      schemeDetailsResult (state, { payload }) {
        const data = payload
        let itemRows = []
        InventoryTypes.forEach((x) => {
          itemRows = itemRows.concat(
            (data[x.prop] || []).map((y) => {
              const d = {
                uid: getUniqueId(),
                type: x.value,
                itemFK: y[x.itemFKName],
                ...y,
              }
              return x.convert ? x.convert(d) : d
            }),
          )
        })

        console.log('schemeDetailsResult', { ...data, rows: itemRows })

        return {
          ...state,
          entity: {
            ...data,
            effectiveDates: [
              data.effectiveStartDate,
              data.effectiveEndDate,
            ],
            itemGroupMaxCapacityDtoRdoValue: data.itemGroupMaxCapacityDto
              ? 'sub'
              : 'all',
            itemGroupValueDtoRdoValue: data.itemGroupValueDto ? 'sub' : 'all',
            rows: itemRows,
          },
        }
      },

      deleteRow (state, { payload }) {
        const { rows } = state.entity

        return {
          ...state,
          entity: {
            ...state.entity,
            rows: rows.filter((o) => o.uid !== payload.id),
          },
        }
      },
    },
  },
})
