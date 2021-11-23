import React, { useState, useEffect, useRef, useContext } from 'react'
import Refresh from '@material-ui/icons/Refresh'
import { Button, Tooltip } from '@/components'
import WorklistContext from '../Worklist/WorklistContext'

export const StatusPanel = () => {
  const { refreshDate, filterWorklist } = useContext(WorklistContext)

  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>
            Now Serving:
          </span>
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
          <p style={{ fontWeight: 400, fontSize: '0.8rem', minWidth: 80 }}>
            Last Refresh:
          </p>
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
          onClick={() => filterWorklist()}
        >
          <Refresh />
        </Button>
      </div>
    </div>
  )
}
