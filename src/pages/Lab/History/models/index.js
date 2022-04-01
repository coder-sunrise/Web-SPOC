import { notification } from '@/components'
import { createListViewModel } from 'medisys-model'
import service from '../services'

export default createListViewModel({
  namespace: 'labWorklistHistory',
  config: { queryOnLoad: true },
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch }) => {},
    reducers: {},
  },
})
