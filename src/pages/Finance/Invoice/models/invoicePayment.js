import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/invoicePayment'
import { PayerType } from '../Details/PaymentDetails/variables'

const dummyData = {}

export default createListViewModel({
  namespace: 'invoicePayment',
  config: {},
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
        if (pathname.indexOf('/finance/invoice/details') === 0) {
          dispatch({
            type: 'updateState',
            payload: {
              currentId: Number(query.id),
            },
          })
        }
      })
    },
    effects: {},
    reducers: {
      fakeQueryDone (state, { payload }) {
        console.log('fakeQueryDone', dummyData)
        return {
          ...state,
          entity: {
            ...dummyData,
          },
        }
      },
    },
  },
})
