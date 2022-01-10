import React, { useCallback, useMemo } from 'react'
import { Tag, Tooltip } from 'antd'
import { useVisitTypes } from '@/utils/hooks'
import { VISIT_TYPE } from '@/utils/constants'

const visitTypeColors = {
  1: 'purple',
  2: 'blue',
  3: 'volcano',
  4: 'magenta',
}

const VisitTypeTag = ({ type }) => {
  const visitTypes = useVisitTypes()

  const currentVisitType = visitTypes.find(item => item.id === type)

  return (
    <Tooltip title={currentVisitType?.name}>
      <Tag color={visitTypeColors[type]}>{currentVisitType?.code}</Tag>
    </Tooltip>
  )
}

export default VisitTypeTag
