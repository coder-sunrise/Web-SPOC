import React, { memo } from 'react'

const DoctorLabel = ({ doctor }) => {
  let label = ''
  try {
    let { clinicianProfile, doctorMCRNo } = doctor
    if (clinicianProfile === undefined) clinicianProfile = doctor

    const designation = clinicianProfile.title || ''
    const mcrNo = doctorMCRNo ? `(${doctorMCRNo})` : ''
    label = `${designation} ${clinicianProfile.name} ${mcrNo}`
  } catch (error) {
    // console.log({ error })
  }
  return <div>{label}</div>
}

export default memo(DoctorLabel)
