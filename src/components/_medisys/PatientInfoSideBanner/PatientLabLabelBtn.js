import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
// common components
import { Button, NumberInput, SizeContainer, Tooltip } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'

const PatientLabLabelButton = ({ handlePrint }) => {
  const reportID = 24
  const [
    copyNo,
    setCopyNo,
  ] = useState(1)

  const handleCopyNoChange = (event) => setCopyNo(event.target.value)

  const handlePrintClick = () => {
    handlePrint({ reportID, payload: {} })
  }

  return (
    <SizeContainer size='sm'>
      <div>
        <div style={{ width: '40%', display: 'inline-block', marginRight: 8 }}>
          <NumberInput
            prefix='No. Of Copy: '
            onChange={handleCopyNoChange}
            value={copyNo}
            precision={0}
          />
        </div>
        <Tooltip title='Print Patient Lab Label'>
          <Button justIcon color='primary' size='sm' onClick={handlePrintClick}>
            <Print />
          </Button>
        </Tooltip>
      </div>
    </SizeContainer>
  )
}

export default withWebSocket()(PatientLabLabelButton)
