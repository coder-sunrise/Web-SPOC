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
import { ExaminationSteps } from '../../Components'
import WorklistContext from '../WorklistContext'

const RightAlignGridItem = ({ children, md = 6 }) => {
  return (
    <GridItem md={md} style={{ textAlign: 'right' }}>
      {children}
    </GridItem>
  )
}

const RadiologyDetails = () => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId } = useContext(WorklistContext)
  const [showModal, setShowModal] = useState(false)
  const details = useSelector(state => state.radiologyDetails)
  const patientBannerEntity = useSelector(state => state.patient)
  const [workitem, setWorkItem] = useState({})

  useEffect(() => {
    if (detailsId) {
      dispatch({ type: 'radiologyDetails/query', payload: { id: detailsId } })
      setShowModal(true)
    }
  }, [detailsId])

  useEffect(() => {
    if (details && details.entity) setWorkItem(details.entity)
  }, [details])

  return (
    <CommonModal
      open={showModal}
      title='Radiology Examination Details'
      showFooter={true}
      onClose={() => {
        setDetailsId(null)
        setShowModal(false)
      }}
      footProps={{
        extraButtons: (
          <ProgressButton
            color='success'
            onClick={() => console.log('nothing')}
          >
            Start Examination
          </ProgressButton>
        ),
      }}
      maxWidth='lg'
      overrideLoading
      observe=''
    >
      <GridContainer style={{ height: 700, overflowY: 'scroll' }}>
        <GridItem md={12}>
          <Banner
            from='Radiology' 
            activePreOrderItem={patientBannerEntity?.entity?.listingPreOrderItem?.filter(item => !item.isDeleted) || []}
            patientInfo={patientBannerEntity}
            style={{ position: 'relative' }}
          />
        </GridItem>
        <GridItem md={12}>
          <ExaminationSteps />
        </GridItem>
        <GridItem md={12}>
          <div>
            <Typography.Title level={5}>Order Details</Typography.Title>
            <GridContainer>
              <GridItem md={4}>
                <GridContainer>
                  <RightAlignGridItem>Accession No :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.accessionNo}</GridItem>

                  <RightAlignGridItem>Examination :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.itemDescription}</GridItem>

                  <RightAlignGridItem>Order Combined :</RightAlignGridItem>
                  <GridItem md={6}>Yes</GridItem>

                  <RightAlignGridItem>Doctor Instruction :</RightAlignGridItem>
                  <GridItem md={6}>Both left and right</GridItem>
                  <RightAlignGridItem>Clinical History :</RightAlignGridItem>
                  <GridItem md={6}>Patient sprain in the morning</GridItem>
                </GridContainer>
              </GridItem>
              <GridItem md={2} />
              <GridItem md={4}>
                <GridContainer>
                  <RightAlignGridItem>Order Time :</RightAlignGridItem>
                  <GridItem md={6}>14 May 2021 03:15 PM</GridItem>

                  <RightAlignGridItem>Visit Type :</RightAlignGridItem>
                  <GridItem md={6}> Outpatient </GridItem>

                  <RightAlignGridItem>Priority :</RightAlignGridItem>
                  <GridItem md={6}>Urgent</GridItem>

                  <RightAlignGridItem>Groups :</RightAlignGridItem>
                  <GridItem md={6}>Group 003</GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
        <GridItem md={12}>
          <div>
            <Typography.Title level={5}>Examination Details</Typography.Title>
            <GridContainer>
              <GridItem md={2}>
                <RightAlignGridItem md={12}>Radiographer :</RightAlignGridItem>
              </GridItem>
              <GridItem md={10}>Tany Wu, Jack Lin</GridItem>
              <GridItem md={2}>
                <RightAlignGridItem md={12}>
                  Radiographer Comment:
                </RightAlignGridItem>
              </GridItem>
              <GridItem md={10}>
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </GridContainer>
    </CommonModal>
  )
}

export default RadiologyDetails
