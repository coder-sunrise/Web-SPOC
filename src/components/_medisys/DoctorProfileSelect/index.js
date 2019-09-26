import React from 'react'
// common component
import { CodeSelect } from '@/components'
// medisys component
import { DoctorLabel } from '@/components/_medisys'

const DoctorProfileSelect = ({ ...props }) => (
  <CodeSelect
    {...props}
    allowClear
    label='Doctor'
    code='doctorprofile'
    labelField='clinicianProfile.name'
    renderDropdown={(option) => <DoctorLabel doctor={option} />}
  />
)

export default DoctorProfileSelect
