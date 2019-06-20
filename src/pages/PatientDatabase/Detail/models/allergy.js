import update from 'immutability-helper'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const namespace = 'allergy'
export default createFormViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        patientAllery: [],
      },
    },
    subscriptions: {},
    effects: {
      *submit ({ payload }, { call }) {
        return yield call(fakeSubmitForm, payload)
      },
    },
    reducers: {
     
    },
  },
})
