import React from 'react'
import router from 'umi/router'
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
import { REPORT_ID } from '@/utils/constants'
import { getAppendUrl } from '@/utils/utils'
import CONSTANTS from './constants'
import DispenseDetails from './index'

const WebSocketWrapper = ({
  handlePrint,
  selectedDrugs,
  sendingJob,
  onPrintRef,
  ...restProps
}) => {
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
      CurrentPage: drugLabel.currentPage.toString(),
      TotalPage: drugLabel.totalPage.toString(),
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
      return drugLabelDetail
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  const generateDrugLablesPrintSource = async (
    visitID,
    prescriptions = [],
    printAllDrugLabel = false,
  ) => {
    const drugLabelsDetails1 = await queryDrugLabelsDetails(visitID)
    const { data } = drugLabelsDetails1

    if (data && data.length > 0) {
      let drugLabelDetail = []
      const newdata = data.filter(
        (x) =>
          selectedDrugs.findIndex(
            (value) =>
              value.id === x.id && (printAllDrugLabel || value.selected),
          ) > -1,
      )
      newdata.map((o) => {
        let copy = selectedDrugs.find((x) => x.id === o.id).no
        for (let no = 0; no < copy; no++) {
          const prescriptionItem = prescriptions.find((p) => p.id === o.id)
          drugLabelDetail.push(getDrugLabelDetails(o, prescriptionItem))
        }
      })

      return drugLabelDetail
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  const getPrintResult = async (type, row, printAllDrugLabel) => {
    let drugLabelReportID = REPORT_ID.DRUG_LABEL_80MM_45MM
    let patientLabelReportID = REPORT_ID.PATIENT_LABEL_80MM_45MM
    try {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      if (settings && settings.labelPrinterSize === '8.9cmx3.6cm') {
        drugLabelReportID = REPORT_ID.DRUG_LABEL_89MM_36MM
        patientLabelReportID = REPORT_ID.PATIENT_LABEL_89MM_36MM
      } else if (settings && settings.labelPrinterSize === '7.6cmx3.8cm') {
        drugLabelReportID = REPORT_ID.DRUG_LABEL_76MM_38MM
        patientLabelReportID = REPORT_ID.PATIENT_LABEL_76MM_38MM
      }

      if (type === CONSTANTS.ALL_DRUG_LABEL) {
        const { dispense, values } = restProps
        const { prescription } = values
        const reportContext = await getReportContext(drugLabelReportID)
        const drugLabelList = await generateDrugLablesPrintSource(
          dispense ? dispense.visitID : values.id,
          prescription,
          printAllDrugLabel,
        )
        if (drugLabelList) {
          const payload = drugLabelList.map((drugLabel) => ({
            ReportId: drugLabelReportID,
            ReportData: JSON.stringify({
              DrugLabelDetails: [
                { ...drugLabel },
              ],
              ReportContext: reportContext,
            }),
          }))
          return payload
        }
      }

      if (type === CONSTANTS.DRUG_LABEL) {
        const reportContext = await getReportContext(drugLabelReportID)
        const drugLabel = await generateDrugLablePrintSource(row)
        if (drugLabel) {
          const payload = drugLabel.map((details) => {
            return {
              ReportId: drugLabelReportID,
              ReportData: JSON.stringify({
                DrugLabelDetails: [
                  { ...details },
                ],
                ReportContext: reportContext,
              }),
            }
          })
          return payload
        }
      }

      if (type === CONSTANTS.PATIENT_LABEL) {
        const { patient, values } = restProps

        const data = await getRawData(patientLabelReportID, {
          patientId: patient ? patient.id : values.patientProfileFK,
        })
        return [
          {
            ReportId: patientLabelReportID,
            ReportData: JSON.stringify({
              ...data,
            }),
          },
        ]
      }
    } catch (error) {
      console.log({ error })
    }
    return null
  }

  const handleOnPrint = async ({ type, row, printAllDrugLabel }) => {
    if (withoutPrintPreview.includes(type)) {
      const printResult = await getPrintResult(type, row, printAllDrugLabel)
      if (!printResult) return
      handlePrint(JSON.stringify(printResult))
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

  const handleFinalize = async () => {
    const { onFinalizeClick } = restProps
    const finalized = await onFinalizeClick()
    if (finalized) {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { autoPrintDrugLabel = false } = settings
      if (autoPrintDrugLabel === true)
        await handleOnPrint({
          type: CONSTANTS.ALL_DRUG_LABEL,
          printAllDrugLabel: true,
        })

      await restProps.dispatch({
        type: 'dispense/query',
        payload: {
          id: restProps.dispense.visitID,
          version: Date.now(),
        },
      })
      router.push(getAppendUrl({}, '/reception/queue/billing'))
    }
  }

  if (onPrintRef) onPrintRef(handleOnPrint)

  return (
    <DispenseDetails
      {...restProps}
      onFinalizeClick={handleFinalize}
      onPrint={handleOnPrint}
      sendingJob={sendingJob}
      selectedDrugs={selectedDrugs}
    />
  )
}

export default withWebSocket()(WebSocketWrapper)
