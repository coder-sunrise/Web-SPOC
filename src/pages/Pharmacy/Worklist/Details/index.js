import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Typography, Input } from 'antd'
import {
  GridContainer,
  ProgressButton,
  GridItem,
  CommonModal,
} from '@/components'
import Banner from '@/pages/PatientDashboard/Banner'
import { ExaminationSteps } from '@/pages/Radiology/Components'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'
import Details from './Details'

const RightAlignGridItem = ({ children, md = 6 }) => {
  return (
    <GridItem md={md} style={{ textAlign: 'right' }}>
      {children}
    </GridItem>
  )
}

const PharmacyDetails = () => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId } = useContext(WorklistContext)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (detailsId) {
      dispatch({ type: 'pharmacyDetails/query', payload: { id: detailsId } })
      setShowModal(true)
    }
  }, [detailsId])

  return (
    <CommonModal
      open={showModal}
      title='Pharmacy Details'
      showFooter={true}
      onClose={() => {
        setDetailsId(null)
        setShowModal(false)
      }}
      fullScreen
      overrideLoading
      observe=''
      showFooter={false}
    >
      <Details />
    </CommonModal>
  )
}

export default PharmacyDetails
