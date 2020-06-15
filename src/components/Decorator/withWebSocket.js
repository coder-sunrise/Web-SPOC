import React from 'react'
// common component
import { notification } from '@/components'
// services
import { getPDF } from '@/services/report'
// utils
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

const defaultSocketPortsState = [
  { portNumber: 7182, attempted: false },
  { portNumber: 7183, attempted: false },
  { portNumber: 7184, attempted: false },
]

const withWebSocket = () => (Component) => {
  class WebSocketBase extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        socketPorts: [
          ...defaultSocketPortsState,
        ],
        pendingJob: [],
        isWsConnected: false,
      }
      // this.isWsConnected = false
      this.wsConnection = null

      this.initializeWebSocket(true)
    }

    componentWillUnmount () {
      const { isWsConnected } = this.state

      if (this.wsConnection && isWsConnected === true) this.wsConnection.close()
    }

    prepareJobForWebSocket = async (content) => {
      // reset port number state to retry all attempt and set job content
      // then initialize web socket connection
      this.setState({
        // socketPorts: [
        //   ...defaultSocketPortsState,
        // ],
        pendingJob: [
          content,
        ],
      })

      const { isWsConnected } = this.state

      if (isWsConnected === true) {
        this.sendJobToWebSocket()
      } else {
        let haveOneOpend = false
        const settings = JSON.parse(localStorage.getItem('clinicSettings'))
        const { printToolSocketURL = '' } = settings
        const [
          prefix = '',
          ip = '',
        ] = printToolSocketURL.split(':')

        for (let index = 0; index < defaultSocketPortsState.length; index++) {
          const socket = defaultSocketPortsState[index]
          const wsUrl = `${prefix}:${ip}:${socket.portNumber}`
          if (wsUrl) {
            console.log(`try to connect ${wsUrl}`)
            this.wsConnection = new window.WebSocket(wsUrl)
            haveOneOpend = await this.connectionAsync(this.wsConnection)
            if (haveOneOpend) {
              this.sendJobToWebSocket()
              break
            }
          }
        }
        if (!haveOneOpend) {
          notification.error({
            message: `Medicloud printing tool is not running, please start it.`,
          })
          this.setState({
            pendingJob: [],
          })
        }
      }
    }

    sendJobToWebSocket = async () => {
      const { pendingJob } = this.state

      if (
        this.wsConnection &&
        this.wsConnection.readyState === 1 &&
        pendingJob.length === 1
      ) {
        this.wsConnection.send(pendingJob[0])
        notification.success({
          message: `Job sent to the printer.`,
        })
      }
      this.setState({
        pendingJob: [],
      })
    }

    setSocketPortsState = (socket, attempted = true) => {
      this.setState((preState) => ({
        socketPorts: preState.socketPorts.map(
          (port) =>
            port.portNumber === socket.portNumber
              ? { ...port, attempted }
              : { ...port },
        ),
      }))
    }

    handlePrint = async (content) => {
      if (content) {
        await this.prepareJobForWebSocket(content)
      }
    }

    connectionAsync = async (socket, timeout = 1000) => {
      const isOpened = () => socket.readyState === WebSocket.OPEN

      if (socket.readyState !== WebSocket.CONNECTING) {
        return isOpened()
      }

      const intrasleep = 10
      const ttl = timeout / intrasleep // time to loop
      let loop = 0
      while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
        await new Promise((resolve) => setTimeout(resolve, intrasleep))
        loop += 1
      }
      return isOpened()
    }

    // will initialize web socket connection
    // send job if there is any successful connection or already connected
    initializeWebSocket = () => {
      const { socketPorts, isWsConnected } = this.state

      if (isWsConnected === false) {
        let settings = JSON.parse(localStorage.getItem('clinicSettings'))
        const { printToolSocketURL = '' } = settings
        const [
          prefix = '',
          ip = '',
        ] = printToolSocketURL.split(':')

        // attempt to connect to different port number
        // abort early and clear job if no available port number left
        const socket = socketPorts.find((port) => !port.attempted)

        if (!socket) {
          return
        }

        const wsUrl = `${prefix}:${ip}:${socket.portNumber}`

        if (wsUrl && !isWsConnected) {
          this.wsConnection = new window.WebSocket(wsUrl)
          this.wsConnection.onopen = () => {
            // this.isWsConnected = true
            console.log(`connected: ${wsUrl}`)
            this.setState({
              isWsConnected: true,
            })
            this.setSocketPortsState(socket)
          }

          this.wsConnection.onclose = () => {
            // this.isWsConnected = false
            // console.log(`closed: ${wsUrl}`)
            this.setSocketPortsState(socket, true)
            this.initializeWebSocket()
          }

          // this.wsConnection.onerror = (event) => {
          //   console.log('WebSocket error: ', event)
          // }
        }
      }
    }

    render () {
      const { pendingJob = [] } = this.state

      return (
        <Component
          {...this.props}
          handlePrint={this.handlePrint}
          sendingJob={pendingJob.length > 0}
        />
      )
    }
  }

  return WebSocketBase
}

export default withWebSocket
