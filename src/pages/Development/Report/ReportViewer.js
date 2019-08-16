import React, { useState, useEffect } from 'react'
import printJS from 'print-js'
// react pdf
// import { Document, Page, pdfjs } from 'react-pdf'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// common component
import { Button, CardContainer } from '@/components'
// utils
import { axiosRequest } from '@/utils/request'

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const _arrayBufferToBase64 = (buffer) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const BASE64_MARKER = 'data:application/pdf;base64,'

const styles = () => ({
  reportContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    minHeight: '50vh',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
})

const ReportViewer = ({ classes }) => {
  const [
    pdfData,
    setPdfData,
  ] = useState(undefined)

  const [
    pageNumber,
    setPageNumber,
  ] = useState(1)

  const [
    numOfPages,
    setNumOfPages,
  ] = useState(0)

  const [
    loadingPage,
    setLoadingPage,
  ] = useState(true)

  const fetchReport = async () => {
    const response = await axiosRequest('/api/Report/QueueListing', {
      method: 'POST',
      responseType: 'arraybuffer',
      body: { ListingFrom: '2017-7-1', ListingTo: '2017-7-31' },
    })
    const { data } = response
    const base64String = _arrayBufferToBase64(data)
    setPdfData(base64String)
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => setNumOfPages(numPages)
  const changePage = (offset) => setPageNumber(pageNumber + offset)
  const onPreviousClick = () => changePage(-1)
  const onNextClick = () => changePage(1)

  const renderPageSuccess = () => {
    setLoadingPage(false)
  }

  const onPrintClick = () => {
    printJS({ printable: pdfData, type: 'pdf', base64: true })
  }

  return (
    <div>
      <Button
        onClick={onPreviousClick}
        size='sm'
        color='primary'
        disabled={pageNumber <= 1}
      >
        Previous
      </Button>
      <Button
        onClick={onNextClick}
        size='sm'
        color='primary'
        disabled={pageNumber >= numOfPages}
      >
        Next
      </Button>
      <Button onClick={onPrintClick} size='sm' color='info' disabled={!pdfData}>
        Print
      </Button>
      <CardContainer hideHeader size='sm'>
        <div className={classes.reportContainer}>
          {pdfData ? (
            <Document
              file={pdfData ? `${BASE64_MARKER}${pdfData}` : ''}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<CircularProgress />}
            >
              <Page
                pageNumber={pageNumber}
                width={700}
                scale={1.5}
                onRenderSuccess={renderPageSuccess}
              />
            </Document>
          ) : (
            <React.Fragment>
              <CircularProgress />
              <h5>Loading report...</h5>
            </React.Fragment>
          )}
        </div>
      </CardContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'ReportViewer' })(ReportViewer)
