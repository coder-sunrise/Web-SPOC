import * as Yup from 'yup'
import { PAYMENT_MODE } from '@/utils/constants'
import { roundTo } from '@/utils/utils'
import { IsoRounded } from '@material-ui/icons'

const requiredMsg = 'This is a required field'
export const ValidationSchema = Yup.object().shape({
  cashReturned: Yup.number(),
  totalAmtPaid: Yup.number(),
  finalPayable: Yup.number(),
  collectableAmount: Yup.number(),
  _cashAfterRounding: Yup.number(),
  outstandingBalance: Yup.number(),
  outstandingAfterPayment: Yup.number(),
  showPaymentDate: Yup.boolean(),
  paymentReceivedDate: Yup.string().when('showPaymentDate', {
    is: val => val,
    then: Yup.string().required(requiredMsg),
  }),
  paymentReceivedBizSessionFK: Yup.string().when('showPaymentDate', {
    is: val => val,
    then: Yup.string().required(requiredMsg),
  }),
  paymentList: Yup.array().when(
    ['totalAmtPaid', 'invoiceOSAmount', 'currentPayable'],
    (totalAmtPaid, invoiceOSAmount, currentPayable, schema) => {
      const min = 0.01
      const minMsg = 'Amount must be greater than $0.00'
      const max = currentPayable
      const maxMsg = 'paid cannot exceed'

      const isOverpaid = totalAmtPaid > currentPayable
      const isOutstanding = totalAmtPaid < currentPayable

      return schema.of(
        Yup.object().shape({
          id: Yup.number(),
          paymentModeFK: Yup.number().required(),
          amt: Yup.number()
            .min(min, minMsg)
            .max(
              isOverpaid ? min : max,
              `Total amount ${maxMsg} $${roundTo(max)}`,
            ),
          creditCardPayment: Yup.object().when('paymentModeFK', {
            is: val => val === PAYMENT_MODE.CREDIT_CARD,
            then: Yup.object().shape({
              creditCardTypeFK: Yup.string().required(),
            }),
          }),
        }),
      )
    },
  ),
  cashReceived: Yup.number().when(
    ['paymentList', '_cashAfterRounding'],
    (paymentList, _cashAfterRounding) => {
      const cashPayment = paymentList.filter(
        payment => payment.paymentModeFK === PAYMENT_MODE.CASH,
      )

      if (cashPayment.length > 0) {
        return Yup.number()
          .min(
            _cashAfterRounding,
            `Cash Received must be at least $${_cashAfterRounding.toFixed(2)}`,
          )
          .required(requiredMsg)
      }

      return Yup.number()
    },
  ),
})

export const paymentTypes = {
  cash: 'Cash',
  nets: 'NETS',
  creditCard: 'Credit Card',
  cheque: 'Cheque',
  giro: 'Giro',
}
export const getLargestID = list => {
  return list.reduce(
    (largestID, item) => (item.id > largestID ? item.id : largestID),
    0,
  )
}
