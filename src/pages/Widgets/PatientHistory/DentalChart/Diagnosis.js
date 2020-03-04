import React, { Component } from 'react'
import { CommonTableGrid, Select, Skeleton } from '@/components'
import Chart from '@/pages/Widgets/DentalChart/Chart'
import DiagnosisPanel from '@/pages/Widgets/DentalChart/DiagnosisPanel'

export default (props) => {
  const { patientHistory, codetable } = props
  const { ctchartmethod } = codetable
  const { entity } = patientHistory

  if (!ctchartmethod || !entity || !entity.dentalChart[0]) {
    return (
      <React.Fragment>
        <Skeleton variant='rect' height={300} style={{ marginBottom: 8 }} />
        <Skeleton variant='rect' height={100} width='80%' />
      </React.Fragment>
    )
  }
  const { dentalChart, isPedoChart, isSurfaceLabel } = entity.dentalChart[0]
  const dentalChartData = JSON.parse(dentalChart) || []

  return (
    <div>
      <Chart
        readOnly
        dentalChartComponent={{
          isPedoChart,
          isSurfaceLabel,
          data: dentalChartData.filter((o) => !o.action.dentalTreatmentFK),
        }}
        {...props}
      />
      <div style={{ marginTop: 8 }}>
        <DiagnosisPanel
          viewOnly
          chartmethods={ctchartmethod.filter(
            (o) =>
              o.isDisplayInDiagnosis &&
              dentalChartData.find((m) => m.id === o.id),
          )}
          {...props}
          paperProps={{ elevation: 0 }}
        />
      </div>
    </div>
  )
}
