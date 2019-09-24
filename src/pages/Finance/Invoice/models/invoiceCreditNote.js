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
      invoicePayerFK: 0,
      generatedDate: moment(),
      invoiceTotal: 0,
      isStockIn: false,
      creditNoteItem: [],
      totalAftGST: 0,
      creditNoteBalance: 0,
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
        const { invoicePayerFK, invoiceDetail, creditNote } = payload
        let filterCreditNote = creditNote.filter(
          (x) =>
            x.invoicePayerFK === invoicePayerFK &&
            !x.isDeleted &&
            !x.isCancelled,
        )
        console.log('mapCreditNote', filterCreditNote)


        return {
          ...state,
          invoiceTotal: invoiceDetail.invoiceTotalAftGST,
          creditNoteItem: filterCreditNote.creditNoteItem,
        }
      },
    },
  },
})
