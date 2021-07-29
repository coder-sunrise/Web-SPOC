import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { useSelector, useDispatch, connect } from 'dva'
import { CommonModal } from '@/components'
import RadiologyDetails from './Details'
import { Worklist, WorklistFilter } from '../Components'
import WorklistContext, { WorklistContextProvider } from './WorklistContext'

const columns = [
  {
    backgroundColor: '#009933',
    title: 'New',
    workitems: [
      {
        patient: {
          name: 'Annie Moon',
          age: 20,
          patientReferenceNo: 'PT-000007',
          patientAccountNo: 'S9388399',
          gender: 'female',
        },
        accessionNo: '202130230001',
        itemDescription: 'X-Ray(Head)',
        isNurseActualized: true,
        orderDate: '14 May 2021 03:15 PM',
        isUrgent: true,
        id: 1,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
          visitPurposeFK: 4,
        },
      },
      {
        patient: {
          name: 'Annie Sun',
          age: 11,
          patientReferenceNo: 'PT-000008',
          patientAccountNo: 'S32432399',
          gender: 'female',
        },
        accessionNo: '202130230002',
        itemDescription: 'X-Ray(Leg)',
        orderDate: '14 May 2021 03:15 PM',
        id: 2,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
        },
      },
      {
        patient: {
          name: 'David Ross',
          age: 49,
          patientReferenceNo: 'PT-000009',
          patientAccountNo: 'S323232499',
          gender: 'male',
        },
        accessionNo: '202130230003',
        itemDescription: 'X-Ray(Leg)',
        orderDate: '14 May 2021 03:15 PM',
        id: 3,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
        },
      },
      {
        patient: {
          name: 'Monica',
          age: 49,
          patientReferenceNo: 'PT-000010',
          patientAccountNo: 'S32432332',
          gender: 'female',
        },
        id: 4,
        accessionNo: '202130230004',
        itemDescription: 'X-Ray(Leg)',
        orderDate: '14 May 2021 03:15 PM',
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
        },
      },
    ],
  },
  {
    backgroundColor: '#960',
    title: 'In Progress',
    workitems: [
      {
        patient: {
          name: 'Annie Moon',
          age: 20,
          patientReferenceNo: 'PT-000007',
          patientAccountNo: 'S9388399',
          gender: 'female',
        },
        accessionNo: '202130230001',
        itemDescription: 'X-Ray(Head)',
        isNurseActualized: true,
        orderDate: '14 May 2021 03:15 PM',
        isUrgent: true,
        id: 1,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
          visitPurposeFK: 4,
        },
      },
    ],
  },
  {
    backgroundColor: '#099',
    title: 'Pending Report',
    workitems: [
      {
        patient: {
          name: 'Annie Moon',
          age: 20,
          patientReferenceNo: 'PT-000007',
          patientAccountNo: 'S9388399',
          gender: 'female',
        },
        accessionNo: '202130230001',
        itemDescription: 'X-Ray(Head)',
        isNurseActualized: true,
        orderDate: '14 May 2021 03:15 PM',
        isUrgent: true,
        id: 1,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
          visitPurposeFK: 4,
        },
      },
    ],
  },
  { backgroundColor: '#366', title: 'Completed', workitems: [] },
  {
    backgroundColor: '#797979',
    title: 'Cancelled',
    workitems: [
      {
        patient: {
          name: 'Annie Moon',
          age: 20,
          patientReferenceNo: 'PT-000007',
          patientAccountNo: 'S9388399',
          gender: 'female',
        },
        accessionNo: '202130230001',
        itemDescription: 'X-Ray(Head)',
        isNurseActualized: true,
        orderDate: '14 May 2021 03:15 PM',
        isUrgent: true,
        id: 1,
        visit: {
          queueNo: '1.0',
          doctorName: 'Dr. Jin SangRong',
          visitPurposeFK: 4,
        },
      },
      {
        patient: {
          name: 'Annie Moon',
          age: 20,
          patientReferenceNo: 'PT-000007',
          patientAccountNo: 'S9388399',
          gender: 'female',
        },
        accessionNo: '202130230001',
        itemDescription: 'X-Ray(Head)',
        isNurseActualized: false,
        orderDate: '14 May 2021 03:15 PM',
        isUrgent: false,
        id: 1,
        visit: {
          queueNo: '5.0',
          doctorName: 'Dr. Jin SangRong',
          visitPurposeFK: 1,
        },
      },
    ],
  },
]

const RadiologyWorklist = () => {
  const dispatch = useDispatch()
  const { showDetails, setShowDetails } = useContext(WorklistContext)
  const model = useSelector(s => s.radiologyWorklist)

  useEffect(() => {
    dispatch({
      type: 'radiologyWorklist/query',
    })
  }, [])

  return (
    <ProCard
      style={{
        height: '100%',
      }}
      gutter={[16, 16]}
      title={<WorklistFilter />}
    >
      <Worklist columns={columns} />
      <CommonModal
        open={showDetails}
        title='Radiology Examination Details'
        onClose={() => {
          setShowDetails(false)
        }}
        onConfirm={() => {}}
        showFooter={true}
        maxWidth='lg'
        overrideLoading
        observe=''
      >
        <RadiologyDetails />
      </CommonModal>
    </ProCard>
  )
}

const RadiologyWorklistWithProvider = props => (
  <WorklistContextProvider>
    <RadiologyWorklist {...props}></RadiologyWorklist>
  </WorklistContextProvider>
)

export default RadiologyWorklistWithProvider
