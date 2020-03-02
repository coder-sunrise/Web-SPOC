import { createBasicModel } from 'medisys-model'

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
    reducers: {
      clearNotification (state, { payload = {} }) {
        const { notification = {}, type } = payload
        const { timestamp } = notification
        const list = state.notifications.filter((o) => {
          return !timestamp && !type
            ? false
            : timestamp !== o.timestamp && type !== o.type
        })
        sessionStorage.setItem('notifications', JSON.stringify(list))

        return { ...state, notifications: list }
      },
      readNotification (state, { payload = {} }) {
        const { notification = {}, type } = payload
        const { timestamp } = notification
        const list = state.notifications.map((o) => ({
          ...o,
          read:
            o.read || (!timestamp && !type)
              ? true
              : timestamp === o.timestamp || type === o.type,
        }))
        sessionStorage.setItem('notifications', JSON.stringify(list))

        return {
          ...state,
          notifications: list,
        }
      },
    },
  },
})
