import update from 'immutability-helper'
import { getUniqueId } from '@/utils/utils'
import { fakeSubmitForm } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const namespace = 'emergencyContact'
export default createFormViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        patientEmergencyContact: [],
      },
    },
    subscriptions: {},
    effects: {},
    reducers: {},
  },
})
