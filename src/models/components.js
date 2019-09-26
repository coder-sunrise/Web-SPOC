import { createBasicModel } from 'medisys-model'
import { queryNotices } from '@/services/api'

export default createBasicModel({
  namespace: 'components',
  config: {},
  param: {
    // service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {},
  },
})
