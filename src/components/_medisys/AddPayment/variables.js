import * as Yup from 'yup'
import { PAYMENT_MODE } from '@/utils/constants'
import { roundTo } from '@/utils/utils'

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
    is: (val) => val,
    then: Yup.string().required(requiredMsg),
  }),
  paymentReceivedBizSessionFK: Yup.string().when('showPaymentDate', {
    is: (val) => val,
    then: Yup.string().required(requiredMsg),
  }),
  paymentList: Yup.array().when(
    [
      'finalPayable',
      'totalAmtPaid',
      'isGroupPayment',
      'invoiceOSAmount'
    ],
    (finalPayable, totalAmtPaid, isGroupPayment, invoiceOSAmount, schema) => {
      let min = 0.01
      let max = finalPayable
      let minMsg = 'Amount must be greater than $0.00'
      const isFullPayment = isGroupPayment && totalAmtPaid < finalPayable
      if(isFullPayment) {
        min = finalPayable
        minMsg = 'Outstanding must be paid full'
      }
      return schema.of(
        Yup.object().shape({
          id: Yup.number(),
          paymentModeFK: Yup.number().required(),
          amt: Yup.number().when(['isDeposit'], (isDeposit, schema) => {
            let minAmt = min
            let maxAmt = max
            let maxMsg = 'Total amount paid cannot exceed'
            if(isGroupPayment && isDeposit){
               minAmt = invoiceOSAmount
               maxAmt = invoiceOSAmount
               maxMsg = 'Amount paid cannot exceed'
            }
            if (totalAmtPaid > finalPayable){
              return schema
                .min(minAmt, minMsg)
                .max(0.01, `${maxMsg} $${roundTo(maxAmt)}`)
                .required()
            }
            return schema
              .min(minAmt, minMsg)
              .max(maxAmt, `${maxMsg} $${roundTo(maxAmt)}`)
              .required()
          }),
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
    [
      'paymentList',
      '_cashAfterRounding',
    ],
    (paymentList, _cashAfterRounding) => {
      const cashPayment = paymentList.filter(
        (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
      )

      if (cashPayment.length > 0) {
        // const minAmount = cashPayment[0].amt
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

// export const InitialValue = {
//   [PAYMENT_MODE.CASH]: {
//     amt: null,
//     remarks: '',
//   },
//   [PAYMENT_MODE.NETS]: {
//     amt: null,
//     remarks: '',
//     netsPayment: {
//       refNo: null,
//     },
//   },
//   [PAYMENT_MODE.CREDIT_CARD]: {
//     amt: null,
//     remarks: '',
//     creditCardPayment: {
//       creditCardTypeFK: undefined,
//       creditCardNo: undefined,
//     },
//   },
//   [PAYMENT_MODE.CHEQUE]: {
//     amt: null,
//     remarks: '',
//     chequePayment: { chequeNo: null },
//   },
//   [PAYMENT_MODE.GIRO]: {
//     amt: null,
//     remarks: '',
//     giroPayment: {
//       refNo: null,
//     },
//   },
// }

export const getLargestID = (list) => {
  return list.reduce(
    (largestID, item) => (item.id > largestID ? item.id : largestID),
    0,
  )
}
