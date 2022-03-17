import React, { memo } from 'react'
import { Tooltip } from '@/components'

const DoctorLabel = ({ doctor, type = 'name', hideMCR = true }) => {
  let label = ''
  try {
    let { clinicianProfile, doctorMCRNo } = doctor
    if (clinicianProfile === undefined) clinicianProfile = doctor

    const title =
      clinicianProfile.title && clinicianProfile.title !== 'Other'
        ? `${clinicianProfile.title} `
        : ''
    let mcrNo = ''
    if (!hideMCR) {
      mcrNo = doctorMCRNo ? `(${doctorMCRNo})` : ''
      if (clinicianProfile.doctorProfile)
        mcrNo = `(${clinicianProfile.doctorProfile.doctorMCRNo})`
    }
    let doctorName = clinicianProfile[type]
    if (type == 'shortName' && !doctorName) {
      doctorName = clinicianProfile['name']
    }
    label = `${title}${doctorName} ${mcrNo}`
  } catch (error) {
    // console.log({ error })
  }
  return <span>{label}</span>
}

export default memo(DoctorLabel)
