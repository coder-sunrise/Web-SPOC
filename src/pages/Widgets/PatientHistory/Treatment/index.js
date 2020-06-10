import { connect } from 'dva'
import React, { useEffect, useState } from 'react'
import Chart from '@/pages/Widgets/DentalChart/Chart'

import {
  CommonTableGrid,
  Select,
  Skeleton,
  GridContainer,
  GridItem,
} from '@/components'
import Grid from './Grid'
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
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'cttreatment',
      },
    })
  }, [])

  const { patientHistory, codetable } = props
  const { ctchartmethod, cttreatment } = codetable
  const { entity } = patientHistory

  if (
    !ctchartmethod ||
    !cttreatment ||
    !entity ||
    !entity.dentalChart ||
    !entity.dentalChart[0]
  ) {
    return (
      <React.Fragment>
        <Skeleton variant='rect' height={300} style={{ marginBottom: 8 }} />
        <Skeleton variant='rect' height={100} width='80%' />
      </React.Fragment>
    )
  }
  const { dentalChart, isPedoChart, isSurfaceLabel } = entity.dentalChart[0]
  const dentalChartData = JSON.parse(dentalChart) || []
  const dentalChartComponent = {
    isPedoChart,
    isSurfaceLabel,
    data: dentalChartData.filter((o) => o.action.dentalTreatmentFK),
  }
  return (
    <GridContainer gutter={0}>
      <GridItem xs={12}>
        <Chart
          readOnly
          dentalChartComponent={dentalChartComponent}
          {...props}
        />
      </GridItem>
      <GridItem xs={12}>
        <div style={{ marginTop: 8 }}>
          <Grid {...props} dentalChartComponent={dentalChartComponent} />
        </div>
      </GridItem>
    </GridContainer>
  )
}

export default connect(({ codetable }) => ({ codetable }))(DiagnosisPanel)
