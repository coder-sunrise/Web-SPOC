import * as Yup from 'yup'
import { PAYMENT_MODE } from '@/utils/constants'
import { roundToTwoDecimals } from '@/utils/utils'

export const ValidationSchema = Yup.object().shape({
  cashReceived: Yup.number(),
  cashReturned: Yup.number(),
  totalAmtPaid: Yup.number(),
  finalPayable: Yup.number(),
  collectableAmount: Yup.number(),
  outstandingBalance: Yup.number(),
  outstandingAfterPayment: Yup.number(),
  paymentList: Yup.array().when(
    [
      'finalPayable',
      'collectableAmount',
      'outstandingAfterPayment',
      'totalAmtPaid',
    ],
    (
      finalPayable,
      collectableAmount,
      outstandingAfterPayment,
      totalAmtPaid,
      schema,
    ) => {
      if (totalAmtPaid > finalPayable)
        return schema.of(
          Yup.object().shape({
            id: Yup.number(),
            paymentModeFK: Yup.number().required(),
            amt: Yup.number()
              .min(0, 'Amount must be greater than 0')
              .max(
                0.01,
                `Total amount paid cannot exceed $${roundToTwoDecimals(
                  finalPayable,
                )}`,
              )
              .required(),
            creditCardPayment: Yup.object().shape({
              creditCardTypeFK: Yup.string().required(),
              creditCardNo: Yup.number().required(),
            }),
            chequePayment: Yup.object().shape({
              chequeNo: Yup.string().required(),
            }),
            netsPayment: Yup.object().shape({
              refNo: Yup.string().required(),
            }),
            giroPayment: Yup.object().shape({
              refNo: Yup.string().required(),
            }),
          }),
        )

      return schema.of(
        Yup.object().shape({
          id: Yup.number(),
          paymentModeFK: Yup.number().required(),
          amt: Yup.number()
            .min(0)
            .max(
              finalPayable,
              `Total amount paid cannot exceed $${finalPayable}`,
            )
            .required(),
          creditCardPayment: Yup.object().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.CREDIT_CARD,
            then: Yup.object().shape({
              creditCardTypeFK: Yup.string().required(),
              creditCardNo: Yup.number().required(),
            }),
          }),
          chequePayment: Yup.object().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.CHEQUE,
            then: Yup.object().shape({
              chequeNo: Yup.string().required(),
            }),
          }),
          netsPayment: Yup.object().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.NETS,
            then: Yup.object().shape({
              refNo: Yup.string().required(),
            }),
          }),
          giroPayment: Yup.object().when('paymentModeFK', {
            is: (val) => val === PAYMENT_MODE.GIRO,
            then: Yup.object().shape({
              refNo: Yup.string().required(),
            }),
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
    netsPayment: {
      refNo: null,
    },
  },
  [PAYMENT_MODE.CREDIT_CARD]: {
    amt: null,
    remarks: '',
    creditCardPayment: {
      creditCardTypeFK: undefined,
      creditCardNo: null,
    },
  },
  [PAYMENT_MODE.CHEQUE]: {
    amt: null,
    remarks: '',
    chequePayment: { chequeNo: null },
  },
  [PAYMENT_MODE.GIRO]: {
    amt: null,
    remarks: '',
    giroPayment: {
      refNo: null,
    },
  },
}

export const getLargestID = (list) => {
  return list.reduce(
    (largestID, item) => (item.id > largestID ? item.id : largestID),
    0,
  )
}
