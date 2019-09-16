import React from 'react'
import moment from 'moment'

const FromToTime = ({ from, to }) => {
  const timeSlot = () => {
    if (!from || !to) {
      return <p>-</p>
    }
    return (
      <p>
        {moment(from, 'HH:mm:ss').format('HH:mm')}
        {' - '}
        {moment(to, 'HH:mm:ss').format('HH:mm')}
      </p>
    )
  }

  return timeSlot()
}

export default FromToTime
