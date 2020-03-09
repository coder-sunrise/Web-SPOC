import _ from 'lodash'
import * as signalR from '@microsoft/signalr'
import { notification } from '@/components'

let connection = null
const connectionObserver = {}
const tenMinutesInMillisecond = 600000
const retryIntervalInMillisecond = 5000

const CONNECTION_STATE = {
  CONNECTED: 'Connected',
  DISCONNECTED: 'Disconnected',
}

const setSignalRConnectedState = (state = false) => {
  window.g_app._store.dispatch({
    type: 'header/updateState',
    payload: {
      signalRConnected: state,
    },
  })
}

const automaticReconnectConfig = {
  nextRetryDelayInMilliseconds: (retryContext) => {
    const { previousRetryCount, elapsedMilliseconds } = retryContext

    if (elapsedMilliseconds < tenMinutesInMillisecond) {
      // If we've been reconnecting for less than 10 minutes so far,
      // wait between 0 and 20 seconds before the next reconnect attempt.
      const retryCount = previousRetryCount + 1
      const reconnectInterval = retryCount * retryIntervalInMillisecond
      console.log(`Reconnect in ${reconnectInterval}ms`)
      return reconnectInterval
    }

    // If we've been reconnecting for more than 10 minutes so far, stop reconnecting.
    console.log('Stopping reconnect attempt')
    return null
  },
}

const updateSignalRState = () => {
  if (connection) {
    let isConnected = false
    if (connection.connectionState === CONNECTION_STATE.CONNECTED) {
      isConnected = true
    }

    setSignalRConnectedState(isConnected)
    console.log(`Connection State: ${connection.connectionState}`)
  }
}

const initStream = () => {
  const signalREndPoint = process.env.signalrUrl

  connection = new signalR.HubConnectionBuilder()
    .withUrl(signalREndPoint, {
      accessTokenFactory: () => localStorage.getItem('token'),
    })
    .withAutomaticReconnect(automaticReconnectConfig)
    .build()

  connection.on('NewNotification', (type, response) => {
    const { sender, message } = response

    const { dispatch, getState } = window.g_app._store
    const {
      user = {
        data: {
          clinicianProfile: {
            name: '',
          },
        },
      },
      header,
    } = getState()
    if (sender !== user.data.clinicianProfile.name) {
      const { notifications = [] } = header

      notifications.push(response)
      dispatch({
        type: 'header/updateState',
        payload: notifications,
      })
      sessionStorage.setItem('notifications', JSON.stringify(notifications))
    }

    if (connectionObserver[type]) {
      connectionObserver[type](response)
    }
  })

  connection.onclose(updateSignalRState)
  connection.onreconnected(updateSignalRState)

  let retryAttempt = 0
  const startConnection = () => {
    if (connection) {
      if (connection.connectionState === CONNECTION_STATE.DISCONNECTED)
        // starting the connection
        connection.start().then(updateSignalRState).catch((err) => {
          updateSignalRState()
          if (connection.connectionState === CONNECTION_STATE.DISCONNECTED) {
            retryAttempt += 1
            const interval = retryAttempt * retryIntervalInMillisecond

            if (retryAttempt > 4) {
              return console.log(err)
            }

            setTimeout(() => {
              console.log(
                `Retry attempt: ${retryAttempt}, next retry in: ${interval}ms`,
              )
              startConnection()
            }, interval)
          }
          return console.log(err)
        })
      else if (connection.connectionState === CONNECTION_STATE.CONNECTED)
        updateSignalRState()
    }
  }

  startConnection()
}

const sendNotification = (type, data) => {
  // console.log(payload)
  // console.log({ connection })
  const { dispatch, getState } = window.g_app._store
  const {
    user = {
      data: {
        clinicianProfile: {
          name: '',
        },
      },
    },
  } = getState()
  data.sender = user.data.clinicianProfile.name
  data.senderId = user.data.id
  data.timestamp = Date.now()

  if (connection)
    connection.invoke('SendNotification', type, data).catch((err) => {
      return console.error(err)
    })
}

const debouncedSendNotification = _.debounce(sendNotification, 500, {
  leading: true,
})

const subscribeNotification = (type, payload) => {
  const { callback } = payload
  connectionObserver[type] = callback
}

module.exports = {
  initStream,
  sendNotification: debouncedSendNotification,
  subscribeNotification,
}
