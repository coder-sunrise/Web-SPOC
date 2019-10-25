import * as Yup from 'yup'
import { PAYMENT_MODE } from '@/utils/constants'

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
