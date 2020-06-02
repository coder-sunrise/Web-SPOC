import React from 'react'
// common component
import { notification, dateFormatLong } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
// utils
import { getReportContext } from '@/services/report'

import { REPORT_ID } from '@/utils/constants'

// import CONSTANTS from './constants'
import moment from 'moment'
import Main from './Main'

const WebSocketWrapper = ({ handlePrint, sendingJob, ...restProps }) => {
  const getDrugLabelDetails = (patient, item) => {
    const { expiryDate, corPrescriptionItemPrecaution = [] } = item
    const batchNo = Array.isArray(item.batchNo) ? item.batchNo[0] : item.batchNo

    let precautions = []
    corPrescriptionItemPrecaution.map((p) => {
      if (p.precaution) precautions.push(p.precaution)
    })

    return {
      PatientName: patient.name,
      PatientReferenceNo: patient.patientReferenceNo,
      PatientAccountNo: patient.patientAccountNo,
      DrugName: item.drugName,
      ConsumptionMethod: item.instruction,
      Precaution: precautions.join(' - '),
      IssuedDate: moment().format(dateFormatLong),
      ExpiryDate: expiryDate,
      UOM: item.dispenseUOMDisplayValue,
      Quantity: item.quantity,
      BatchNo: batchNo,
      CurrentPage: '1',
      TotalPage: '1',
    }
  }

  const generateInstruction = (Instruction, stepDoses) => {
    const {
      duration = 0,
      usageMethodDisplayValue,
      dosageDisplayValue,
      prescribeUOMDisplayValue,
      drugFrequencyDisplayValue,
    } = Instruction
    let durationStr = ''
    if (duration > 0) {
      durationStr = `For ${duration} day(s)`
    }
    let stepDose = `${usageMethodDisplayValue} ${dosageDisplayValue} ${prescribeUOMDisplayValue} ${drugFrequencyDisplayValue} ${durationStr}`
    if (!stepDoses) {
      stepDoses = stepDose
    } else {
      stepDoses += ` AND ${stepDose}`
    }
    return stepDoses
  }

  const generateDrugLablesPrintSource = (patient, visitID, items = []) => {
    if (items.length > 0) {
      let drugLabelDetail = []
      items.map((o) => {
        const { corPrescriptionItemInstruction: instruction } = o

        const detail = getDrugLabelDetails(patient, o)
        if (instruction && instruction.some((i) => i.stepdose === 'THEN')) {
          let tempDetails = []
          let currentPage = 0
          let instructionStr = ''
          for (let index = 0; index < instruction.length; index++) {
            instructionStr = generateInstruction(
              instruction[index],
              instructionStr,
            )
            if (
              index === instruction.length - 1 ||
              instruction[index + 1].stepdose === 'THEN'
            ) {
              currentPage += 1
              tempDetails.push({
                ...detail,
                ConsumptionMethod: instructionStr,
                CurrentPage: currentPage.toString(),
              })
              instructionStr = ''
            }
          }
          tempDetails.map((t) => {
            drugLabelDetail.push({
              ...t,
              TotalPage: tempDetails.length.toString(),
            })
          })
        } else {
          drugLabelDetail.push(detail)
        }
      })
      return drugLabelDetail
    }
    notification.warn({
      message: `No prescription found. Add prescription to print drug label.`,
    })
    return null
  }

  const getPrintResult = async (settings, patient, visitId, items) => {
    let drugLabelReportID = REPORT_ID.DRUG_LABEL_80MM_45MM
    try {
      if (settings && settings.labelPrinterSize === '8.9cmx3.6cm') {
        drugLabelReportID = REPORT_ID.DRUG_LABEL_89MM_36MM
      } else if (settings && settings.labelPrinterSize === '7.6cmx3.8cm') {
        drugLabelReportID = REPORT_ID.DRUG_LABEL_76MM_38MM
      }

      const reportContext = await getReportContext(drugLabelReportID)
      const drugLabelList = generateDrugLablesPrintSource(
        patient,
        visitId,
        items,
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
    } catch (error) {
      console.log({ error })
    }
    return null
  }
  const handlePrintDrugLabel = async ({
    patient,
    visitId,
    prescriptionItems,
  }) => {
    // console.log(patient, visitId, prescriptionItems)

    let settings = JSON.parse(localStorage.getItem('clinicSettings'))
    if (settings.autoPrintDrugLabelOnSignOff) {
      const printResult = await getPrintResult(
        settings,
        patient,
        visitId,
        prescriptionItems,
      )
      if (!printResult) return
      await handlePrint(JSON.stringify(printResult))
    }
  }

  return <Main onPrintDrugLabel={handlePrintDrugLabel} {...restProps} />
}
export default withWebSocket()(WebSocketWrapper)
