import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
// formik
import { withFormik } from 'formik'
// ant design
import { InputNumber } from 'antd'
// common components
import { Button, NumberInput, SizeContainer, Tooltip } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'

const PatientLabLabelButton = ({ handlePrint, patientId }) => {
  const reportID = 33
  const [
    copyNo,
    setCopyNo,
  ] = useState(1)

  const handleCopyNoChange = (event) => setCopyNo(event.target.value)

  // const handleCopyNoChange = (value) => setCopyNo(value)

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
    <SizeContainer size='md'>
      <div style={{ marginBottom: 8 }}>
        <Button color='primary' size='sm' onClick={handlePrintClick}>
          Print Patient Lab Label
        </Button>
        <div
          style={{
            // width: 100,
            display: 'inline-block',
            marginRight: 8,
          }}
        >
          <span>Copy:&nbsp;</span>
          <InputNumber
            size='small'
            min={1}
            value={copyNo}
            onChange={handleCopyNoChange}
            style={{ width: '50px', textAlign: 'right' }}
          />
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
