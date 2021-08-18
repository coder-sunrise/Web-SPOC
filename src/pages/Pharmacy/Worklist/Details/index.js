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
  const details = useSelector(state => state.pharmacyDetails)
  const patientBannerEntity = useSelector(state => state.patient)
  const [workitem, setWorkItem] = useState({})

  useEffect(() => {
    if (detailsId) {
      dispatch({ type: 'pharmacyDetails/query', payload: { id: detailsId } })
      setShowModal(true)
    }
  }, [detailsId])

  useEffect(() => {
    if (details && details.entity) setWorkItem(details.entity)
  }, [details])

  return (
    <CommonModal
      open={showModal}
      title='Pharmacy Details'
      showFooter={true}
      onClose={() => {
        setDetailsId(null)
        setShowModal(false)
      }}
      maxWidth='lg'
      overrideLoading
      observe=''
    >
      <div>Orders</div>
    </CommonModal>
  )
}

export default PharmacyDetails
