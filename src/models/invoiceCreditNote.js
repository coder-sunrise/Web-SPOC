import { createFormViewModel } from 'medisys-model'
import moment from 'moment'
import { roundTo } from '@/utils/utils'
import service from '@/services/invoicePayment'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'

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
      mapCreditNote(state, { payload }) {
        const {
          invoicePayerFK,
          invoiceDetail,
          invoicePaymentDetails,
          payerType,
        } = payload

        const {
          invoiceTotalAftGST,
          invoiceItem,
          gstValue,
          invoiceGSTAmt,
        } = invoiceDetail
        const sum = a => a.reduce((x, y) => x + y)

        const filterInvPayment = invoicePaymentDetails.find(
          x => x.id === invoicePayerFK,
        )
        const {
          payerTypeFK,
          payerDistributedAmt,
          outStanding,
          invoicePayerItem = [],
        } = filterInvPayment

        const creditNoteBalance =
          payerTypeFK === INVOICE_PAYER_TYPE.PATIENT
            ? payerDistributedAmt
            : outStanding
        const remainingItems = invoiceItem
          .filter(item =>
            invoicePayerItem.find(x => x.invoiceItemFK === item.id),
          )
          .map(item => {
            var payerItem = invoicePayerItem.find(
              x => x.invoiceItemFK === item.id,
            )
            const remainQuantity = roundTo(
              item.quantity - payerItem.creditNoteQuantity,
              1,
            )
            const remainAmount = roundTo(
              payerItem.claimAmount - payerItem.creditNoteAmount,
              2,
            )
            return {
              ...item,
              invoiceItemFK: item.id,
              itemTypeFK: item.invoiceItemTypeFK,
              totalAfterItemAdjustment: item.quantity * item.unitPrice,
              _totalAfterGST: roundTo(
                payerItem.claimAmount - payerItem.creditNoteAmount,
                2,
              ),
              _unitPriceAftGst:
                remainQuantity > 0 ? remainAmount / remainQuantity : 0,
              creditNoteQuantity: payerItem.creditNoteQuantity,
              remainQuantity: remainQuantity,
              currentQuantity: 0,
              creditNoteAmount: payerItem.creditNoteAmount,
              remainAmount: remainAmount,
              currentAmount: 0,
              itemType: payerItem.itemType,
              claimAmount: payerItem.claimAmount,
            }
          })

        return {
          ...InitialCreditNote,
          gstValue,
          payerType,
          invoiceGSTAmt,
          invoicePayerFK,
          invoiceTotal: invoiceTotalAftGST,
          creditNoteItem: remainingItems,
          creditNoteBalance: creditNoteBalance,
        }
      },
    },
  },
})
