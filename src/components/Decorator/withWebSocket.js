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
      console.log('initialize')
      this.initializeWebSocket(true)
    }

    componentWillUnmount () {
      console.log('will unmount')
      if (this.wsConnection) this.wsConnection.close()
    }

    prepareJobForWebSocket = (content) => {
      // reset port number state to retry all attempt and set job content
      // then initialize web socket connection
      this.setState(
        {
          socketPorts: [
            ...defaultSocketPortsState,
          ],
          pendingJob: [
            content,
          ],
        },
        () => {
          this.initializeWebSocket(false)
        },
      )
    }

    sendJobToWebSocket = () => {
      const { pendingJob } = this.state

      if (
        this.wsConnection &&
        this.wsConnection.readyState === 1 &&
        pendingJob.length === 1
      ) {
        this.wsConnection.send(pendingJob[0])
      }
      this.setState({
        pendingJob: [],
      })
    }

    setSocketPortsState = (socket) => {
      this.setState((preState) => ({
        socketPorts: preState.socketPorts.map(
          (port) =>
            port.portNumber === socket.portNumber
              ? { ...port, attempted: true }
              : { ...port },
        ),
      }))
    }

    handlePrint = async (content) => {
      // console.log({ content })
      // const pdfResult = await getPDF(reportID, payload)
      if (content) {
        // const base64Result = arrayBufferToBase64(pdfResult)
        this.prepareJobForWebSocket(content)
      }
    }

    // will initialize web socket connection
    // send job if there is any successful connection or already connected
    initializeWebSocket = (isFirstLoad = false) => {
      const { socketPorts, isWsConnected } = this.state
      if (isWsConnected === false) {
        console.log('initiate connection')
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
          this.setState({
            pendingJob: [],
          })

          if (!isFirstLoad)
            notification.error({
              message: `Medicloud printing tool is not running, please start it.`,
            })
          return
        }

        const wsUrl = `${prefix}:${ip}:${socket.portNumber}`

        if (wsUrl && !isWsConnected) {
          this.wsConnection = new window.WebSocket(wsUrl)
          this.wsConnection.onopen = () => {
            // this.isWsConnected = true
            this.setState({
              isWsConnected: true,
            })
            this.setSocketPortsState(socket)
            this.sendJobToWebSocket()
          }

          this.wsConnection.onclose = () => {
            // this.isWsConnected = false
            this.setState({
              isWsConnected: false,
            })
            this.setSocketPortsState(socket)
            this.initializeWebSocket(isFirstLoad)
          }

          this.wsConnection.onerror = (event) => {
            console.log('WebSocket error: ', event)
          }
        }
      } else {
        this.sendJobToWebSocket()
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
