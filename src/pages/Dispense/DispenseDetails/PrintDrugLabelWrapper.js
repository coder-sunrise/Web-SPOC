import React from 'react'
import DispenseDetails from './index'
// common component
import { notification } from '@/components'
// utils
import { consultationDocumentTypes } from '@/utils/codes'
import { postPDF } from '@/services/report'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { queryDrugLabelDetails } from '@/services/dispense'

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

  handleOnPrint = async (type, row) => {
    if (type === 'Medication') {
      this.connectWebSocket()
      let drugLableSource = await this.generateDrugLablePrintSource(row)
      if (drugLableSource) {
        let printResult = await postPDF(
          drugLableSource.reportId,
          drugLableSource.payload,
        )

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
          PatientName: data.name,
          PatientReferenceNo: data.patientReferenceNo,
          PatientAccountNo: data.patientAccountNo,
          ClinicName: data.clinicName,
          ClinicAddress: data.clinicAddress,
          ClinicOfficeNumber: data.officeNo,
          DrugName: data.name,
          ConsumptionMethod: data.instruction,
          Precaution: data.precaution,
          IssuedDate: data.issuedDate,
          ExpiryDate: row.expiryDate,
          UOM: data.dispenseUOM,
          Quantity: data.dispensedQuanity,
          BatchNo: row.batchNo,
        },
      ]
      return { reportId: 24, payload: { DrugLabelDetails: drugLabelDetail } }
    }
    return null
  }

  connectWebSocket () {
    if (this.iswsConnect === false) {
      let settings = JSON.parse(sessionStorage.getItem('clinicSettings'))
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
