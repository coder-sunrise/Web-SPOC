import React, { useState, useEffect } from 'react'

const SectionHeader = ({ children, style }) => (
  <div
    style={{
      fontSize: '1.0rem',
      margin: '10px 0px',
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
)

export default SectionHeader
