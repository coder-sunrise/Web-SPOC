import React, { useState, useEffect, useRef, useContext } from 'react'
import Refresh from '@material-ui/icons/Refresh'
import { Button, Tooltip } from '@/components'
import WorklistContext from '../Worklist/WorklistContext'

export const StatusPanel = () => {
  const { refreshDate, refreshWorklist, radiologyQueueCallList } = useContext(
    WorklistContext,
  )
  let nowServing = undefined
  if (radiologyQueueCallList.length > 0) {
    nowServing = `${radiologyQueueCallList?.[0]?.qNo}.0 (${radiologyQueueCallList?.[0]?.patientName})`
  }

  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>
            Now Serving:
          </span>
        </div>
        <Tooltip title={nowServing || '-'}>
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
            {nowServing || '-'}
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
          onClick={() => refreshWorklist()}
        >
          <Refresh />
        </Button>
      </div>
    </div>
  )
}
