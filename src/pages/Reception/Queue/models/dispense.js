// import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'dispense',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      invoiceItems: [
        {
          PRN: false,
          amount: 9,
          batchNo: '',
          category: 'Drug',
          consumptionMethod: '',
          discount: 0,
          discountType: '',
          dosage: '',
          dosageUnit: '',
          expireDate: '',
          frequency: '',
          instruction: '',
          itemCode: 'drug01',
          period: '',
          periodAmount: undefined,
          precautionOne: '',
          precautionThree: '',
          precautionTwo: '',
          quantity: 3,
          remark: '',
          scheme: 0,
          stock: '44',
          subTotal: 9,
          unitPrice: 3,
        },
        {
          PRN: false,
          amount: 6,
          batchNo: '',
          category: 'Drug',
          consumptionMethod: '',
          discount: 0,
          discountType: '',
          dosage: '',
          dosageUnit: '',
          expireDate: '',
          frequency: '',
          instruction: '',
          itemCode: 'drug02',
          period: '',
          periodAmount: undefined,
          precautionOne: '',
          precautionThree: '',
          precautionTwo: '',
          quantity: 4,
          remark: '',
          scheme: 0,
          stock: '44',
          subTotal: 8,
          unitPrice: 2,
        },
      ],
    },
    subscriptions: {},
    effects: {},
    reducers: {
      addItems (state, { payload }) {
        return {
          ...state,
          invoiceItems: [
            ...state.invoiceItems,
            payload,
          ],
        }
      },
    },
  },
})
