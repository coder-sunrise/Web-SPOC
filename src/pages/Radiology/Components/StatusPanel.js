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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <span>
          Now Serving:
          <Tooltip title={nowServing || '-'}>
            <span
              style={{
                color: '#1890f8',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                left: 6,
                position: 'relative',
                fontWeight: 500,
                top: 5,
                width: 140,
              }}
            >
              {nowServing || '-'}
            </span>
          </Tooltip>
        </span>
      </div>
      <div>
        <span style={{ minWidth: 80 }}>Last Refresh:</span>
        <span style={{ color: '#1890f8', fontWeight: 500, marginLeft: 6 }}>
          {refreshDate.format('HH:mm')}
        </span>
        <Button
          color='primary'
          justIcon
          style={{
            marginLeft: 5,
          }}
          onClick={() => refreshWorklist()}
        >
          <Refresh />
        </Button>
      </div>
    </div>
  )
}
