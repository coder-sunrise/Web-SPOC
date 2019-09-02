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
      default: {
        schemeTypeFK: 11,

        effectiveDates: [
          moment(),
          moment('2099-12-31'),
        ],
        itemGroupMaxCapacityDtoRdoValue: 'all',
        itemGroupValueDtoRdoValue: 'all',
        patientMinCoPaymentAmountType: 'ExactAmount',
        overalCoPaymentValueType: 'ExactAmount',
        // itemGroupMaxCapacityDto: {
        //   medicationMaxCapacity: {},
        //   vaccinationMaxCapacity: {},
        //   consumableMaxCapacity: {},
        //   serviceMaxCapacity: {},
        //   packageMaxCapacity: {},
        // },
        // itemGroupValueDto: {
        //   medicationGroupValue: {
        //     // groupValueType: 'ExactAmount',
        //   },
        //   vaccinationGroupValue: {
        //     // groupValueType: 'ExactAmount',
        //   },
        //   consumableGroupValue: {
        //     // groupValueType: 'ExactAmount',
        //   },
        //   serviceGroupValue: {
        //     // groupValueType: 'ExactAmount',
        //   },
        //   packageGroupValue: {
        //     // groupValueType: 'ExactAmount',
        //   },
        // },

        packageValueDto: [
          {
            id: 1,
            itemValueType: 'ExactAmount',
            unitPrice: 5,
            inventoryPackageFK: 1,
          },
        ],
        companyCoPaymentSchemeDto: [
          { coPaymentSchemeFk: 1 },
        ],
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
    },
    reducers: {},
  },
})
