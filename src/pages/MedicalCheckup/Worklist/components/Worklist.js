import React, { Component, Fragment } from 'react'
import $ from 'jquery'
import { Space, Card } from 'antd'
import { WorklistFilter } from './WorklistFilter'
import WorklistGrid from './WorklistGrid'

export const Worklist = props => {
  const { mainDivHeight = 700 } = props
  let height =
    mainDivHeight - 120 - ($('.filterMedicationDosageBar').height() || 0)
  if (height < 300) height = 300
  return (
    <div>
      <div className='filterPharmacyBar'>
        <WorklistFilter {...props} />
      </div>
      <WorklistGrid {...props} height={height} />
    </div>
  )
}
