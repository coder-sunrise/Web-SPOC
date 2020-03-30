import React, { useState, Fragment } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
// ant design
import { InputNumber } from 'antd'
// common components
import { Button, SizeContainer } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
// services
import { getRawData } from '@/services/report'

const PatientLabLabelButton = ({
  handlePrint,
  patientId,
  clinicSettings,
  sendingJob,
}) => {
  const [
    labLabelCopyNo,
    setLabLabelCopyNo,
  ] = useState(1)

  const [
    ptnLabelCopyNo,
    setPtnLabelCopyNo,
  ] = useState(1)

  const handleCopyNoChange = (value) => setLabLabelCopyNo(value)

  const handlePtnLabelCopyNoChanges = (value) => setPtnLabelCopyNo(value)

  const handlePrintClick = async () => {
    const { labelPrinterSize } = clinicSettings
    if (!Number.isInteger(labLabelCopyNo)) return

    let reportID = REPORT_ID.PATIENT_LAB_LABEL_80MM_45MM

    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_ID.PATIENT_LAB_LABEL_89MM_36MM
    }
    const data = await getRawData(reportID, { patientId })
    const payload = [
      {
        ReportId: reportID,
        ReportData: JSON.stringify({
          ...data,
        }),
      },
    ]

    for (let i = 0; i < labLabelCopyNo; i++) {
      handlePrint(JSON.stringify(payload))
    }
  }

  const handlePatientLabelClick = async () => {
    const { labelPrinterSize } = clinicSettings
    let reportID = REPORT_ID.PATIENT_LABEL_80MM_45MM

    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_ID.PATIENT_LABEL_89MM_36MM
    }

    if (!Number.isInteger(ptnLabelCopyNo)) return
    const data = await getRawData(reportID, { patientId })

    const payload = [
      {
        ReportId: reportID,
        ReportData: JSON.stringify({
          ...data,
        }),
      },
    ]

    for (let i = 0; i < ptnLabelCopyNo; i++) {
      handlePrint(JSON.stringify(payload))
    }
  }

  return (
    <div
      style={{
        marginBottom: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        color='primary'
        onClick={handlePatientLabelClick}
        disabled={!Number.isInteger(ptnLabelCopyNo)}
      >
        <Print />
      </Button>
    </div>
  )
}

export default withWebSocket()(PatientLabLabelButton)
