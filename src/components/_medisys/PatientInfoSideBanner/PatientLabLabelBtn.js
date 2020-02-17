import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
// ant design
import { InputNumber } from 'antd'
// common components
import { Button, SizeContainer } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
// services
import { getPDF } from '@/services/report'

const labLabelReport = 33
const labLabelReport89mm = 34
const PatientLabLabelButton = ({
  handlePrint,
  patientId,
  clinicSettings,
  sendingJob,
}) => {
  const [
    copyNo,
    setCopyNo,
  ] = useState(1)

  // const handleCopyNoChange = (event) => setCopyNo(event.target.value)

  const handleCopyNoChange = (value) => setCopyNo(value)

  const handlePrintClick = async () => {
    const { labelPrinterSize } = clinicSettings
    let reportID = labLabelReport
    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = labLabelReport89mm
    }
    const payload = {
      patientId,
    }
    const pdfResult = await getPDF(reportID, payload)
    for (let i = 0; i < copyNo; i++) {
      handlePrint(pdfResult)
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
          disabled={sendingJob}
        >
          {sendingJob ? <Refresh className='spin-custom' /> : <Print />}
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
          {/* <NumberInput
            min={1}
            prefix='Copy:'
            onChange={handleCopyNoChange}
            value={copyNo}
            precision={0}
          /> */}
        </div>
      </div>
    </SizeContainer>
  )
}

export default withWebSocket()(PatientLabLabelButton)
