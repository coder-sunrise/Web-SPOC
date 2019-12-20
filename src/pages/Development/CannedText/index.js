import React, { useState } from 'react'
// material ui
import Delete from '@material-ui/icons/Delete'
// common components
import { Button, CardContainer, CommonModal } from '@/components'
// sub components
import Grid from './Grid'

const generateData = () => {
  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      id: i,
      title: `Test ${i}`,
      cannedText: `Test canned text ${i}`,
    })
  }
  return data
}

const CannedText = () => {
  const [
    showCannedText,
    setShowCannedText,
  ] = useState(false)

  const toggleCannedText = () => setShowCannedText(!showCannedText)

  const handleSaveCannedText = (selectedRows) => {
    console.log({ selectedRows })
    toggleCannedText()
  }

  return (
    <CardContainer hideHeader>
      <h4>Canned Text</h4>
      <Button color='primary' onClick={toggleCannedText}>
        Toggle Canned Text
      </Button>
      <CommonModal
        open={showCannedText}
        onClose={toggleCannedText}
        title='Canned Text'
      >
        <Grid handleAddCannedText={handleSaveCannedText} />
      </CommonModal>
    </CardContainer>
  )
}

export default CannedText
