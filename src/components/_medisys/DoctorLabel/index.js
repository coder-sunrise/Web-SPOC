import React, { memo } from 'react'

const DoctorLabel = ({ doctor }) => {
  let label = ''
  try {
    const { clinicianProfile } = doctor
    const designation = !clinicianProfile.title ? '' : clinicianProfile.title
    label = `${designation} ${clinicianProfile.name}`
  } catch (error) {
    console.log({ error })
  }
  return <div>{label}</div>
}

export default memo(DoctorLabel)
