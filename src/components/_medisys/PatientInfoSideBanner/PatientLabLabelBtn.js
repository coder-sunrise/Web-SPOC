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
    copyNo,
    setCopyNo,
  ] = useState(1)

  const handleCopyNoChange = (value) => setCopyNo(value)

  const handlePrintClick = () => {
    const { labelPrinterSize } = clinicSettings
    let reportID = REPORT_TYPE_ID.LAB_LABEL
    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_TYPE_ID.LAB_LABEL_89MM
    }

    for (let i = 0; i < copyNo; i++) {
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
    for (let i = 0; i < copyNo; i++) {
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
        <Button color='primary' size='sm' onClick={handlePrintClick}>
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
            value={copyNo}
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
        <Button color='primary' size='sm' onClick={handlePatientLabelClick}>
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
            value={copyNo}
            onChange={handleCopyNoChange}
            style={{ width: '50px', textAlign: 'right' }}
          />
          <span style={{ fontSize: '0.75rem' }}>&nbsp;Qty</span>
        </div>
      </div>
    </SizeContainer>
  )
}

export default withWebSocket()(PatientLabLabelButton)
