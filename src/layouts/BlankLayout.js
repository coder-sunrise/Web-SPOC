import React, { useEffect } from 'react'
import { initStream } from '@/utils/realtime'

export default ({ children }) => {
  useEffect(() => {
    initStream()
  }, [])
  return <div>{children}</div>
}
