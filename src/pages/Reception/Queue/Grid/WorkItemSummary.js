import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { visitDoctorConsultationStatusColor } from '@/utils/codes'
import { Tooltip } from '@/components'

const WorkItemSummary = ({ visitDoctor = [], classes }) => {
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
export default withStyles(styles, { name: 'WorkItemSummary' })(WorkItemSummary)
