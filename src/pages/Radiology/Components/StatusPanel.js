import React, { useState, useEffect, useRef } from 'react'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import { Button, Tooltip } from '@/components'

export const StatusPanel = () => {
  const [refreshDate, setRefreshDate] = useState(moment())

  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>
            Now Serving:
          </span>

          <Tooltip title=''>
            <span
              className='material-icons'
              style={{
                color: 'gray',
              }}
              onClick={event => {}}
            >
              history
            </span>
          </Tooltip>
        </div>
        <Tooltip title='1.0(genery)'>
          <p
            style={{
              color: '#1890f8',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: 200,
              fontSize: '0.9rem',
            }}
          >
            1.0(Takashimaya Kotohamasuri)
          </p>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', alignItems: 'end', marginLeft: 10 }}>
        <div>
          <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>Last Refresh:</p>
          <p style={{ color: '#1890f8', fontSize: '0.9rem' }}>
            {refreshDate.format('HH:mm')}
          </p>
        </div>
        <Button
          color='primary'
          justIcon
          style={{
            height: 26,
          }}
          onClick={console.log('yello')}
        >
          <Refresh />
        </Button>
      </div>
    </div>
  )
}
