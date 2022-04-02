import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Tag } from 'antd'
import { Tooltip } from '@/components'
import {
  RADIOLOGY_WORKITEM_STATUS_TITLE,
  RADIOLOGY_WORKLIST_STATUS_COLOR,
} from '@/utils/constants'

export const RadiologyStatusTag = ({ statusId, customToolTip = '' }) => (
  <Tooltip
    title={
      customToolTip ? customToolTip : RADIOLOGY_WORKITEM_STATUS_TITLE[statusId]
    }
  >
    <Tag
      color={RADIOLOGY_WORKLIST_STATUS_COLOR[statusId]}
      style={{ width: 125, margin: 0, textAlign: 'center' }}
    >
      {RADIOLOGY_WORKITEM_STATUS_TITLE[statusId]}
    </Tag>
  </Tooltip>
)
