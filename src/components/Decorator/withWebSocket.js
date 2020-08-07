import React from 'react'
// common component
import { notification, CommonModal, Primary } from '@/components'
import { CircularProgress } from '@material-ui/core'
import moment from 'moment'
// services
import { getPDF } from '@/services/report'
// utils
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { AESEncryptor } from '@/utils/aesEncryptor'
import { getUniqueGUID } from '@/utils/utils'
import Scanner from './scanner/index'

const defaultSocketPortsState = [
  7182,
  7183,
  7184,
]
const WebSocketMessageType = {
  Print: 1,
  Scan: 2,
  ScanCompleted: 3,
}

const withWebSocket = () => (Component) => {
  class WebSocketBase extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        pendingJob: [],
        scanResults: [],
        isWsConnected: false,
        loading: false,
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
      const pendingJob = [
        content,
      ]
      let sendSuccess = false
      this.setState({ pendingJob })

      const { isWsConnected } = this.state
      if (isWsConnected === true || (await this.tryConnectSocket())) {
        this.wsConnection.send(content)
        sendSuccess = true
      } else {
        notification.error({
          message: `Medicloud printing tool is not running, please start it.`,
        })
      }
      this.setState({ pendingJob: [] })
      return sendSuccess
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
          this.wsConnection.onmessage = this.onReceivedMessage
          connected = await this.connectionAsync(this.wsConnection)
          if (connected) {
            break
          }
        }
      }
      return connected
    }

    handlePrint = async (content) => {
      if (content) {
        const result = await this.prepareJobForWebSocket(
          AESEncryptor.encrypt(
            JSON.stringify({
              messageType: WebSocketMessageType.Print,
              message: content,
            }),
          ),
        )
        if (result)
          notification.success({
            message: `Job sent to the printer.`,
          })
        return result
      }
      return false
    }

    onReceivedMessage = (message) => {
      if (message && message.data) {
        const { data } = message
        const returnMessage = JSON.parse(data)
        const { MessageType, Data } = returnMessage
        console.log(returnMessage)

        if (MessageType === WebSocketMessageType.Scan) {
          this.setState((preState) => ({
            scanResults: [
              ...preState.scanResults,
              {
                uid: getUniqueGUID(),
                image: Data,
                name: moment().format('YYYYMMDD_hhmmss'),
              },
            ],
            loading: false,
          }))
        } else if (MessageType === WebSocketMessageType.ScanCompleted) {
          this.setState({ loading: false })
        }
      }
    }

    handleScaning = async (params) => {
      console.log('handleScaning', params)
      const result = await this.prepareJobForWebSocket(
        AESEncryptor.encrypt(
          JSON.stringify({
            messageType: WebSocketMessageType.Scan,
          }),
        ),
      )
      if (result) this.setState({ loading: true })
    }

    handleDeleteItem = (uid) => {
      const { scanResults = [] } = this.state
      scanResults.forEach((o, index) => {
        if (o.uid === uid) scanResults.splice(index, 1)
      })

      this.setState({ scanResults })
    }

    handleUpdateName = (row) => {
      const { uid, name } = row
      this.setState((prevState) => ({
        scanResults: prevState.scanResults.map((m) => {
          if (m.uid === uid) {
            return { ...m, name }
          }
          return m
        }),
      }))
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

    toggleModal = () => {
      this.setState((preState) => ({
        showScanner: !preState.showScanner,
        loading: false,
      }))
    }

    handleCloseScanner = () => {
      this.setState({ showScanner: false, loading: false, scanResults: [] })
    }

    render () {
      const { pendingJob = [], scanResults = [], loading } = this.state

      return (
        <React.Fragment>
          <Component
            {...this.props}
            handlePrint={this.handlePrint}
            handleOpenScanner={this.toggleModal}
            sendingJob={pendingJob.length > 0}
          />
          <CommonModal
            open={this.state.showScanner}
            onClose={this.handleCloseScanner}
            title='Scan'
            maxWidth='lg'
            minHeight={500}
            keepMounted={false}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={
                  loading ? (
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1200,
                      '& h4': {
                        fontWeight: 500,
                      },
                    }
                  ) : (
                    { display: 'none' }
                  )
                }
              >
                <CircularProgress />
                <Primary>
                  <h4>Scaning...</h4>
                </Primary>
              </div>
              <div style={loading ? { opacity: 0.4 } : {}}>
                <Scanner
                  handleScaning={this.handleScaning}
                  handleDeleteItem={this.handleDeleteItem}
                  handleUpdateName={this.handleUpdateName}
                  imageDatas={scanResults}
                />
              </div>
            </div>
          </CommonModal>
        </React.Fragment>
      )
    }
  }

  return WebSocketBase
}

export default withWebSocket
