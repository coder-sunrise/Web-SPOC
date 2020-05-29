import React, { useState, useEffect } from 'react'

const options = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}

const Clock = () => {
  const [
    time,
    setTime,
  ] = useState(new Date().toLocaleTimeString('en-us', options))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(() => new Date().toLocaleTimeString('en-us', options))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        fontSize: '1.5vw',
        lineHeight: '10vh',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {time}
    </div>
  )
}

export default Clock
