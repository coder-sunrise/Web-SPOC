import React from 'react'
import { CommonTableGrid2 } from '@/components'

const columns = [
  { name: 'name', title: 'Name' },
  { name: 'userRole', title: 'User Row' },
  { name: 'mcrNo', title: 'MCR No,' },
]

const AddParticipantModal = ({ footer, onConfirm }) => {
  return (
    <div>
      <CommonTableGrid2
        rows={[]}
        columns={columns}
        FuncProps={{
          selectable: true,
        }}
      />
      {footer &&
        footer({
          confirmText: 'Confirm',
          onConfirm,
        })}
    </div>
  )
}

export default AddParticipantModal
