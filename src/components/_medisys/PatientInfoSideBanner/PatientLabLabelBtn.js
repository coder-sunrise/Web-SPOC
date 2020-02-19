import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
// ant design
import { InputNumber } from 'antd'
// common components
import { Button, SizeContainer } from '@/components'
import { REPORT_TYPE_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'

const PatientLabLabelButton = ({ handlePrint, patientId, clinicSettings }) => {
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

  const handlePrintClick = () => {
    const { labelPrinterSize } = clinicSettings
    if (!Number.isInteger(labLabelCopyNo)) return

    let reportID = REPORT_TYPE_ID.LAB_LABEL
    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_TYPE_ID.LAB_LABEL_89MM
    }
    for (let i = 0; i < labLabelCopyNo; i++) {
      handlePrint({
        reportID,
        payload: {
          patientId,
        },
      })
    }
  }

  const handlePatientLabelClick = () => {
    let reportID = REPORT_TYPE_ID.PATIENT_LABEL

    if (!Number.isInteger(ptnLabelCopyNo)) return
    for (let i = 0; i < ptnLabelCopyNo; i++) {
      handlePrint({
        reportID,
        payload: {
          patientId,
        },
      })
    }
  }

  return (
    <SizeContainer size='md'>
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
          size='sm'
          onClick={handlePrintClick}
          disabled={!Number.isInteger(labLabelCopyNo)}
        >
          <Print />
          Lab Label
        </Button>
        <div
          style={{
            display: 'inline-block',
            marginRight: 8,
          }}
        >
          <InputNumber
            size='small'
            min={1}
            max={10}
            value={labLabelCopyNo}
            onChange={handleCopyNoChange}
            style={{ width: '50px', textAlign: 'right' }}
          />
          <span style={{ fontSize: '0.75rem' }}>&nbsp;Qty</span>
        </div>
      </div>
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
          size='sm'
          onClick={handlePatientLabelClick}
          disabled={!Number.isInteger(ptnLabelCopyNo)}
        >
          <Print />
          Patient Label
        </Button>
        <div
          style={{
            display: 'inline-block',
            marginRight: 8,
          }}
        >
          <InputNumber
            size='small'
            min={1}
            max={10}
            value={ptnLabelCopyNo}
            onChange={handlePtnLabelCopyNoChanges}
            style={{ width: '50px', textAlign: 'right' }}
          />
          <span style={{ fontSize: '0.75rem' }}>&nbsp;Qty</span>
        </div>
      </div>
    </SizeContainer>
  )
}

export default withWebSocket()(PatientLabLabelButton)
