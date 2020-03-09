import React from 'react'
// common components
import { Button, CardContainer, CommonModal, notification } from '@/components'
// sub components
import PatientBed from './PatientBed'
import BedDetails from './BedDetails'

class PatientMonitoring extends React.Component {
  state = {
    showBedDetails: false,
    isWsConnected: false,
    bedsData: [
      {
        id: 1,
        bedLabel: 'Bed One',
        patientName: 'Patient One',
        heartRate: 79,
        respiratoryRate: 18,
        exitingBed: true,
      },
      {
        id: 2,
        bedLabel: 'Bed Two',
        patientName: 'Patient Two',
        heartRate: 100,
        respiratoryRate: 24,
        exitingBed: false,
      },
    ],
    bedData: undefined,
  }

  componentWillMount () {
    const url = 'ws://192.168.1.120:9999'
    this.wsConnection = new WebSocket(url)

    this.wsConnection.onopen = () => {
      this.setState({
        isWsConnected: true,
      })
    }

    this.wsConnection.onclose = () => {
      this.setState({
        isWsConnected: false,
      })
    }

    this.wsConnection.onmessage = (message) => {
      const { data } = message
      // data format
      // {"id": "1", "hr": 84, "resp": 5, "status": "Normal"}
      this.setState({ bedData: JSON.parse(data) })
    }
  }

  componentWillUnmount () {
    if (this.wsConnection) this.wsConnection.close()
  }

  showAlertNotification = () => {
    notification.warning({
      duration: 5,
      message: 'Patient is exiting bed',
      description: 'Click here for more details',
      onClick: this.handleAlertClick,
      style: { cursor: 'pointer' },
    })
  }

  showNormalNotification = () => {
    notification.warning({
      duration: 5,
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      description: 'Click here for more details',
    })
  }

  toggleBedDetails = () => {
    this.setState((preState) => ({ showBedDetails: !preState.showBedDetails }))
  }

  handleAlertClick = () => {
    this.toggleBedDetails()
    notification.destroy()
  }

  render () {
    const { bedsData, bedData, isWsConnected, showBedDetails } = this.state

    return (
      <CardContainer hideHeader>
        <Button color='primary' onClick={this.showAlertNotification}>
          Sample Alert Notification
        </Button>
        <Button color='primary' onClick={this.showNormalNotification}>
          Sample Normal Notification
        </Button>
        <div>
          <span>Server status: {isWsConnected ? 'Connected' : 'Offline'}</span>
        </div>
        <div>
          {bedData && (
            <PatientBed
              key={bedData.id}
              bed={bedData}
              onClick={this.toggleBedDetails}
            />
          )}
        </div>
        <CommonModal
          open={showBedDetails}
          title='Bed Details'
          onConfirm={this.toggleBedDetails}
          onClose={this.toggleBedDetails}
        >
          <BedDetails />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default PatientMonitoring
