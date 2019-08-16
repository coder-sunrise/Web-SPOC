import React from 'react'
import moment from 'moment'

const FromToTime = ({ from, to }) => {
  return (
    <p>
      {moment(from, 'HH:mm:ss').format('HH:mm')}
      {' - '}
      {moment(to, 'HH:mm:ss').format('HH:mm')}
    </p>
  )
}

export default FromToTime
