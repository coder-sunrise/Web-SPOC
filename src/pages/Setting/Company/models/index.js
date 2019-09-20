import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { getCodes } from '@/utils/codes'
import { notification } from '@/components'

let companyTypes = [
  { id: 1, name: 'copayer' },
  { id: 2, name: 'supplier' },
]

export default createListViewModel({
  namespace: 'settingCompany',
  config: {},
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().utc().set({ hour: 0, minute: 0, second: 0 }),
          moment('2099-12-31').utc().set({ hour: 23, minute: 59, second: 59 }),
        ],
        adminCharge: 0,
        contact: {
          contactAddress: [
            {
              street: '',
              postcode: '',
              countryFK: undefined,
            },
          ],
          mobileContactNumber: {
            number: '',
          },
          officeContactNumber: {
            number: '',
          },
          faxContactNumber: {
            number: '',
          },
          contactWebsite: {
            website: '',
          },
          contactEmailAddress: {
            emailAddress: undefined,
          },
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.toLowerCase().indexOf('/setting/company/') === 0) {
          const companyType = companyTypes.find(
            (o) =>
              o.id ===
              Number(pathname.toLowerCase().replace('/setting/company/', '')),
          )
          dispatch({
            type: 'updateState',
            payload: {
              companyType,
              filter: {
                companyTypeFK: companyType.id,
              },
            },
          })
        }

        if (pathname === '/finance/copayer') {
          const companyType = companyTypes.find((o) => o.id === 1)
          dispatch({
            type: 'updateState',
            payload: {
              companyType,
              filter: {
                companyTypeFK: companyType.id,
              },
            },
          })
        }
      })
    },
    effects: {
      *queryCopayer ({ payload }, { call, put }) {
        const result = yield call(service.queryListCop)
        yield put({ type: 'getCopSupList', payload: result })
      },

      *querySupplier ({ payload }, { call, put }) {
        const result = yield call(service.queryListSup)
        yield put({ type: 'getCopSupList', payload: result })
      },

      *upsertCopayer ({ payload }, { call, put }) {
        const r = yield call(service.upsertCop, payload)
        if (r.id) {
          notification.success({ message: 'Created' })
          return true
        }
        if (r) {
          notification.success({ message: 'Saved' })
          return true
        }
        return r
      },

      *upsertSupplier ({ payload }, { call, put }) {
        const r = yield call(service.upsertSup, payload)
        if (r.id) {
          notification.success({ message: 'Created' })
          return true
        }
        if (r) {
          notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },

    reducers: {
      getCopSupList (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
            }
          }),
        }
      },
    },
  },
})
