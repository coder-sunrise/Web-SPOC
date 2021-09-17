import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Typography, Input } from 'antd'
import moment from 'moment'
import {
  GridContainer,
  ProgressButton,
  GridItem,
  CommonModal,
  dateFormatLongWithTimeNoSec12h,
} from '@/components'
import Banner from '@/pages/PatientDashboard/Banner'
import { ExaminationSteps } from '../../Components'
import {
  RADIOLOGY_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_BUTTON,
} from '@/utils/constants'
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
  const { detailsId, setDetailsId, showDetails, setShowDetails } = useContext(
    WorklistContext,
  )

  const details = useSelector(state => state.radiologyDetails)
  const patientBannerEntity = useSelector(state => state.patient)
  const [workitem, setWorkItem] = useState({})

  useEffect(() => {
    if (detailsId) {
      dispatch({
        type: 'radiologyDetails/query',
        payload: { id: detailsId },
      })
      setShowDetails(true)
    } else {
      setShowDetails(false)
    }
  }, [detailsId])

  useEffect(() => {
    if (details && details.entity) {
      setWorkItem(details.entity)
    }
  }, [details])

  const renderStatusButtons = () => {
    if (!details || !details.entity) return

    const buttonInfo = RADIOLOGY_WORKITEM_BUTTON.find(
      s => s.currentStatusFK === details.entity.statusFK,
    )

    if (!buttonInfo) return

    return (
      <>
        {buttonInfo.enableCancel && (
          <ProgressButton
            color='#797979'
            onClick={() => {
              dispatch({
                type: 'radiologyDetails/updateRadiologyWorkitem',
                payload: {
                  ...details.entity,
                  id: details.entity.radiologyWorkitemId,
                  statusFK: RADIOLOGY_WORKITEM_STATUS.CANCELLED,
                },
              })

              setShowDetails(false)
            }}
          >
            Cancel Examination
          </ProgressButton>
        )}
        <ProgressButton
          color='success'
          onClick={() => {
            dispatch({
              type: 'radiologyDetails/updateRadiologyWorkitem',
              payload: {
                ...details.entity,
                id: details.entity.radiologyWorkitemId,
                statusFK: buttonInfo.nextStatusFK,
              },
            })

            setShowDetails(false)
          }}
        >
          {buttonInfo.name}
        </ProgressButton>
      </>
    )
  }

  return (
    <CommonModal
      open={showDetails}
      title='Radiology Examination Details'
      showFooter={true}
      onClose={() => {
        setDetailsId(null)
        setShowDetails(false)
      }}
      footProps={{
        extraButtons: renderStatusButtons(),
      }}
      maxWidth='lg'
      overrideLoading
      observe=''
    >
      <GridContainer style={{ height: 700, overflowY: 'scroll' }}>
        <GridItem md={12}>
          <Banner
            from='Radiology'
            // activePreOrderItem={patientBannerEntity?.entity?.listingPreOrderItem?.filter(item => !item.isDeleted) || []}
            patientInfo={patientBannerEntity}
            style={{ position: 'relative' }}
          />
        </GridItem>
        <GridItem md={12}>
          <ExaminationSteps item={details.entity} />
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

                  <RightAlignGridItem>Priority :</RightAlignGridItem>
                  <GridItem md={6}>Urgent</GridItem>

                  <RightAlignGridItem>Doctor Instructions :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.instruction}</GridItem>
                  <RightAlignGridItem>Remarks :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.remark}</GridItem>
                </GridContainer>
              </GridItem>
              <GridItem md={2} />
              <GridItem md={4}>
                <GridContainer>
                  <RightAlignGridItem>Order Created Time :</RightAlignGridItem>
                  <GridItem md={6}>
                    {moment(workitem.generateDate).format(
                      dateFormatLongWithTimeNoSec12h,
                    )}
                  </GridItem>

                  <RightAlignGridItem>Modality :</RightAlignGridItem>
                  <GridItem md={6}> Outpatient </GridItem>

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
