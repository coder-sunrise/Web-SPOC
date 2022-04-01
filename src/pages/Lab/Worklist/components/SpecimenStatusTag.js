import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Tag } from 'antd'
import { Tooltip } from '@/components'
import {
  LAB_SPECIMEN_STATUS_COLORS,
  LAB_SPECIMEN_STATUS_LABELS,
  LAB_SPECIMEN_STATUS_DESCRIPTION,
} from '@/utils/constants'

export const SpecimenStatusTag = ({ statusId, customToolTip = '' }) => (
         <Tooltip
           title={
             customToolTip
               ? customToolTip
               : LAB_SPECIMEN_STATUS_DESCRIPTION[statusId]
           }
         >
           <Tag
             color={LAB_SPECIMEN_STATUS_COLORS[statusId]}
             style={{ width: 80, margin: 0, textAlign: 'center' }}
           >
             {LAB_SPECIMEN_STATUS_LABELS[statusId]}
           </Tag>
         </Tooltip>
       )
