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

class PrintDrugLabelWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.iswsConnect = false
    this.wsConnection = null
    this.connectWebSocket()
  }

  componentWillUnmount () {
    if (this.wsConnection) this.wsConnection.close()
  }

  getPrintResult = async (type, row) => {
    let printResult
    if (type === 'Medication') {
      let drugLableSource = await this.generateDrugLablePrintSource(row)
      if (drugLableSource) {
        printResult = await postPDF(
          drugLableSource.reportId,
          drugLableSource.payload,
        )
      }
    } else if (type === 'Medications') {
      const { dispense, values } = this.props
      const { prescription } = values
      let drugLableSource = await this.generateDrugLablesPrintSource(
        dispense.visitID,
        prescription,
      )
      if (drugLableSource) {
        printResult = await postPDF(
          drugLableSource.reportId,
          drugLableSource.payload,
        )
      }
    } else if (type === 'Patient') {
      const { patient } = this.props
      printResult = await getPDF(27, { patientId: patient.id })
    }
    return printResult
  }

  handleOnPrint = async (type, row = {}) => {
    if (type === 'Medication' || type === 'Medications' || type === 'Patient') {
      this.connectWebSocket()

      let printResult = await this.getPrintResult(type, row)

      if (printResult) {
        const base64Result = arrayBufferToBase64(printResult)
        if (this.iswsConnect === true) {
          this.wsConnection.send(`["${base64Result}"]`)
        } else {
          notification.error({
            message: `SEMR printing tool is not running, please start it.`,
          })
        }
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
    if (data) {
      const drugLabelDetail = [
        {
          PatientName: data.patientName,
          PatientReferenceNo: data.patientReferenceNo,
          PatientAccountNo: data.patientAccountNo,
          ClinicName: data.clinicName,
          ClinicAddress: data.clinicAddress,
          ClinicOfficeNumber: data.officeNo,
          DrugName: data.name,
          ConsumptionMethod: data.instruction,
          Precaution: data.precaution,
          IssuedDate: data.issueDate,
          ExpiryDate: row.expiryDate,
          UOM: data.dispenseUOM,
          Quantity: data.dispensedQuanity,
          BatchNo:
            row.batchNo && Array.isArray(row.batchNo)
              ? row.batchNo[0]
              : row.batchNo,
        },
      ]
      return { reportId: 24, payload: { DrugLabelDetails: drugLabelDetail } }
    }
    return null
  }

  generateDrugLablesPrintSource = async (visitID, prescriptions = []) => {
    const drugLabelsDetails1 = await queryDrugLabelsDetails(visitID)
    const { data } = drugLabelsDetails1
    if (data) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map((o) => {
          const prescription = prescriptions.find((p) => p.id === o.id)
          return {
            PatientName: o.patientName,
            PatientReferenceNo: o.patientReferenceNo,
            PatientAccountNo: o.patientAccountNo,
            ClinicName: o.clinicName,
            ClinicAddress: o.clinicAddress,
            ClinicOfficeNumber: o.officeNo,
            DrugName: o.name,
            ConsumptionMethod: o.instruction,
            Precaution: o.precaution,
            IssuedDate: o.issueDate,
            ExpiryDate: prescription ? prescription.expiryDate : undefined,
            UOM: o.dispenseUOM,
            Quantity: o.dispensedQuanity,
            BatchNo:
              prescription && Array.isArray(prescription.batchNo)
                ? prescription.batchNo[0]
                : prescription.batchNo,
          }
        }),
      )
      return { reportId: 24, payload: { DrugLabelDetails: drugLabelDetail } }
    }
    return null
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
    const { onPrint, ...restProps } = this.props
    return <DispenseDetails {...restProps} onPrint={this.handleOnPrint} />
  }
}

export default PrintDrugLabelWrapper
