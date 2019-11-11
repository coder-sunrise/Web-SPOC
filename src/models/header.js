import { createBasicModel } from 'medisys-model'
import { queryNotices } from '@/services/api'
import { notification } from '@/components'

export default createBasicModel({
  namespace: 'header',
  config: {},
  param: {
    // service,
    state: {
      signalRConnected: false,

      notifications: JSON.parse(sessionStorage.getItem('notifications')) || [],
    },
    setting: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {},
  },
})
