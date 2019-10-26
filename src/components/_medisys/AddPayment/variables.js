import * as Yup from 'yup'
import { PAYMENT_MODE } from '@/utils/constants'

export const ValidationSchema = Yup.object().shape({
  cashReceived: Yup.number(),
  cashReturned: Yup.number(),
  totalAmtPaid: Yup.number(),
  collectableAmount: Yup.number(),
  outstandingBalance: Yup.number(),
  outstandingAfterPayment: Yup.number(),
  paymentList: Yup.array().when(
    [
      'cashReturned',
      'outstandingBalance',
      'totalAmtPaid',
    ],
    (cashReturned, totalAmtPaid, outstandingBalance, schema) => {
      // console.log('total', outstandingBalance - totalAmtPaid + cashReturned)
      if (totalAmtPaid - cashReturned > 0)
        return schema.of(
          Yup.object().shape({
            id: Yup.number(),
            paymentModeFK: Yup.number().required(),
            amt: Yup.number().when(
              'paymentModeFK',
              (paymentModeFK) =>
                paymentModeFK !== PAYMENT_MODE.CASH
                  ? Yup.number()
                      .min(0)
                      .max(
                        totalAmtPaid - cashReturned,
                        `Total amount paid cannot exceed $${totalAmtPaid}`,
                      )
                      .required()
                  : Yup.number().min(0).required(),
            ),
            creditCardTypeFK: Yup.string().when('paymentModeFK', {
              is: (val) => val === PAYMENT_MODE.CREDIT_CARD,
              then: Yup.string().required(),
            }),
            creditCardNo: Yup.string().when('paymentModeFK', {
              is: (val) => val === PAYMENT_MODE.CREDIT_CARD,
              then: Yup.string().required(),
            }),
            chequeNo: Yup.number().when('paymentModeFK', {
              is: (val) => val === PAYMENT_MODE.CHEQUE,
              then: Yup.number().required(),
            }),
            referrenceNo: Yup.string().when('paymentModeFK', {
              is: (val) =>
                val === PAYMENT_MODE.GIRO || val === PAYMENT_MODE.NETS,
              then: Yup.string().required(),
            }),
          }),
        )
      // if (outstandingAfterPayment === 0)
      return schema.of(
        Yup.object().shape({
          id: Yup.number(),
          paymentModeFK: Yup.number().required(),
          amt: Yup.number().min(0).required(),
          creditCardTypeFK: Yup.string().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.CREDIT_CARD,
            then: Yup.string().required(),
          }),
          creditCardNo: Yup.string().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.CREDIT_CARD,
            then: Yup.string().required(),
          }),
          chequeNo: Yup.number().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.CHEQUE,
            then: Yup.number().required(),
          }),
          referrenceNo: Yup.string().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.GIRO,
            then: Yup.string().required(),
          }),
        }),
      )
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

export const InitialValue = {
  [PAYMENT_MODE.CASH]: {
    amt: null,
    remarks: '',
  },
  [PAYMENT_MODE.NETS]: {
    amt: null,
    remarks: '',
    referrenceNo: null,
  },
  [PAYMENT_MODE.CREDIT_CARD]: {
    amt: null,
    remarks: '',
    creditCardTypeFK: undefined,
    creditCardNo: null,
  },
  [PAYMENT_MODE.CHEQUE]: {
    amt: null,
    chequeNo: null,
    remarks: '',
  },
  [PAYMENT_MODE.GIRO]: {
    amt: null,
    remarks: '',
    referrenceNo: null,
  },
}

export const getLargestID = (list) => {
  return list.reduce(
    (largestID, item) => (item.id > largestID ? item.id : largestID),
    0,
  )
}
