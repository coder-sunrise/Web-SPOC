import React, { useState, useEffect } from 'react'
import { Tabs } from '@/components'
import { Table } from 'antd'
import { Link } from 'umi'
import { useCodeTable } from '@/utils/hooks'
import BasicData from '@/pages/PatientDatabase/Detail/Results/BasicData'
import PatientHistory from '@/pages/Widgets/PatientHistory'
import Examination from './Examination'

const TestResult = props => {
  const ctexaminationcategory = useCodeTable('ctexaminationcategory')
  const ctexaminationitem = useCodeTable('ctexaminationitem')
  const ctindividualcomment = useCodeTable('ctindividualcomment')
  const { height } = props
  const options = [
    {
      id: 0,
      name: 'Basic Data',
      content: <BasicData height={height - 52} defaultSelectMedicalCheckup />,
    },
    {
      id: 1,
      name: 'Lab Result',
      content: <dix>Lab Result</dix>,
    },
    {
      id: 2,
      name: 'Examinations',
      content: (
        <Examination
          {...props}
          height={height}
          ctexaminationcategory={ctexaminationcategory}
          ctexaminationitem={ctexaminationitem}
          ctindividualcomment={ctindividualcomment}
        />
      ),
    },
    {
      id: 3,
      name: 'External Service',
      content: <dix>External Service</dix>,
    },
    {
      id: 4,
      name: 'Patient History',
      content: (
        <PatientHistory
          height={height}
          mode='integrated'
          fromModule='MedicalCheckup'
        />
      ),
    },
  ]
  return (
    <div style={{ position: 'relative' }}>
      <Tabs options={options} />
      <div style={{ position: 'absolute', right: 8, top: 10 }}>
        <Link>
          <span
            style={{
              display: 'block',
              textDecoration: 'underline',
            }}
            onClick={e => {
              e.preventDefault()
            }}
          >
            Result Details
          </span>
        </Link>
      </div>
    </div>
  )
}
export default TestResult
