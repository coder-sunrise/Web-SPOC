import React, { memo, useState, useEffect } from 'react'
// printjs
import printJS from 'print-js'
// react pdf
import { Document, Page, pdfjs } from 'react-pdf'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import Down from '@material-ui/icons/ArrowDropDown'
// common component
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
} from '@/components'
// utils
import {
  fetchReport,
  BASE64_MARKER,
  minScale,
  maxScale,
  defaultScreenSize,
} from './utils'
// services
import { downloadFile } from '@/services/file'
// styles
import styles from './styles'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const ReportViewer = ({ classes }) => {
  const [
    scale,
    setScale,
  ] = useState(minScale)
  const [
    screenSize,
    setScreenSize,
  ] = useState(defaultScreenSize)

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
  ] = useState(1)

  useEffect(() => {
    setScreenSize({ height: window.innerHeight, width: window.innerWidth })
    fetchReport().then((result) => setPdfData(result))
  }, [])

  const zoom = (type) => () => {
    const newScale = type === 0 ? scale + 0.25 : scale - 0.25
    if (newScale > maxScale || newScale < minScale) return

    setScale(newScale)
  }

  const changePage = (offset) => setPageNumber(pageNumber + offset)

  const onDocumentLoadSuccess = ({ numPages }) => setNumOfPages(numPages)
  const onPreviousClick = () => changePage(-1)
  const onNextClick = () => changePage(1)
  const onPrintClick = () =>
    printJS({ printable: pdfData, type: 'pdf', base64: true })
  const onExportClick = async ({ key }) => {
    let result
    let fileName = 'test'
    let fileExtension = '.pdf'
    if (key === 'export-excel') {
      result = await fetchReport('excel', true)
      fileExtension = '.xls'
    } else {
      result = await fetchReport('', true)
    }
    downloadFile(result, `${fileName}${fileExtension}`)
  }

  const onPageNumberChange = (event) => {
    const { target } = event
    const targetPage = parseInt(target.value, 10)
    if (!Number.isNaN(targetPage) && targetPage <= numOfPages && targetPage > 0)
      setPageNumber(targetPage)
  }

  return (
    <CardContainer className={classes.root} hideHeader>
      <GridContainer>
        <GridItem md={3}>
          <Button
            onClick={onPrintClick}
            size='sm'
            color='info'
            disabled={!pdfData}
          >
            Print
          </Button>
          <Dropdown
            disabled={!pdfData}
            overlay={
              <Menu onClick={onExportClick}>
                <Menu.Item key='export-pdf' id='pdf'>
                  <span>PDF</span>
                </Menu.Item>
                <Menu.Item key='export-excel' id='excel'>
                  <span>Excel</span>
                </Menu.Item>
              </Menu>
            }
            trigger={[
              'click',
            ]}
          >
            <Button color='info' size='sm' disabled={!pdfData}>
              <Down />
              Export As
            </Button>
          </Dropdown>
        </GridItem>
        <GridItem md={6} className={classes.midButtonGroup}>
          <Button
            size='sm'
            color='primary'
            className={classes.previousPageBtn}
            disabled={!pdfData || pageNumber <= 1}
            onClick={onPreviousClick}
          >
            Previous Page
          </Button>
          <div className={classes.pageNumber}>
            <NumberInput
              value={pageNumber}
              onChange={onPageNumberChange}
              prefix='Page: '
              suffix={`of ${numOfPages}`}
            />
          </div>
          <Button
            onClick={onNextClick}
            size='sm'
            color='primary'
            disabled={!pdfData || pageNumber >= numOfPages}
          >
            Next Page
          </Button>
        </GridItem>
        <GridItem md={3} className={classes.rightButtonGroup}>
          <Button
            color='primary'
            size='sm'
            disabled={!pdfData || scale === maxScale}
            onClick={zoom(0)}
          >
            <ZoomIn />
            Zoom In
          </Button>
          <Button
            color='primary'
            size='sm'
            disabled={!pdfData || scale === minScale}
            onClick={zoom(1)}
          >
            <ZoomOut />
            Zoom Out
          </Button>
        </GridItem>
      </GridContainer>
      <div className={classes.reportContainer}>
        {pdfData ? (
          <Document
            // renderMode='svg'
            file={pdfData ? `${BASE64_MARKER}${pdfData}` : ''}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<CircularProgress />}
          >
            <Page
              className={classes.page}
              pageNumber={pageNumber}
              width={screenSize - 200}
              height={screenSize - 200}
              scale={scale}
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
  )
}

export default memo(withStyles(styles, { name: 'ReportViewer' })(ReportViewer))
