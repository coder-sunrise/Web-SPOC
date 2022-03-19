import React, { useCallback, useMemo } from 'react'
import { Tag } from 'antd'
import { Tooltip } from '@/components'
import { useVisitTypes } from '@/utils/hooks'
import { VISIT_TYPE } from '@/utils/constants'

const visitTypeColors = {
  1: 'purple',
  2: 'blue',
  3: 'volcano',
  4: 'green',
}

const VisitTypeTag = ({ type }) => {
  const visitTypes = useVisitTypes(true)

  const currentVisitType = visitTypes.find(item => item.id === type)

  return (
    <Tooltip title={currentVisitType?.name}>
      <Tag
        style={{ width: 40, textAlign: 'center' }}
        color={visitTypeColors[type]}
      >
        {currentVisitType?.code}
      </Tag>
    </Tooltip>
  )
}

export default VisitTypeTag
