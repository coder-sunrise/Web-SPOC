import React, { memo } from 'react'
import { Tooltip } from '@/components'

const DoctorLabel = ({ doctor, hideMCR = false }) => {
  let label = ''
  try {
    let { clinicianProfile, doctorMCRNo } = doctor
    if (clinicianProfile === undefined) clinicianProfile = doctor

    const title =
      clinicianProfile.title && clinicianProfile.title !== 'Other'
        ? `${clinicianProfile.title} `
        : ''
    let mcrNo = doctorMCRNo ? `(${doctorMCRNo})` : ''
    if (clinicianProfile.doctorProfile)
      mcrNo = `(${clinicianProfile.doctorProfile.doctorMCRNo})`

    if (hideMCR) mcrNo = ''

    label = `${title}${clinicianProfile.name} ${mcrNo}`
  } catch (error) {
    // console.log({ error })
  }
  return (
    <Tooltip title={label}>
      <span>{label}</span>
    </Tooltip>
  )
}

export default memo(DoctorLabel)
