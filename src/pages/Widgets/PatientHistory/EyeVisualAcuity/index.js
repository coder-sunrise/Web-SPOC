import React from 'react'
import Form from './Form'

const EyeVisualAcuity = ({ current }) => {
  return (
    <div style={{ minWidth: 700 }}>
      <Form current={current} />
    </div>
  )
}

export default EyeVisualAcuity
