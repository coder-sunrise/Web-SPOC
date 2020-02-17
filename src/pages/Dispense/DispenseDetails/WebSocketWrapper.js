import React from 'react'
import DispenseDetails from './index'
// common component
import { notification } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
// utils
import { consultationDocumentTypes } from '@/utils/codes'
import { getReportContext, getRawData } from '@/services/report'
import {
  queryDrugLabelDetails,
  queryDrugLabelsDetails,
} from '@/services/dispense'
import CONSTANTS from './constants'
import { PRINTING_TOOL_REPORT_ID, REPORT_ID } from '@/utils/constants'

const WebSocketWrapper = ({ handlePrint, sendingJob, ...restProps }) => {
  const withoutPrintPreview = [
    CONSTANTS.ALL_DRUG_LABEL,
    CONSTANTS.DRUG_LABEL,
    CONSTANTS.PATIENT_LABEL,
  ]

  const getDrugLabelDetails = (drugLabel, prescripationItem) => {
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

  const generateDrugLablePrintSource = async (row) => {
    const drugLabelDetails1 = await queryDrugLabelDetails(row.id)
    const { data } = drugLabelDetails1
    if (data && data.length > 0) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map((o) => {
          return getDrugLabelDetails(o, row)
        }),
      )
      return { DrugLabelDetails: drugLabelDetail }
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  const generateDrugLablesPrintSource = async (visitID, prescriptions = []) => {
    const drugLabelsDetails1 = await queryDrugLabelsDetails(visitID)
    const { data } = drugLabelsDetails1
    if (data && data.length > 0) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map((o) => {
          const prescriptionItem = prescriptions.find((p) => p.id === o.id)
          return getDrugLabelDetails(o, prescriptionItem)
        }),
      )
      return { DrugLabelDetails: drugLabelDetail }
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  const getPrintResult = async (type, row) => {
    let drugLabelReportID = REPORT_ID.DRUG_LABEL_80MM_45MM
    let printingToolDrugLabelID = PRINTING_TOOL_REPORT_ID.DRUG_LABEL_80MM_45MM
    let patientLabelReportID = REPORT_ID.PATIENT_LABEL_80MM_45MM
    let printingToolPatientLabelID =
      PRINTING_TOOL_REPORT_ID.PATIENT_LABEL_80MM_45MM

    try {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      if (settings.labelPrinterSize === '8.9cmx3.6cm') {
        // drugLabelReportID = PRINTING_TOOL_REPORT_ID.DRUG_LABEL_89MM_36MM
        // patientLabelReportID = PRINTING_TOOL_REPORT_ID.PATIENT_LABEL_89MM_36MM
        drugLabelReportID = REPORT_ID.DRUG_LABEL_89MM_36MM
        patientLabelReportID = REPORT_ID.PATIENT_LABEL_89MM_36MM
        // TODO: hard coded printing tool report id
        printingToolDrugLabelID = PRINTING_TOOL_REPORT_ID.DRUG_LABEL_80MM_45MM
        printingToolPatientLabelID =
          PRINTING_TOOL_REPORT_ID.PATIENT_LABEL_80MM_45MM
      }

      if (type === CONSTANTS.ALL_DRUG_LABEL) {
        const { dispense, values } = restProps
        const { prescription } = values
        const reportContext = await getReportContext(drugLabelReportID)
        const data = await generateDrugLablesPrintSource(
          dispense ? dispense.visitID : values.id,
          prescription,
        )
        if (data) {
          return {
            ReportId: printingToolDrugLabelID,
            ReportData: { ...data, ReportContext: reportContext },
          }
        }
      }

      if (type === CONSTANTS.DRUG_LABEL) {
        const reportContext = await getReportContext(drugLabelReportID)
        const data = await generateDrugLablePrintSource(row)
        if (data) {
          return {
            ReportId: printingToolDrugLabelID,
            ReportData: { ...data, ReportContext: reportContext },
          }
        }
      }

      if (type === CONSTANTS.PATIENT_LABEL) {
        const { patient, values } = restProps

        const data = await getRawData(patientLabelReportID, {
          patientId: patient ? patient.id : values.patientProfileFK,
        })
        return {
          ReportId: printingToolPatientLabelID,
          ReportData: {
            ...data,
          },
        }
      }
    } catch (error) {
      console.log({ error })
    }
    return null
  }

  const handleOnPrint = async ({ type, row }) => {
    if (withoutPrintPreview.includes(type)) {
      const printResult = await getPrintResult(type, row)
      if (!printResult) return
      console.log({ printResult, stringified: JSON.stringify(printResult) })

      handlePrint(
        JSON.stringify([
          printResult,
        ]),
      )
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
      restProps.dispatch({
        type: 'report/updateState',
        payload: {
          reportTypeID: downloadConfig.id,
          reportParameters: {
            ...reportParameters,
            isSaved: true,
          },
        },
      })
    }
  }

  return (
    <DispenseDetails
      {...restProps}
      onPrint={handleOnPrint}
      sendingJob={sendingJob}
    />
  )
}

export default withWebSocket()(WebSocketWrapper)
