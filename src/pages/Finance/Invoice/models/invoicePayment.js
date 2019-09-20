import { createFormViewModel } from 'medisys-model'
import * as service from '../services/invoicePayment'
import moment from 'moment'
import { InvoicePayerType } from '@/utils/codes'
import { CompareSharp } from '@material-ui/icons'

const paymentMode = [
  { type: 'Cash', objName: 'depositPayment', paymentModeFK: 1 },
  { type: 'NETS', objName: 'netsPayment', paymentModeFK: 2 },
  {
    type: 'Credit Card',
    objName: 'creditCardPayment',
    paymentModeFK: 3,
  },
  { type: 'Cheque', objName: 'chequePayment', paymentModeFK: 4 },
  { type: 'Giro', objName: 'giroPayment', paymentModeFK: 5 },
]

const dummyData = {
  patientProfileFK: 1,
  invoiceFK: 1,
  payerTypeFK: 0,
  companyFK: 0,
  schemePayerFK: 0,
  coPaymentSchemeFK: 0,
  sequence: 0,
  payerDistributedAmt: 0,
  isCancelled: false,
  cancelDate: '2019-09-19T01:29:50.836Z',
  cancelReason: 'string',
  cancelByUserFK: 0,
  patientName: 'string',
  companyName: 'string',
  payerType: 'string',
  invoicePayment: [
    {
      invoicePayerFK: 1,
      receiptNo: 'RC/000001',
      totalAmtPaid: 900,
      cashReceived: 0,
      cashReturned: 0,
      paymentReceivedDate: '2019-09-19T01:29:50.836Z',
      paymentReceivedByUserFK: 0,
      paymentReceivedBizSessionFK: 0,
      paymentCreatedBizSessionFK: 0,
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      invoicePaymentMode: [
        {
          paymentFK: 0,
          paymentModeFK: 0,
          paymentMode: 'string',
          amt: 0,
          cashRounding: 0,
          sequence: 0,
          remark: 'string',
          giroPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          chequePayment: [
            {
              paymentModeFK: 0,
              chequeNo: 'string',
              collectionDate: '2019-09-19T01:29:50.836Z',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          creditCardPayment: [
            {
              paymentModeFK: 0,
              creditCardNo: 'string',
              creditCardTypeFK: 0,
              creditCardType: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          netsPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          depositPayment: [
            {
              paymentModeFK: 0,
              depositAccountFK: 0,
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          id: 0,
          isDeleted: false,
          concurrencyToken: 0,
        },
      ],
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
    {
      invoicePayerFK: 1,
      receiptNo: 'RC/000002',
      totalAmtPaid: 400,
      cashReceived: 0,
      cashReturned: 0,
      paymentReceivedDate: '2019-09-19T01:29:50.836Z',
      paymentReceivedByUserFK: 0,
      paymentReceivedBizSessionFK: 0,
      paymentCreatedBizSessionFK: 0,
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      invoicePaymentMode: [
        {
          paymentFK: 0,
          paymentModeFK: 0,
          paymentMode: 'string',
          amt: 0,
          cashRounding: 0,
          sequence: 0,
          remark: 'string',
          giroPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          chequePayment: [
            {
              paymentModeFK: 0,
              chequeNo: 'string',
              collectionDate: '2019-09-19T01:29:50.836Z',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          creditCardPayment: [
            {
              paymentModeFK: 0,
              creditCardNo: 'string',
              creditCardTypeFK: 0,
              creditCardType: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          netsPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          depositPayment: [
            {
              paymentModeFK: 0,
              depositAccountFK: 0,
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          id: 0,
          isDeleted: false,
          concurrencyToken: 0,
        },
      ],
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
    {
      invoicePayerFK: 2,
      receiptNo: 'RC/000002',
      totalAmtPaid: 700,
      cashReceived: 0,
      cashReturned: 0,
      paymentReceivedDate: '2019-09-19T01:29:50.836Z',
      paymentReceivedByUserFK: 0,
      paymentReceivedBizSessionFK: 0,
      paymentCreatedBizSessionFK: 0,
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      invoicePaymentMode: [
        {
          paymentFK: 0,
          paymentModeFK: 0,
          paymentMode: 'string',
          amt: 0,
          cashRounding: 0,
          sequence: 0,
          remark: 'string',
          giroPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          chequePayment: [
            {
              paymentModeFK: 0,
              chequeNo: 'string',
              collectionDate: '2019-09-19T01:29:50.836Z',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          creditCardPayment: [
            {
              paymentModeFK: 0,
              creditCardNo: 'string',
              creditCardTypeFK: 0,
              creditCardType: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          netsPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          depositPayment: [
            {
              paymentModeFK: 0,
              depositAccountFK: 0,
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          id: 0,
          isDeleted: false,
          concurrencyToken: 0,
        },
      ],
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
    {
      invoicePayerFK: 3,
      receiptNo: 'RC/000003',
      totalAmtPaid: 800,
      cashReceived: 0,
      cashReturned: 0,
      paymentReceivedDate: '2019-09-19T01:29:50.836Z',
      paymentReceivedByUserFK: 0,
      paymentReceivedBizSessionFK: 0,
      paymentCreatedBizSessionFK: 0,
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      invoicePaymentMode: [
        {
          paymentFK: 0,
          paymentModeFK: 0,
          paymentMode: 'string',
          amt: 0,
          cashRounding: 0,
          sequence: 0,
          remark: 'string',
          giroPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          chequePayment: [
            {
              paymentModeFK: 0,
              chequeNo: 'string',
              collectionDate: '2019-09-19T01:29:50.836Z',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          creditCardPayment: [
            {
              paymentModeFK: 0,
              creditCardNo: 'string',
              creditCardTypeFK: 0,
              creditCardType: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          netsPayment: [
            {
              paymentModeFK: 0,
              refNo: 'string',
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          depositPayment: [
            {
              paymentModeFK: 0,
              depositAccountFK: 0,
              id: 0,
              isDeleted: false,
              concurrencyToken: 0,
            },
          ],
          id: 0,
          isDeleted: false,
          concurrencyToken: 0,
        },
      ],
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
  ],
  creditNote: [
    {
      invoicePayerFK: 0,
      creditNoteNo: 'string',
      remark: 'string',
      generatedDate: '2019-09-19T01:29:50.836Z',
      generatedByUserFK: 0,
      total: 0,
      isGSTInclusive: false,
      gstValue: 0,
      gstAmt: 0,
      totalAftGST: 0,
      isStockIn: false,
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      creditNoteItem: [
        {
          creditNoteFK: 1,
          itemTypeFK: 88,
          invoiceItemFK: 99,
          stockTransactionFK: 0,
          itemCode: 'IC/000001',
          itemDescription: 'Item description here',
          isInventoryItem: false,
          isPackage: false,
          costPrice: 109,
          unitPrice: 109,
          quantity: 1,
          subTotal: 109,
          id: 1,
          isDeleted: false,
          concurrencyToken: 0,
        },
        {
          creditNoteFK: 1,
          itemTypeFK: 101,
          invoiceItemFK: 201,
          stockTransactionFK: 0,
          itemCode: 'IC/000002',
          itemDescription: 'Item description here',
          isInventoryItem: false,
          isPackage: false,
          costPrice: 139,
          unitPrice: 139,
          quantity: 1,
          subTotal: 139,
          id: 2,
          isDeleted: false,
          concurrencyToken: 0,
        },
      ],
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
  ],
  invoicePayerWriteOff: [
    {
      invoicePayerFK: 1,
      writeOffCode: 'WO/000001',
      writeOffDate: '2019-09-19T01:29:50.836Z',
      writeOffAmount: 100,
      writeOffReason: 'Test write off reason 1',
      isCancelled: false,
      cancelDate: '2019-09-19T01:29:50.836Z',
      cancelReason: 'string',
      cancelByUserFK: 0,
      id: 0,
      isDeleted: false,
      concurrencyToken: 0,
    },
  ],
  id: 0,
  isDeleted: false,
  concurrencyToken: 0,
}

export default createFormViewModel({
  namespace: 'invoicePayment',
  config: {},
  param: {
    service,
    state: {
      default: {
        paymentTxnList: [
          { patientPaymentTxn: [] },
          { coPayerPaymentTxn: [] },
          { govCoPayerPaymentTxn: [] },
        ],
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
              //currentTab: 2,
            },
          })
        }
      })
    },
    effects: {
      *submitWriteOff ({ payload }, { call }) {
        const response = yield call(service.writeOff, payload)
        yield put({
          type: 'writeOffResult',
          payload: {
            // TBD
          },
        })
      },
      *submitVoidPayment ({ payload }, { call }) {
        const response = yield call(service.writeOff, payload)
        yield put({
          type: 'voidPaymentResult',
          payload: {
            // TBD
          },
        })
      },
      *submitAddPayment ({ payload }, { call }) {
        const { paymentData, values } = payload
        let addPaymentPayload = {}
        let invoicePaymentMode = []

        invoicePaymentMode = invoicePaymentMode.concat(
          paymentData.map((x, index) => {
            const pMode = paymentMode.filter((y) => x.type === y.type)[0]
            return {
              //...x,
              paymentModeFK: pMode.paymentModeFK,
              paymentMode: pMode.type,
              amt: x.amount,
              //cashRounding
              sequence: index + 1,
              remark: x.remarks,
              [pMode.objName]: [
                { ...x },
              ],
            }
          }),
        )

        addPaymentPayload = {
          //invoicePayerFK
          invoicePaymentMode,
        }

        const response = yield call(service.addPayment, addPaymentPayload)

        yield put({
          type: 'addPaymentResult',
          response,
        })
      },
    },
    reducers: {
      // queryDone (state, { payload }) {
      //   // TBD
      //   console.log('queryDone', payload)
      //   return {
      //     ...state,
      //   }
      // },

      addPaymentResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      writeOffResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      voidPaymentResult (state, { payload }) {
        // TBD
        return {
          ...state,
        }
      },

      fakeQueryDone (state, { payload }) {
        //console.log('InvoicePayfakeQueryDone', dummyData)

        const { invoicePayment, invoicePayerWriteOff } = dummyData
        let paymentTxnList = []

        InvoicePayerType.forEach((x) => {
          paymentTxnList[x.listName] = (paymentTxnList[x.listName] || [])
            .concat(
              (invoicePayment || [])
                .filter((y) => y.invoicePayerFK === x.invoicePayerFK)
                .map((z) => {
                  return {
                    type: 'Payment',
                    itemID: z.receiptNo,
                    date: moment(z.paymentReceivedDate).format('DD MMM YYYY'),
                    amount: z.totalAmtPaid,
                  }
                }),
            )
        })

        InvoicePayerType.forEach((x) => {
          paymentTxnList[x.listName] = (paymentTxnList[x.listName] || [])
            .concat(
              (invoicePayerWriteOff || [])
                .filter((y) => y.invoicePayerFK === x.invoicePayerFK)
                .map((z) => {
                  return {
                    type: 'Write Off',
                    itemID: z.writeOffCode,
                    date: moment(z.writeOffDate).format('DD MMM YYYY'),
                    amount: z.writeOffAmount,
                    reason: z.writeOffReason,
                  }
                }),
            )
        })

        return {
          ...state,
          entity: {
            ...dummyData,
            paymentTxnList,
          },
        }
      },
    },
  },
})
