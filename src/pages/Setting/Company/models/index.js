import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

import { getCodes } from '@/utils/codes'

let companyTypes = []

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
        // contact:{
        //   mobileContactNumber:{
        //     number:0
        //   }
        // }
        // arrrr:[{

        // }]
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.toLowerCase().indexOf('/setting/company/') === 0) {
          getCodes('ctCompanyType').then((codetableData) => {
            companyTypes = codetableData
            console.log(
              companyTypes,
              Number(pathname.toLowerCase().replace('/setting/company/', '')),
            )
            dispatch({
              type: 'updateState',
              payload: {
                companyType: companyTypes.find(
                  (o) =>
                    o.id ===
                    Number(
                      pathname.toLowerCase().replace('/setting/company/', ''),
                    ),
                ),
              },
            })
          })
        }
        console.log(loct)
      })
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
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
