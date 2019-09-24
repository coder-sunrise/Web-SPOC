import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services/invoicePayment'

const InitialCreditNote = {
  invoicePayerFK: 0,
  generatedDate: moment(),
  invoiceTotal: 0,
  isStockIn: false,
  creditNoteItem: [],
  totalAftGST: 0,
  creditNoteBalance: 0,
  finalCredit: 0,
}

export default createFormViewModel({
  namespace: 'invoiceCreditNote',
  config: {},
  param: {
    service,
    state: {},
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
        const {
          invoiceTotalAftGST,
          totalPayment: creditNoteBalance,
          invoiceItem,
        } = invoiceDetail
        const sum = (a) => a.reduce((x, y) => x + y)
        const filteredCreditNote = creditNote.filter(
          (x) => x.invoicePayerFK === invoicePayerFK && !x.isCancelled,
        )

        const pastCreditNoteItems = filteredCreditNote
          .reduce((filtered, item) => {
            return [
              ...filtered,
              ...item.creditNoteItem,
            ]
          }, [])
          .reduce(
            (itemSubtotal, item) =>
              itemSubtotal[item.itemName] !== undefined
                ? {
                    ...itemSubtotal,
                    [item.itemName]:
                      itemSubtotal[item.itemName] + item.quantity,
                  }
                : { [item.itemName]: item.quantity },
            {},
          )

        const remainingItems = invoiceItem.map((item) => {
          const pastItemQuantity = pastCreditNoteItems[item.itemName]
          if (pastItemQuantity)
            return { ...item, quantity: item.quantity - pastItemQuantity }
          return { ...item }
        })

        const totalCreditNote = sum(
          filteredCreditNote.map((x) => Number(x.totalAftGST)),
        )

        return {
          ...InitialCreditNote,
          invoicePayerFK,
          invoiceTotal: invoiceTotalAftGST,
          creditNoteItem: remainingItems,
          creditNoteBalance: creditNoteBalance - totalCreditNote,
        }
      },
    },
  },
})
