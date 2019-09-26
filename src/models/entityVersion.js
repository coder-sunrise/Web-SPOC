import { createFormViewModel } from 'medisys-model'
import * as service from '../services/clinic'

export default createFormViewModel({
  namespace: 'entityVersion',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: {},
    effects: {},
    reducers: {},
  },
})
