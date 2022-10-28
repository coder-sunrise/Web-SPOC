import React from 'react'
// common component
import { CodeSelect } from '@/components'
// medisys component
import { DoctorLabel } from '@/components/_medisys'

const DoctorProfileSelect = ({
  label = 'Optometrist',
  clinicRole = 'opto',
  ...props
}) => (
  <CodeSelect
    {...props}
    allowClear
    label={label}
    code='doctorprofile'
    remoteFilter={{
      'clinicianProfile.isActive': true,
    }}
    labelField='clinicianProfile.name'
    localFilter={user => {
      let {
        clinicianProfile: {
          userProfile: {
            role: { clinicRoleFK },
          },
        },
      } = user
      switch (clinicRole) {
        case 'stu':
          return clinicRoleFK == 3
        case 'opto':
          return clinicRoleFK == 1
        default:
          return clinicRoleFK == 1 || clinicRoleFK == 3
      }
    }}
    renderDropdown={option => <DoctorLabel doctor={option} />}
  />
)

export default DoctorProfileSelect
