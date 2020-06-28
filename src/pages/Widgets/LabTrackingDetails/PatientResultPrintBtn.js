import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
import {
  MenuList,
  ClickAwayListener,
  MenuItem,
  makeStyles,
} from '@material-ui/core'
// ant design
import { InputNumber } from 'antd'
// common components
import { Button, Popper, CommonModal } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
// services
import { getRawData } from '@/services/report'
import { ReportViewer } from '@/components/_medisys'

const PatientResultButton = ({ handlePrint, clinicSettings, row }) => {
  const [
    popperOpen,
    setPopperOpen,
  ] = useState(false)

  const [
    reportViewerOpen,
    setReportViewerOpen,
  ] = useState(false)

  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)

  const openReportViewer = () => {
    setReportViewerOpen(true)
    setPopperOpen(false)
  }
  const closeReportViewer = () => setReportViewerOpen(false)

  const handlePrintLabClick = async () => {
    const { labelPrinterSize } = clinicSettings

    let reportID = REPORT_ID.PATIENT_LAB_LABEL_80MM_45MM

    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_ID.PATIENT_LAB_LABEL_89MM_36MM
    } else if (labelPrinterSize === '7.6cmx3.8cm') {
      reportID = REPORT_ID.PATIENT_LAB_LABEL_76MM_38MM
    }

    const data = await getRawData(reportID, { visitId: row.visitFK })
    const payload = [
      {
        ReportId: reportID,
        Copies: 1,
        ReportData: JSON.stringify(data),
      },
    ]

    handlePrint(JSON.stringify(payload))
  }

  return (
    <React.Fragment>
      <Popper
        open={popperOpen}
        transition
        overlay={
          <ClickAwayListener onClickAway={closePopper}>
            <MenuList role='menu'>
              <MenuItem>
                <Button color='primary' onClick={handlePrintLabClick}>
                  Patient Lab Label
                </Button>
              </MenuItem>
              <MenuItem>
                <Button color='primary' onClick={openReportViewer}>
                  Patient Result
                </Button>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        }
      >
        <Button color='primary' justIcon onClick={openPopper}>
          <Print />
        </Button>
      </Popper>

      <CommonModal
        open={reportViewerOpen}
        onClose={closeReportViewer}
        title='Patient Result'
        maxWidth='lg'
      >
        <ReportViewer
          reportID={53}
          reportParameters={{ labTrackingDetailsId: row.id }}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default withWebSocket()(PatientResultButton)
