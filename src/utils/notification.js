import { connect } from 'dva'

export const SendNotification = (payload) => {
  const { user } = window.g_app._store.getState()
  let sender = !user.data ? '' : user.data.name
}

// export const SendNotification = connect()(
//   _SendNotification,
// )
