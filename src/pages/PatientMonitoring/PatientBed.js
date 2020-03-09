import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer, GridContainer, GridItem, Tooltip } from '@/components'
// assets
import styles from './styles'
import patientBedIcon from '@/assets/img/patient-bed-icon.png'

const PatientBed = ({ classes, bed, onClick }) => {
  const { bedLabel, patientName, hr, resp, status, exitingBed } = bed
  const alertHeartRate = hr >= 90
  const alertRespiratoryRate = resp >= 20

  const rootCls = classnames({
    [classes.root]: true,
    [classes.warning]: status !== 'Normal',
    [classes.bedBlinker]: status !== 'Normal',
  })

  const heartRateCls = classnames({
    [classes.baseIndicator]: true,
    [classes.blink]: alertHeartRate,
    [classes.redIndicator]: alertHeartRate,
    [classes.greenIndicator]: !alertHeartRate,
  })

  const respiratortRateCls = classnames({
    [classes.baseIndicator]: true,
    [classes.blink]: alertRespiratoryRate,
    [classes.redIndicator]: alertRespiratoryRate,
    [classes.greenIndicator]: !alertRespiratoryRate,
  })

  return (
    <CardContainer hideHeader className={rootCls}>
      <GridContainer>
        <GridItem md={6} className={classes.centerize}>
          <Tooltip title='Heart Rate'>
            <div className={respiratortRateCls} />
          </Tooltip>
          <span>{hr} BPM</span>
        </GridItem>
        <GridItem md={6} className={classes.centerize}>
          <Tooltip title='Respiratory Rate'>
            <div className={heartRateCls} />
          </Tooltip>
          <span>{resp}/min</span>
        </GridItem>

        <GridItem md={12}>
          <CardContainer hideHeader>
            <div>
              <span className={classes.label}>Bed Label: </span>
              <span>{bedLabel}</span>
            </div>
            <div>
              <span className={classes.label}>Patient Name: </span>
              <span>{patientName}</span>
            </div>
          </CardContainer>
        </GridItem>
        <GridItem md={12} className={classes.centerize}>
          <div className={classes.bed} onClick={onClick}>
            <img src={patientBedIcon} alt='patient-bed' />
          </div>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles)(PatientBed)
