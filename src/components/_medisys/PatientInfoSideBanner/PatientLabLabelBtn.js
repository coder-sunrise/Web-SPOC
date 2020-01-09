import React, { useState } from 'react'
// ant design
import { InputNumber } from 'antd'
// common components
import {
  Button,
  NumberInput,
  SizeContainer,
  OutlinedTextField,
} from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'

const PatientLabLabelButton = ({ handlePrint, patientId }) => {
  const reportID = 33
  const [
    copyNo,
    setCopyNo,
  ] = useState(1)

  const handleCopyNoChange = (value) => setCopyNo(value)

  const handlePrintClick = () => {
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
    <SizeContainer size='sm'>
      <div>
        <div style={{ display: 'inline-block', marginRight: 8 }}>
          <InputNumber
            size='small'
            min={1}
            value={copyNo}
            onChange={handleCopyNoChange}
            style={{ width: '75px' }}
          />
        </div>
        <Button color='primary' size='sm' onClick={handlePrintClick}>
          Print Patient Lab Label
        </Button>
      </div>
    </SizeContainer>
  )
}

export default withWebSocket()(PatientLabLabelButton)
