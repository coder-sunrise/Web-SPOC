import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { GridItem, GridContainer } from '@/components'

const styles = (theme) => ({
  column: {
    margin: theme.spacing(1),
    maxWidth: '8%',
    wordWrap: 'break-word',
  },
})

const PrintPreviewRow = ({
  row: {
    patientName,
    patientAccountNo,
    patientContactNo,
    appointmentDate,
    appointmentRemarks,
    appointmentStatusFk,
    bookBy,
    bookOn,
    rowspan,
  },
  classes,
}) => {
  return (
    <tr>
      <tr>
        <h4>{appointmentDate}</h4>{' '}
      </tr>

      {/* {appointment_Resources.map(({ startTime, roomFk, clinicianFK }, idx) => {
        if (idx === 0) {
          return (
            <Fragment>
              <td className={classes.column}>{patientName}</td>
              <td className={classes.column}>{patientAccountNo}</td>
              <td className={classes.column}>{patientContactNo}</td>
              <td className={classes.column}>{appointmentRemarks}</td>
              <td className={classes.column}>{startTime}</td>
              <td className={classes.column}>{roomFk}</td>
              <td className={classes.column}>{clinicianFK}</td>
              <td className={classes.column}>{appointmentStatusFk}</td>
            </Fragment>
          )
        }

        return (
          <Fragment>
            <td className={classes.column} />
            <td className={classes.column} />
            <td className={classes.column} />
            <td className={classes.column} />
            <td className={classes.column}>{startTime}</td>
            <td className={classes.column}>{roomFk}</td>
            <td className={classes.column}>{clinicianFK}</td>
            <td className={classes.column}>{appointmentStatusFk}</td>
          </Fragment>
        )
      })} */}
    </tr>
  )
}

export default withStyles(styles, { withTheme: true })(PrintPreviewRow)
