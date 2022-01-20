import React from 'react'
import styles from 'mui-pro-jss/material-dashboard-pro-react/modalStyle.jsx'
// material ui
import { withStyles } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
// common component
import { Button, SizeContainer, Tooltip } from '@/components'
// sub component
import LabTrackingDetails from '@/pages/Widgets/LabTrackingDetails'
import { PATIENT_LAB } from '@/utils/constants'

const LabTrackingDrawer = ({ classes, theme, onClose, ...restProps }) => {
  return (
    <div style={{ width: '67vw', padding: theme.spacing(2) }}>
      <h4 style={{ display: 'inline-block' }}>Results</h4>
      <Tooltip title='Close External Tracking'>
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
        <LabTrackingDetails
          {...restProps}
          mode='integrated'
          resultType={PATIENT_LAB.CONSULTATION}
        />
      </SizeContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(LabTrackingDrawer)
