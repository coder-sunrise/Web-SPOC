import React, { useState, useEffect } from 'react'
// material ui
import Delete from '@material-ui/icons/Delete'
import Close from '@material-ui/icons/Close'

// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  CommonModal,
} from '@/components'
// sub components
import Grid from './Grid'
import { getImagePreview } from '@/services/file'

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

  const [
    imageData,
    setImageData,
  ] = useState(null)

  const getImage = async () => {
    const { data } = await getImagePreview(367)
    const blobUrl = window.URL.createObjectURL(
      new Blob([
        data,
      ]),
    )
    console.log({ blobUrl, data })
    setImageData(blobUrl)
  }
  useEffect(() => {
    getImage()
  }, [])

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
      <Button justIcon key='close' aria-label='Close' color='transparent'>
        <Close />
      </Button>
      <CommonModal
        open={showCannedText}
        onClose={toggleCannedText}
        title='Canned Text'
      >
        <Grid handleAddCannedText={handleSaveCannedText} />
      </CommonModal>

      <GridContainer>
        <GridItem md={3}>
          <img src={imageData} alt='test' width={100} height={100} />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default CannedText
