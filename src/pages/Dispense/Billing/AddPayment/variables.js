import * as Yup from 'yup'

export const paymentTypes = {
  cash: 'Cash',
  nets: 'NETS',
  creditCard: 'Credit Card',
  cheque: 'Cheque',
  giro: 'Giro',
}

export const InitialValue = {
  [paymentTypes.cash]: {
    amount: null,
    remarks: '',
  },
  [paymentTypes.nets]: {
    amount: null,
    remarks: '',
  },
  [paymentTypes.creditCard]: {
    amount: null,
    remarks: '',
  },
  [paymentTypes.cheque]: {
    amount: null,
    remarks: '',
  },
  [paymentTypes.giro]: {
    amount: null,
    remarks: '',
  },
}

export const ValidationScheme = {
  [paymentTypes.cash]: Yup.object().shape({
    amount: Yup.number()
      .positive()
      .transform((value) => {
        if (Number.isNaN(value)) {
          return undefined
        }
        return value
      })
      .required('Amount is required'),
  }),
  [paymentTypes.nets]: Yup.object().shape({
    amount: Yup.number()
      .positive()
      .transform((value) => {
        if (Number.isNaN(value)) {
          return undefined
        }
        return value
      })
      .required('Amount is required'),
  }),
  [paymentTypes.creditCard]: Yup.object().shape({
    cardType: Yup.string().required('Card Type is required'),
    cardNo: Yup.string().required('Card No. is required'),
    amount: Yup.number()
      .positive()
      .transform((value) => {
        if (Number.isNaN(value)) {
          return undefined
        }
        return value
      })
      .required('Amount is required'),
  }),
  [paymentTypes.cheque]: Yup.object().shape({
    chequeNo: Yup.number().required('Cheque No. is required'),
    amount: Yup.number()
      .positive()
      .transform((value) => {
        if (Number.isNaN(value)) {
          return undefined
        }
        return value
      })
      .required('Amount is required'),
  }),
  [paymentTypes.giro]: Yup.object().shape({
    referrenceNo: Yup.number().required('Referrence No. is required'),
    amount: Yup.number()
      .positive()
      .transform((value) => {
        if (Number.isNaN(value)) {
          return undefined
        }
        return value
      })
      .required('Amount is required'),
  }),
}

export const mapPaymentListToValues = (acc, payment) => ({
  ...acc,
  [payment.id]: { ...payment },
})

export const getLargestID = (list) => {
  return list.reduce(
    (largestID, item) => (item.id > largestID ? item.id : largestID),
    0,
  )
}
