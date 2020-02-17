import React from 'react'
import DispenseDetails from './index'
// common component
import { notification } from '@/components'
// utils
import { consultationDocumentTypes } from '@/utils/codes'
import { postPDF, getPDF } from '@/services/report'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import {
  queryDrugLabelDetails,
  queryDrugLabelsDetails,
} from '@/services/dispense'

const defaultSocketPortsState = [
  { portNumber: 7182, attempted: false },
  { portNumber: 7183, attempted: false },
  { portNumber: 7184, attempted: false },
]
class PrintDrugLabelWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      socketPorts: [
        ...defaultSocketPortsState,
      ],
      pendingJob: [],
    }
    this.iswsConnect = false
    this.wsConnection = null
    this.initializeWebSocket(true)
  }

  componentWillUnmount () {
    if (this.wsConnection) this.wsConnection.close()
  }

  getPrintResult = async (type, row) => {
    let printResult
    let patientLabelReportID
    let drugLabelReportID
    let settings = JSON.parse(localStorage.getItem('clinicSettings'))
    if (settings.labelPrinterSize === '8.9cmx3.6cm') {
      drugLabelReportID = 31
      patientLabelReportID = 32
    } else {
      drugLabelReportID = 24
      patientLabelReportID = 27
    }

    if (type === 'Medication') {
      let drugLableSource = await this.generateDrugLablePrintSource(row)
      if (drugLableSource) {
        printResult = await postPDF(drugLabelReportID, drugLableSource.payload)
      }
    } else if (type === 'Medications') {
      const { dispense, values } = this.props
      const { prescription } = values
      let drugLableSource = await this.generateDrugLablesPrintSource(
        dispense ? dispense.visitID : values.id,
        prescription,
      )
      if (drugLableSource) {
        printResult = await postPDF(drugLabelReportID, drugLableSource.payload)
      }
    } else if (type === 'Patient') {
      const { patient, values } = this.props
      printResult = await getPDF(patientLabelReportID, {
        patientId: patient ? patient.id : values.patientProfileFK,
      })
    }
    return printResult
  }

  prepareJobForWebSocket = (content) => {
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
      this.wsConnection.send(`["${pendingJob[0]}"]`)
    }
    this.setState({
      pendingJob: [],
    })
  }

  handleOnPrint = async (type, row = {}) => {
    if (type === 'Medication' || type === 'Medications' || type === 'Patient') {
      let printResult = await this.getPrintResult(type, row)

      if (printResult) {
        const base64Result = arrayBufferToBase64(printResult)
        this.prepareJobForWebSocket(base64Result)
      }
    } else {
      const documentType = consultationDocumentTypes.find(
        (o) =>
          o.name.toLowerCase() === row.type.toLowerCase() ||
          (o.name === 'Others' && row.type === 'Other Documents'),
      )
      if (!documentType || !documentType.downloadConfig) {
        notification.error({ message: 'No configuration found' })
        return
      }
      const { downloadConfig } = documentType
      const reportParameters = {
        [downloadConfig.key]: row.sourceFK,
      }
      this.props.dispatch({
        type: 'report/updateState',
        payload: {
          reportTypeID: downloadConfig.id,
          reportParameters: {
            ...reportParameters,
            isSaved: true,
          },
        },
      })
      // exportPdfReport(downloadConfig.id, reportParameters)
    }
  }

  generateDrugLablePrintSource = async (row) => {
    const drugLabelDetails1 = await queryDrugLabelDetails(row.id)
    const { data } = drugLabelDetails1
    if (data && data.length > 0) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map((o) => {
          return this.getDrugLabelDetails(o, row)
        }),
      )
      return { payload: { DrugLabelDetails: drugLabelDetail } }
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  generateDrugLablesPrintSource = async (visitID, prescriptions = []) => {
    const drugLabelsDetails1 = await queryDrugLabelsDetails(visitID)
    const { data } = drugLabelsDetails1
    if (data && data.length > 0) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map((o) => {
          const prescriptionItem = prescriptions.find((p) => p.id === o.id)
          return this.getDrugLabelDetails(o, prescriptionItem)
        }),
      )
      return { payload: { DrugLabelDetails: drugLabelDetail } }
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  getDrugLabelDetails = (drugLabel, prescripationItem) => {
    const expiryDate = prescripationItem
      ? prescripationItem.expiryDate
      : undefined
    const batchNo =
      prescripationItem && Array.isArray(prescripationItem.batchNo)
        ? prescripationItem.batchNo[0]
        : prescripationItem.batchNo
    return {
      PatientName: drugLabel.patientName,
      PatientReferenceNo: drugLabel.patientReferenceNo,
      PatientAccountNo: drugLabel.patientAccountNo,
      DrugName: drugLabel.name,
      ConsumptionMethod: drugLabel.instruction,
      Precaution: drugLabel.precaution,
      IssuedDate: drugLabel.issueDate,
      ExpiryDate: expiryDate,
      UOM: drugLabel.dispenseUOM,
      Quantity: drugLabel.dispensedQuanity,
      BatchNo: batchNo,
      CurrentPage: drugLabel.currentPage,
      TotalPage: drugLabel.totalPage,
    }
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

  initializeWebSocket = (isFirstTime = false) => {
    const { socketPorts } = this.state

    if (this.iswsConnect === false) {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { printToolSocketURL = '' } = settings
      const [
        prefix = '',
        ip = '',
      ] = printToolSocketURL.split(':')

      const socket = socketPorts.find((port) => !port.attempted)
      if (!socket) {
        this.setState({
          pendingJob: [],
        })

        if (!isFirstTime)
          notification.error({
            message: `Medicloud printing tool is not running, please start it.`,
          })
        return
      }

      const wsUrl = `${prefix}:${ip}:${socket.portNumber}`

      if (wsUrl && !this.iswsConnect) {
        this.wsConnection = new window.WebSocket(wsUrl)
        this.wsConnection.onopen = () => {
          this.iswsConnect = true
          this.setSocketPortsState(socket)
          this.sendJobToWebSocket()
        }

        this.wsConnection.onclose = () => {
          this.iswsConnect = false
          this.setSocketPortsState(socket)
          this.initializeWebSocket(isFirstTime)
        }
      }
    } else {
      this.sendJobToWebSocket()
    }
  }

  render () {
    const { onPrint, ...restProps } = this.props
    const { pendingJob = [] } = this.state

    return (
      <DispenseDetails
        {...restProps}
        onPrint={this.handleOnPrint}
        sendingJob={pendingJob.length > 0}
      />
    )
  }
}

export default PrintDrugLabelWrapper
