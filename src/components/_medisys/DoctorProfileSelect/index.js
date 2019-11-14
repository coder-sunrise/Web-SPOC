import React from 'react'
// common component
import { CodeSelect } from '@/components'
// medisys component
import { DoctorLabel } from '@/components/_medisys'

const DoctorProfileSelect = ({ label = 'Doctor', ...props }) => (
  <CodeSelect
    {...props}
    allowClear
    label={label}
    code='doctorprofile'
    remoteFilter={{
      'clinicianProfile.isActive': true,
    }}
    labelField='clinicianProfile.name'
    renderDropdown={(option) => <DoctorLabel doctor={option} />}
  />
)

export default DoctorProfileSelect
