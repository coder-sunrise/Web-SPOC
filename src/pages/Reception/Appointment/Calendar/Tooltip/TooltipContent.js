import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
import { AccessTime } from '@material-ui/icons'
// dx-react-scheduler-material-ui
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui'
// custom component
import {
  OutlinedTextField,
  TextField,
  GridContainer,
  GridItem,
} from '@/components'

const styles = (theme) => ({
  timeText: {
    ...theme.typography.body2,
    fontSize: '1.15rem',
    display: 'inline-block',
  },
  textCenter: {
    textAlign: 'center',
  },
})

const TooltipContent = ({ classes, appointmentData, children }) => {
  return (
    <AppointmentTooltip.Content>
      <GridContainer direction='column'>
        <GridItem container spacing={8} alignItems='center'>
          <GridItem xs md={2} className={classnames(classes.textCenter)}>
            <AccessTime />
          </GridItem>
          <GridItem xs md={10}>
            <div className={classnames(classes.timeText)}>
              {`${appointmentData.startTime} -- ${appointmentData.endTime}`}
            </div>
          </GridItem>
        </GridItem>
        <GridItem xs md={12}>
          <TextField
            value={appointmentData.patientName}
            label={formatMessage({ id: 'reception.appt.form.patientName' })}
            disabled
          />
        </GridItem>
        <GridItem xs md={12}>
          <TextField
            value={appointmentData.contactNo}
            label={formatMessage({ id: 'reception.appt.form.contactNo' })}
            disabled
          />
        </GridItem>
        <GridItem xs md={12}>
          <OutlinedTextField
            value={appointmentData.remarks}
            label={formatMessage({ id: 'reception.appt.form.remarks' })}
            multiline
            rowsMax={4}
            disabled
          />
        </GridItem>
        <GridItem xs md={12}>
          <TextField
            disabled
            value={appointmentData.doctor}
            label={formatMessage({ id: 'reception.appt.form.doctor' })}
          />
        </GridItem>
      </GridContainer>
    </AppointmentTooltip.Content>
  )
}

export default withStyles(styles, { name: 'TooltipContent', withTheme: true })(
  TooltipContent,
)
