import React from 'react'
// common component
import { notification } from '@/components'
// services
import { getPDF } from '@/services/report'
// utils
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

const withWebSocket = () => (Component) => {
  class WebSocketBase extends React.Component {
    constructor (props) {
      super(props)
      this.iswsConnect = false
      this.wsConnection = null
      this.connectWebSocket()
    }

    componentWillUnmount () {
      if (this.wsConnection) this.wsConnection.close()
    }

    handlePrint = async ({ reportID, payload }) => {
      const pdfResult = await getPDF(reportID, payload)
      if (pdfResult) {
        const base64Result = arrayBufferToBase64(pdfResult)
        if (this.iswsConnect === true) {
          this.wsConnection.send(`["${base64Result}"]`)
        } else {
          notification.error({
            message: `Medicloud printing tool is not running, please start it.`,
          })
        }
      }
    }

    connectWebSocket () {
      if (this.iswsConnect === false) {
        let settings = JSON.parse(localStorage.getItem('clinicSettings'))
        if (settings.printToolSocketURL) {
          this.wsConnection = new window.WebSocket(settings.printToolSocketURL)
          this.wsConnection.onopen = () => {
            this.iswsConnect = true
          }

          this.wsConnection.onclose = () => {
            this.iswsConnect = false
          }
        }
      }
    }

    render () {
      return <Component {...this.props} handlePrint={this.handlePrint} />
    }
  }

  return WebSocketBase
}

export default withWebSocket
