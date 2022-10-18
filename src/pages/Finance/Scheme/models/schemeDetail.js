import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import { InventoryTypes } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
import service from '../services'

const { upsert } = service
const { queryOne } = service

export default createFormViewModel({
  namespace: 'schemeDetail',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        description: '',
        isUserMaintainable: true,
        schemeTypeFK: 15, // default to CORPORATE
        copayerTypeFK: 1,
        schemeCategoryFK: 5, // default to CORPORATE
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        itemGroupMaxCapacityDtoRdoValue: 'all',
        itemGroupValueDtoRdoValue: 'all',
        patientMinCoPaymentAmountType: 'ExactAmount',
        overalCoPaymentValueType: 'Percentage',
        patientMinCoPaymentAmount: 0,
        // coverageMaxCap: 0,
        itemGroupMaxCapacityDto: {},
        overalCoPaymentValue: 100,
        itemGroupValueDto: {},
        rows: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(loct => {
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
      *submit({ payload }, { call }) {
        return yield call(upsert, payload)
      },
      *querySchemeDetails({ payload }, { call, put }) {
        const response = yield call(queryOne, payload)
        yield put({
          type: 'schemeDetailsResult',
          payload: response.status === '200' ? response.data : {},
        })
      },
    },
    reducers: {
      schemeDetailsResult(state, { payload }) {
        const data = payload
        let itemRows = []
        InventoryTypes.forEach(x => {
          itemRows = itemRows.concat(
            (data[x.prop] || []).map(y => {
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
        return {
          ...state,
          entity: {
            ...data,
            effectiveDates: [data.effectiveStartDate, data.effectiveEndDate],
            itemGroupMaxCapacityDtoRdoValue: !data.coverageMaxCap
              ? 'sub'
              : 'all',
            itemGroupValueDtoRdoValue: !data.itemGroupValueDto ? 'all' : 'sub',
            rows: itemRows,
          },
        }
      },

      deleteRow(state, { payload }) {
        const { rows } = state.entity

        return {
          ...state,
          entity: {
            ...state.entity,
            rows: rows.filter(o => o.uid !== payload.id),
          },
        }
      },
    },
  },
})
