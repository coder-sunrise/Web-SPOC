import React, { Component, useState } from 'react'
import Print from '@material-ui/icons/Print'
import { Button, Tooltip, CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

export default function PrintPrescription({
  visitFK,
  id: pharmacyWorkitemId,
  patientProfileFK,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [showReportViwer, setshowReportViwer] = useState(false)
  const toggleReportViwer = () => {
    setshowReportViwer(!showReportViwer)
  }
  const prescription = () => {
    handleClose()
    toggleReportViwer()
  }
  const blueColor = '#1890f8'
  return (
    <span>
      <Tooltip title='Print Label/Prescription'>
        <Button
          justIcon
          color='transparent'
          style={{
            marginLeft: 10,
          }}
          id='pp-positioned-button'
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Print style={{ color: blueColor }} />
        </Button>
      </Tooltip>
      <Menu
        id='pp-positioned-menu'
        aria-labelledby='pp-positioned-button'
        disableAutoFocusItem
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: -30,
        }}
      >
        <MenuItem onClick={handleClose}>Drug Label</MenuItem>
        <MenuItem onClick={handleClose}>Drug Summary Label</MenuItem>
        <MenuItem onClick={handleClose}>Patient Label</MenuItem>
        <MenuItem onClick={handleClose}>Patient Info Leaflet</MenuItem>
        <MenuItem onClick={prescription}>Prescription</MenuItem>
      </Menu>

      <CommonModal
        open={showReportViwer}
        onClose={toggleReportViwer}
        title='Prescription'
        maxWidth='lg'
      >
        <ReportViewer
          showTopDivider={false}
          reportID={83}
          reportParameters={{ visitFK, pharmacyWorkitemId, patientProfileFK }}
          defaultScale={1.5}
        />
      </CommonModal>
    </span>
  )
}
