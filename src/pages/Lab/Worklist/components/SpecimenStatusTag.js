import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Tag, Tooltip } from 'antd'
import {
  LAB_SPECIMEN_STATUS_COLORS,
  LAB_SPECIMEN_STATUS_LABELS,
  LAB_SPECIMEN_STATUS_DESCRIPTION,
} from '@/utils/constants'

export const SpecimenStatusTag = ({ statusId }) => (
  <Tooltip title={LAB_SPECIMEN_STATUS_DESCRIPTION[`${statusId}`]}>
    <Tag
      color={LAB_SPECIMEN_STATUS_COLORS[`${statusId}`]}
      style={{ width: 80, textAlign: 'center' }}
    >
      {LAB_SPECIMEN_STATUS_LABELS[`${statusId}`]}
    </Tag>
  </Tooltip>
)
