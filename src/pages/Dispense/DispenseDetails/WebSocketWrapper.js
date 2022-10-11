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

const WebSocketWrapper = ({
  handlePrint,
  selectedDrugs,
  selectedLanguage,
  sendingJob,
  onPrintRef,
  ...restProps
}) => {
  const withoutPrintPreview = [CONSTANTS.PATIENT_LABEL]

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
  const handleOnPrint = async ({ type, row, printData, copies }) => {
    if (withoutPrintPreview.includes(type)) {
      var filter = [CONSTANTS.PATIENT_LABEL]
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
      history.push(getAppendUrl({}, '/reception/queue/billing'))
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
      selectedLanguage={selectedLanguage}
    />
  )
}

export default withWebSocket()(WebSocketWrapper)
