import React from 'react'
import styles from 'mui-pro-jss/material-dashboard-pro-react/modalStyle.jsx'
// material ui
import { withStyles } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
// common component
import { Button, SizeContainer, Tooltip } from '@/components'
// sub component
import PatientHistory from '@/pages/Widgets/PatientHistory'

const PatientHistoryDrawer = ({ classes, theme, onClose, ...restProps }) => {
  return (
    <div style={{ width: '67vw', padding: theme.spacing(2) }}>
      <h4 style={{ display: 'inline-block' }}>Patient History</h4>
      <Tooltip title='Close Patient History'>
        <Button
          justIcon
          className={classes.modalCloseButton}
          key='close'
          authority='none'
          aria-label='Close'
          color='transparent'
          onClick={onClose}
        >
          <Close className={classes.modalClose} />
        </Button>
      </Tooltip>
      <SizeContainer size='sm'>
        <PatientHistory {...restProps} mode='integrated' />
      </SizeContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(PatientHistoryDrawer)
