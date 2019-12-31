import _ from 'lodash'
import * as signalR from '@microsoft/signalr'
import { notification } from '@/components'

let connection = null
const connectionObserver = {}
const tenMinutesInMillisecond = 600000
const retryIntervalInMillisecond = 5000

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
    // var message = data.sender + ' says ' + data.message
    // var li = document.createElement('li')
    // li.textContent = message
    // document.getElementById('messagesList').appendChild(li)
    // console.log('***************')
    // console.log('NotificationReceived: ' + eventName + ' from ' + data.sender)
    // console.log('Message:' + data.message)
    // console.log('***************')
    // var notification = new Notification('New Messsage Received', {
    //   body: data.sender + ': ' + data.message,
    //   icon:
    //     'https://5.imimg.com/data5/XQ/KP/MY-40305254/kids-toy-500x500.jpg',
    // })
  })

  let retryAttempt = 0

  const startConnection = () => {
    connection
      .start()
      .then(() => {
        setSignalRConnectedState(true)
        console.log('Connection started')
      })
      .catch((err) => {
        setSignalRConnectedState(false)
        if (connection.connectionState !== 'Connected') {
          retryAttempt += 1
          const interval = retryAttempt * retryIntervalInMillisecond

          if (retryAttempt > 4) {
            return console.log(err)
          }

          setTimeout(() => {
            console.log(
              `Retry attempt:${retryAttempt}, next retry in: ${interval}ms`,
            )
            startConnection()
          }, interval)
        }
        return console.log(err)
      })
  }

  connection.onclose(() => {
    console.log('Disconnected')
    setSignalRConnectedState(false)
  })

  connection.onreconnected(() => {
    console.log('Reconnected')
    setSignalRConnectedState(true)
  })

  startConnection()

  // JSON-string from `response.json()` call
  // .catch((error) => console.log(error))

  // setInterval(() => {
  //   connection
  //     .invoke('SendNotification', 'NewMessage', {
  //       message: 'reception update',
  //       sender: 'Mr Test',
  //     })
  //     .catch((err) => {
  //       return console.error(err.toString())
  //     })
  // }, 5000)
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
