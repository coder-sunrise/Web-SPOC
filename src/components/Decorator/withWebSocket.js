import React from 'react'
// common component
import { notification } from '@/components'
// services
import { getPDF } from '@/services/report'
// utils
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { AESEncryptor } from '@/utils/aesEncryptor'

const defaultSocketPortsState = [
  7182,
  7183,
  7184,
]

const withWebSocket = () => (Component) => {
  class WebSocketBase extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        pendingJob: [],
        isWsConnected: false,
      }
      // this.isWsConnected = false
      this.wsConnection = null
      this.tryConnectSocket()
    }

    componentWillUnmount () {
      const { isWsConnected } = this.state

      if (this.wsConnection && isWsConnected === true) this.wsConnection.close()
    }

    prepareJobForWebSocket = async (content) => {
      // reset port number state to retry all attempt and set job content
      // then initialize web socket connection
      this.setState({
        pendingJob: [
          content,
        ],
      })
      const { isWsConnected } = this.state

      if (isWsConnected === true) {
        this.sendJobToWebSocket()
      } else {
        const connected = await this.tryConnectSocket()
        if (connected === true) {
          await this.sendJobToWebSocket()
        } else {
          notification.error({
            message: `Medicloud printing tool is not running, please start it.`,
          })
          this.setState({
            pendingJob: [],
          })
        }
      }
    }

    tryConnectSocket = async () => {
      let connected = false
      const settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { printToolSocketURL = '' } = settings
      const [
        prefix = '',
        ip = '',
      ] = printToolSocketURL.split(':')

      for (let index = 0; index < defaultSocketPortsState.length; index++) {
        const port = defaultSocketPortsState[index]
        const wsUrl = `${prefix}:${ip}:${port}`
        if (wsUrl) {
          console.log(`try to connect ${wsUrl}`)
          this.wsConnection = new window.WebSocket(wsUrl)
          this.wsConnection.onopen = () => {
            console.log(`connected: ${wsUrl}`)
            this.setState({
              isWsConnected: true,
            })
          }
          connected = await this.connectionAsync(this.wsConnection)
          if (connected) {
            break
          }
        }
      }
      return connected
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

    handlePrint = async (content) => {
      // console.log(`handlePrint: ${content}`)
      if (content) {
        await this.prepareJobForWebSocket(AESEncryptor.encrypt(content))
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
