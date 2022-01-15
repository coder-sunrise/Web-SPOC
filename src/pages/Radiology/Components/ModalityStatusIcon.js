import React from 'react'
import { Tooltip } from '@/components'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'
import { MODALITY_STATUS } from '@/utils/constants'

const ModalityStatusIcon = ({ itemModalityStatusFK }) => {
  let IconFont = createFromIconfontCN({
    scriptUrl: defaultSettings.iconfontUrl,
  })

  return (
    <div>
      <Tooltip
        title={
          itemModalityStatusFK === MODALITY_STATUS.PENDING
            ? 'Pending sending to modality'
            : 'Failed sending to modality'
        }
      >
        <span>
          <IconFont
            type={
              itemModalityStatusFK === MODALITY_STATUS.PENDING
                ? 'icon-time-circle'
                : 'icon-warning-circle-fill'
            }
            style={{
              color: 'red',
              fontSize: 20,
            }}
          />
        </span>
      </Tooltip>
    </div>
  )
}

export default ModalityStatusIcon
