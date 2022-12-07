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
  const [popperOpen, setPopperOpen] = useState(false)

  const [reportViewerOpen, setReportViewerOpen] = useState(false)

  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)

  const openReportViewer = () => {
    setReportViewerOpen(true)
    setPopperOpen(false)
  }
  const closeReportViewer = () => setReportViewerOpen(false)

  return (
    <React.Fragment>
      <Popper
        open={popperOpen}
        transition
        overlay={
          <ClickAwayListener onClickAway={closePopper}>
            <MenuList role='menu'>
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
          reportParameters={{ externalTrackingId: row.id }}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default PatientResultButton
