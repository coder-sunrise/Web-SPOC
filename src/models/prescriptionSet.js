import { createListViewModel } from 'medisys-model'
import service from '@/services/prescriptionSet'

export default createListViewModel({
  namespace: 'prescriptionSet',
  config: {},
  param: {
    service,
    state: {
      default: {
        prescriptionSetItem: []
      }
    },
    subscriptions: ({ dispatch, history }) => { },
    effects: {},
    reducers: {},
  },
})
