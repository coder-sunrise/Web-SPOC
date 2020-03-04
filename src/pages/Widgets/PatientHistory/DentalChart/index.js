import { connect } from 'dva'
import React, { useEffect, useState } from 'react'

import { CommonTableGrid, Select } from '@/components'

import Diagnosis from './Diagnosis'

// @connect(({ codetable }) => ({ codetable }))
const DiagnosisPanel = (props) => {
  const { dispatch } = props

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctchartmethod',
      },
    })
  }, [])

  return (
    <div>
      <Diagnosis {...props} />
    </div>
  )
}

export default connect(({ codetable }) => ({ codetable }))(DiagnosisPanel)
