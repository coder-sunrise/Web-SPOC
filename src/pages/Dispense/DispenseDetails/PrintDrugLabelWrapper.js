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
import CONSTANTS from './constants'

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
    this.isWsConnected = false
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

    if (type === CONSTANTS.DRUG_LABEL) {
      let drugLableSource = await this.generateDrugLablePrintSource(row)
      if (drugLableSource) {
        printResult = await postPDF(drugLabelReportID, drugLableSource.payload)
      }
    } else if (type === CONSTANTS.ALL_DRUG_LABEL) {
      const { dispense, values } = this.props
      const { prescription } = values
      let drugLableSource = await this.generateDrugLablesPrintSource(
        dispense ? dispense.visitID : values.id,
        prescription,
      )
      if (drugLableSource) {
        printResult = await postPDF(drugLabelReportID, drugLableSource.payload)
      }
    } else if (type === CONSTANTS.PATIENT_LABEL) {
      const { patient, values } = this.props
      printResult = await getPDF(patientLabelReportID, {
        patientId: patient ? patient.id : values.patientProfileFK,
      })
    }
    return printResult
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
      this.wsConnection.send(`["${pendingJob[0]}"]`)
    }
    this.setState({
      pendingJob: [],
    })
  }

  handleOnPrint = async ({ type, row = {} }) => {
    const withoutPrintPreview = [
      CONSTANTS.ALL_DRUG_LABEL,
      CONSTANTS.DRUG_LABEL,
      CONSTANTS.PATIENT_LABEL,
    ]
    console.log({ type, row })
    if (withoutPrintPreview.includes(type)) {
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

  // will initialize web socket connection
  // send job if there is any successful connection or already connected
  initializeWebSocket = (isFirstLoad = false) => {
    const { socketPorts } = this.state
    console.log({ isWsConnected: this.isWsConnected })
    if (this.isWsConnected === false) {
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

      if (wsUrl && !this.isWsConnected) {
        this.wsConnection = new window.WebSocket(wsUrl)
        this.wsConnection.onopen = () => {
          console.log('on open')
          this.isWsConnected = true
          this.setSocketPortsState(socket)
          this.sendJobToWebSocket()
        }

        this.wsConnection.onclose = () => {
          console.log('on close')
          this.isWsConnected = false
          this.setSocketPortsState(socket)
          this.initializeWebSocket(isFirstLoad)
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
