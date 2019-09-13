import { notification } from '@/components'

let connection = null
const connectionObserver = {}

const initStream = () => {
  const signalREndPoint = process.env.signalrUrl

  connection = new signalR.HubConnectionBuilder()
    .withUrl(signalREndPoint, {
      accessTokenFactory: () => localStorage.getItem('token'),
    })
    .build()
  // console.log(connection)
  connection.on('NewNotification', (type, response) => {
    const { sender, message } = response
    console.log({ type, response, connectionObserver })
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
    if (sender !== user.data.clinicianProfile.name) {
      notification.info({
        // icon: WarningIcon,
        icon: null,
        placement: 'bottomRight',
        message: `${sender}: ${message}`,
        // description:
        //   'test test testtest d sd sd d test test test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d testtest test testtest d sd sd d test',
      })
    }

    if (connectionObserver[type]) {
      connectionObserver[type]()
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

  connection
    .start()
    .then(() => {
      console.log('Connected started')
    })
    .catch((err) => {
      return console.error(err.toString())
    }) // JSON-string from `response.json()` call
    .catch((error) => console.error(error))

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
  console.log('sendNotification', type, data)
  connection.invoke('SendNotification', type, data).catch((err) => {
    return console.error(err)
  })
}

const subscribeNotification = (type, payload) => {
  const { callback } = payload
  connectionObserver[type] = callback
}

module.exports = {
  initStream,
  sendNotification,
  subscribeNotification,
}
