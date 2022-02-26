import React, { useState } from 'react'
// material ui
import { Link } from 'umi'
import { withStyles } from '@material-ui/core'
import { Tooltip, Button, Popover, IconButton } from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { REPORTINGDOCTOR_STATUS } from '@/utils/constants'
import { Message } from '@material-ui/icons'
import ReportingDoctorTag from './ReportingDoctorTag'

const styles = theme => ({
  panel: {
    float: 'left',
    width: 120,
    fontWeight: 400,
    letterSpacing: 'inherit',
    borderRadius: '3px',
    margin: '1px 8px 1px 0px',
    padding: '2px',
    color: 'white',
    cursor: 'hand',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const ReportingDoctorList = props => {
  const {
    medicalCheckupDoctor = [],
    classes,
    isShowMessage = false,
    isShowLabel = false,
    label,
  } = props
  return (
    <div style={{ position: 'relative' }}>
      {isShowLabel && (
        <div style={{ float: 'left', marginRight: 6, marginTop: 6 }}>
          {label}
        </div>
      )}
      {medicalCheckupDoctor.map(item => {
        return <ReportingDoctorTag {...props} medicalCheckupDoctor={item} />
      })}
    </div>
  )
}
export default withStyles(styles, { name: 'ReportingDoctorList' })(
  ReportingDoctorList,
)
