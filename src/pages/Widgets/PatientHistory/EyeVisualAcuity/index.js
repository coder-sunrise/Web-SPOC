import React from 'react'

import Attachment from './Attachment'
import Form from './Form'

const EyeVisualAcuity = ({ current }) => {
  return (
    <div style={{ minWidth: 700 }}>
      <Form current={current} />
      <Attachment current={current} />
    </div>
  )
}

export default EyeVisualAcuity
