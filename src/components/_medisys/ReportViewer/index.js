import React, { memo, useState, useEffect } from 'react'
// printjs
import printJS from 'print-js'
// react pdf
import { Document, Page, pdfjs } from 'react-pdf'
// ant design
import { Dropdown, Menu, InputNumber } from 'antd'
// material ui
import { CircularProgress, Divider, withStyles } from '@material-ui/core'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import Down from '@material-ui/icons/ArrowDropDown'
import Print from '@material-ui/icons/Print'
// common component
import { Button, GridContainer, GridItem, NumberInput } from '@/components'
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

const ReportViewer = ({ classes, showTopDivider = true }) => {
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

  const onPageNumberChange = (value) => {
    if (value <= numOfPages && value > 0) setPageNumber(value)
  }

  return (
    <div className={classes.root}>
      {showTopDivider && <Divider className={classes.divider} />}
      <GridContainer>
        <GridItem md={3}>
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
          <Button
            onClick={onPrintClick}
            size='sm'
            justIcon
            color='info'
            disabled={!pdfData}
          >
            <Print />
          </Button>
        </GridItem>
        <GridItem md={6} className={classes.midButtonGroup}>
          <Button
            size='sm'
            justIcon
            color='primary'
            className={classes.previousPageBtn}
            disabled={!pdfData || pageNumber <= 1}
            onClick={onPreviousClick}
          >
            <ArrowLeft />
          </Button>
          <div className={classes.pageNumber}>
            <span>Page: </span>
            <InputNumber
              min={1}
              max={numOfPages}
              value={pageNumber}
              onChange={onPageNumberChange}
            />
            <span> of {numOfPages}</span>
          </div>
          <Button
            onClick={onNextClick}
            size='sm'
            justIcon
            color='primary'
            disabled={!pdfData || pageNumber >= numOfPages}
          >
            <ArrowRight />
          </Button>
        </GridItem>
        <GridItem md={3} className={classes.rightButtonGroup}>
          <Button
            color='primary'
            // size='sm'
            justIcon
            disabled={!pdfData || scale === maxScale}
            onClick={zoom(0)}
          >
            <ZoomIn />
          </Button>
          <Button
            color='primary'
            // size='sm'
            justIcon
            disabled={!pdfData || scale === minScale}
            onClick={zoom(1)}
          >
            <ZoomOut />
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
              scale={1.25}
            />
          </Document>
        ) : (
          <React.Fragment>
            <CircularProgress />
            <h5>Loading report...</h5>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default memo(withStyles(styles, { name: 'ReportViewer' })(ReportViewer))
