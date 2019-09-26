import React, { memo } from 'react'

const DoctorLabel = ({ doctor }) => {
  let label = ''
  try {
    let { clinicianProfile, doctorMCRNo } = doctor
    if (clinicianProfile === undefined) clinicianProfile = doctor

    const designation = !clinicianProfile.title ? '' : clinicianProfile.title
    const mcrNo = doctorMCRNo ? `(${doctorMCRNo})` : ''
    label = `${designation} ${clinicianProfile.name} ${mcrNo}`
  } catch (error) {
    // console.log({ error })
  }
  return <React.Fragment>{label}</React.Fragment>
}

export default memo(DoctorLabel)
