import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

const dummyData = {
  patientName: 'Lee Tian Kaang',
  patientAccountNo: 'A0123456789',
  invoiceNo: 'IV-A0001',
  invoiceDate: '2019-09-17T07:47:18.511Z',
  invoiceTotal: 5000,
  totalAdjustment: 109.99,
  invoiceGSTAmt: 50.99,
  invoiceTotalAftGST: 5160.98,
  totalCreditNoteAmt: 1000,
  outstandingBalance: 2500,
  writeOffAmount: 200,
  totalPayment: 888,
  remark: 'This is invoice remarks.',
  invoiceItem: [
    {
      itemType: 'Medication',
      itemName: 'Panadol',
      quantity: 1,
      adjAmt: 3,
      totalAfterItemAdjustment: 1097,
      id: 1,
      isDeleted: false,
      //concurrencyToken: 0,
    },
    {
      itemType: 'Vaccination',
      itemName: 'Chicken Pox Vaccine',
      quantity: 1,
      adjAmt: 0,
      totalAfterItemAdjustment: 8,
      id: 2,
      isDeleted: false,
      //concurrencyToken: 0,
    },
    {
      itemType: 'Service',
      itemName: 'Consulation Service	',
      quantity: 1,
      adjAmt: 0,
      totalAfterItemAdjustment: 1,
      id: 3,
      isDeleted: false,
      //concurrencyToken: 0,
    },
  ],
  invoiceAdjustment: [
    // {
    //   adjRemark: 'Adjust 109',
    //   adjAmount: 109,
    //   sequence: 1,
    //   id: 1,
    //   isDeleted: false,
    //   //concurrencyToken: 0,
    // },
    // {
    //   adjRemark: 'Second Adjust',
    //   adjAmount: 91,
    //   sequence: 2,
    //   id: 2,
    //   isDeleted: false,
    //   //concurrencyToken: 0,
    // },
  ],
  id: 0,
  isDeleted: false,
  //concurrencyToken: 0,
}

export default createListViewModel({
  namespace: 'invoiceDetail',
  config: {},
  param: {
    service,
    state: {
      default: {},
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
      fakeQueryDone (state, { payload }) {
        console.log('fakeQueryDone', dummyData)
        return {
          ...state,
          entity: {
            ...dummyData,
            invoiceDate: moment(dummyData.invoiceDate).format('DD MMM YYYY'),
          },
        }
      },
    },
  },
})
