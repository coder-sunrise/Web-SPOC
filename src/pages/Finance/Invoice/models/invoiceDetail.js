import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'
import { fakeInvoiceDetailData } from '../sampleData'

export default createFormViewModel({
  namespace: 'invoiceDetail',
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
      // queryDone (state, { payload }) {
      //   // TBD
      //   return {
      //     ...state,
      //   }
      // },
      fakeQueryDone (state, { payload }) {
        return {
          ...state,
          entity: {
            ...fakeInvoiceDetailData,
            invoiceDate: moment(fakeInvoiceDetailData.invoiceDate).format(
              'DD MMM YYYY',
            ),
          },
        }
      },
    },
  },
})
