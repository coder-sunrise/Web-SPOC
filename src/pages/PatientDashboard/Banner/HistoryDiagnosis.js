import React from 'react'
// common components
import { GridContainer, GridItem } from '@/components'

const HistoryDiagnosis = ({ patientHistoryDiagnosis = [] }) => (
  <div>
    {patientHistoryDiagnosis.map((item, i) => {
      return (
        <GridContainer>
          <GridItem>
            {i + 1}. {item.diagnosisDescription}
          </GridItem>
        </GridContainer>
      )
    })}
  </div>
)

export default HistoryDiagnosis
