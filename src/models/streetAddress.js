import { createFormViewModel } from 'medisys-model'
import * as service from '../services/streetAddress'
import { notification } from '@/components'

export default createFormViewModel({
  namespace: 'streetAddress',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        postalCode: '',
        blkHseNo: '',
        street: '',
        building: '',
        houseType: '',
      },
    },

    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *fetchAddress ({ payload }, { call, put }) {
        const response = yield call(service.queryList, payload)
        if (response.data.data.length === 0)
          return (
            notification.warn({ message: 'Address Not Found' }),
            {
              data: [
                // {
                //   postalCode: '',
                //   blkHseNo: '',
                //   street: '',
                //   building: '',
                //   houseType: '',
                // },
              ],
            }
          )

        return response.data
      },
    },
    reducers: {},
  },
})
