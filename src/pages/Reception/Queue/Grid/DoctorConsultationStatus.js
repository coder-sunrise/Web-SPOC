import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { visitDoctorConsultationStatusColor } from '@/utils/codes'
import { Tooltip } from '@/components'

const styles = theme => ({
  text: {
    float: 'left',
    width: 120,
    textAlign: 'center',
    fontWeight: 400,
    letterSpacing: 'inherit',
    borderRadius: '3px',
    margin: '1px 10px 1px 0px',
    padding: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const DoctorConsultationStatus = ({ visitDoctor = [], classes }) => {
  const showVisitDoctor = () => {
    return visitDoctor.map(d => {
      const title = d.title && d.title.trim().length ? `${d.title} ` : ''
      const name = `${title}${d.name}`
      const consultationColor = visitDoctorConsultationStatusColor.find(
        c => c.value === d.consultationStatus,
      )
      return (
        <Tooltip title={name}>
          <div
            className={classes.text}
            style={{
              backgroundColor: consultationColor?.color || 'Transparent',
              color: consultationColor ? 'white' : 'rgba(0, 0, 0, 0.87)',
            }}
          >
            {name}
          </div>
        </Tooltip>
      )
    })
  }
  return <div>{showVisitDoctor()}</div>
}
export default withStyles(styles, { name: 'DoctorConsultationStatus' })(
  DoctorConsultationStatus,
)
