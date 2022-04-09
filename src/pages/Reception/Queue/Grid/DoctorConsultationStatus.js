import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { visitDoctorConsultationStatusColor } from '@/utils/codes'
import { Tooltip } from '@/components'

const styles = theme => ({
  text: {
    float: 'left',
    maxWidth: 120,
    letterSpacing: 'inherit',
    borderRadius: '3px',
    margin: '1px 8px 1px 0px',
    padding: '2px 6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const DoctorConsultationStatus = ({
  type = 'name',
  visitDoctor = [],
  classes,
}) => {
  const showVisitDoctor = () => {
    return visitDoctor.map(d => {
      const title = d.title && d.title.trim().length ? `${d.title} ` : ''
      const name = `${title}${type === 'name' ? d.name : d.shortName || d.name}`
      const fullName = `${title}${d.name}`
      const consultationColor = visitDoctorConsultationStatusColor.find(
        c => c.value === d.consultationStatus,
      )
      return (
        <Tooltip title={fullName}>
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
