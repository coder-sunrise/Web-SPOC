import React, { memo } from 'react'

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
  return <React.Fragment>{label}</React.Fragment>
}

export default memo(DoctorLabel)
