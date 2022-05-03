import React from 'react'
import { history } from 'umi'
// common component
import { notification } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
// utils
import { consultationDocumentTypes } from '@/utils/codes'
import { getReportContext, getRawData } from '@/services/report'
import service from '@/services/dispense'
import { REPORT_ID } from '@/utils/constants'
import { getAppendUrl } from '@/utils/utils'
import CONSTANTS from './constants'
import DispenseDetails from './index'
import _ from 'lodash'

const { queryDrugLabelDetails, queryDrugLabelsDetails } = service
const WebSocketWrapper = ({
  handlePrint,
  selectedDrugs,
  selectedLanguage,
  currentDrugToPrint,
  sendingJob,
  onPrintRef,
  onDrugLabelSelectionClose,
  ...restProps
}) => {
  const withoutPrintPreview = [
    CONSTANTS.ALL_DRUG_LABEL,
    CONSTANTS.DRUG_LABEL,
    CONSTANTS.PATIENT_LABEL,
    CONSTANTS.LAB_LABEL,
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

  const generateDrugLablePrintSource = async row => {
    const drugLabelDetails1 = await queryDrugLabelDetails(row.id)
    const { data } = drugLabelDetails1
    if (data && data.length > 0) {
      let drugLabelDetail = []
      drugLabelDetail = drugLabelDetail.concat(
        data.map(o => {
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
    packageItem = [],
    printAllDrugLabel = false,
  ) => {
    const drugLabelsDetails1 = await queryDrugLabelsDetails(visitID)
    const { data } = drugLabelsDetails1

    if (data && data.length > 0) {
      let drugLabelDetail = []
      const newdata = data.filter(
        x =>
          selectedDrugs.findIndex(
            value => value.id === x.id && (printAllDrugLabel || value.selected),
          ) > -1,
      )
      newdata.map(o => {
        let copy = selectedDrugs.find(x => x.id === o.id).no
        for (let no = 0; no < copy; no++) {
          let prescriptionItem = prescriptions.find(p => p.id === o.id)
          if (prescriptionItem === undefined)
            prescriptionItem = packageItem.find(p => p.id === o.id)
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

  const getPrintResult = async (type, copies = 1) => {
    if (!Number.isInteger(copies)) return
    let patientLabelReportID = REPORT_ID.PATIENT_LABEL_80MM_45MM
    try {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      if (settings && settings.labelPrinterSize === '8.9cmx3.6cm') {
        patientLabelReportID = REPORT_ID.PATIENT_LABEL_89MM_36MM
      } else if (settings && settings.labelPrinterSize === '7.6cmx3.8cm') {
        patientLabelReportID = REPORT_ID.PATIENT_LABEL_76MM_38MM
      }

      if (type === CONSTANTS.PATIENT_LABEL) {
        const { patient, values } = restProps
        const data = await getRawData(patientLabelReportID, {
          patientId: patient ? patient.entity.id : values.patientProfileFK,
        })
        return [
          {
            ReportId: patientLabelReportID,
            Copies: copies,
            ReportData: JSON.stringify({
              ...data,
            }),
          },
        ]
      }
      if (type === CONSTANTS.LAB_LABEL) {
        const { patient, values } = restProps
        // hard code for JGH
        let reportID = REPORT_ID.PATIENT_LAB_LABEL_80MM_45MM
        const patientId = patient ? patient.entity.id : values.patientProfileFK
        const data = await getRawData(reportID, { patientId })
        return [
          {
            ReportId: reportID,
            Copies: copies,
            ReportData: JSON.stringify(data),
          },
        ]
      }
    } catch (error) {
      console.log({ error })
    }
    return null
  }
  // Click Confirm in drug lable selector will trigger this
  const handleOnPrint = async ({
    type,
    row,
    printAllDrugLabel,
    printData,
    copies,
  }) => {
    if (withoutPrintPreview.includes(type)) {
      var filter = [
        CONSTANTS.PATIENT_LABEL,
        CONSTANTS.LAB_LABEL,
        CONSTANTS.ALL_DRUG_LABEL,
      ]
      if (filter.includes(type)) {
        let printResult = await getPrintResult(type, copies)
        if (printData && printData.length > 0)
          printResult = (printResult || []).concat(printData)

        if (!printResult || printResult.length <= 0) return
        await handlePrint(JSON.stringify(printResult))
      }
    } else {
      const documentType = consultationDocumentTypes.find(
        o =>
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

  const handleFinalize = async (voidPayment = false, voidReason = '') => {
    const { onFinalizeClick } = restProps
    const finalized = await onFinalizeClick(voidPayment, voidReason)
    if (finalized) {
      let settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { autoPrintDrugLabelOnFinalize = false } = settings
      if (autoPrintDrugLabelOnFinalize === true)
        await handleOnPrint({
          type: CONSTANTS.ALL_DRUG_LABEL,
          printAllDrugLabel: true,
        })
      history.push(getAppendUrl({}, '/reception/queue/billing'))
    }
  }

  if (onPrintRef) onPrintRef(handleOnPrint)
  return (
    <DispenseDetails
      {...restProps}
      onFinalizeClick={handleFinalize}
      onDrugLabelSelectionClose={onDrugLabelSelectionClose}
      onPrint={handleOnPrint}
      sendingJob={sendingJob}
      selectedDrugs={selectedDrugs}
      selectedLanguage={selectedLanguage}
      currentDrugToPrint={currentDrugToPrint}
    />
  )
}

export default withWebSocket()(WebSocketWrapper)
