import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/invoicePayment'

const dummyData = {}

export default createFormViewModel({
  namespace: 'invoiceCreditNote',
  config: {},
  param: {
    service,
    state: {
      default: {
        list: [],
      },
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
      mapCreditNote (state, { payload }) {
        console.log('mapCreditNote', payload)
        const { creditNote, invoicePayerFK } = payload
        let newCreditNote = creditNote.filter(
          (x) => x.invoicePayerFK === invoicePayerFK,
        )[0]

        return {
          ...state,
          entity: {
            ...newCreditNote,
          },
        }
      },
    },
  },
})
