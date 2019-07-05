import { fakeSubmitForm } from '@/services/api'


import * as service from '../services'
import { createFormViewModel } from 'medisys-model'

export default createFormViewModel({
  namespace: 'addPayment',
  config:{
    queryOnLoad:true,
  },
  param: {
    service,
    state: {
    },
    subscriptions: {},
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
        // message.success('提交成功');
      },
    },
    reducers: {
    },
  },
})

