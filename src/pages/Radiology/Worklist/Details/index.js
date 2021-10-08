import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Table, Radio } from 'antd'
import moment from 'moment'
import {
  GridContainer,
  ProgressButton,
  GridItem,
  CommonModal,
  dateFormatLongWithTimeNoSec12h,
  Popconfirm,
  TextField,
} from '@/components'
import Banner from '@/pages/PatientDashboard/Banner'
import {
  ExaminationSteps,
  OrderDetails,
  ExaminationDetails,
  CancelConfirmation,
} from './components'
import { SectionTitle, RightAlignGridItem } from '../../Components'
import {
  RADIOLOGY_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_BUTTON,
} from '@/utils/constants'
import WorklistContext from '../WorklistContext'
import { examinationSteps } from '@/utils/codes'

const RadiologyDetails = props => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId, showDetails, setShowDetails } = useContext(
    WorklistContext,
  )

  const details = useSelector(state => state.radiologyDetails)
  const patientBannerEntity = useSelector(state => state.patient)
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [workitem, setWorkItem] = useState({})
  const [visitWorkitems, setVisitWorkItems] = useState([])
  const [examinationDetails, setExaminationDetails] = useState({})

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

    return () => {
      dispatch({
        type: 'radiologyDetails/updateState',
        payload: { entity: {} },
      })
      setWorkItem({})
      setVisitWorkItems([])
      setExaminationDetails({})
    }
  }, [detailsId])

  useEffect(() => {
    if (details && details.entity) {
      setWorkItem(details.entity)
      setVisitWorkItems(details.entity.visitWorkitems)
    }
  }, [details])

  const renderStatusButtons = () => {
    if (!details || !details.entity) return

    const buttonInfo = RADIOLOGY_WORKITEM_BUTTON.find(
      s => s.currentStatusFK === details.entity.statusFK,
    )

    if (!buttonInfo) return

    return (
      <React.Fragment>
        {buttonInfo.enableCancel && (
          <ProgressButton
            color='#797979'
            onClick={() => {
              setShowCancelConfirm(true)
            }}
          >
            Cancel Examination
          </ProgressButton>
        )}
        <ProgressButton
          color='success'
          onClick={() => {
            handleSave({
              ...details.entity,
              statusFK: buttonInfo.nextStatusFK,
            })
          }}
        >
          {buttonInfo.name}
        </ProgressButton>
      </React.Fragment>
    )
  }

  const handleSave = payload => {
    dispatch({
      type: 'radiologyDetails/updateRadiologyWorkitem',
      payload: {
        ...payload,
        id: details.entity.radiologyWorkitemId,
        visitWorkitems: visitWorkitems,
        ...examinationDetails,
      },
    })

    setShowDetails(false)
    setDetailsId(null)
  }

  const handleCancel = cancellationReason => {
    dispatch({
      type: 'radiologyDetails/cancelRadiologyWorkitem',
      payload: {
        ...workitem,
        id: workitem.radiologyWorkitemId,
        visitWorkitems: visitWorkitems,
        ...examinationDetails,
        statusFK: RADIOLOGY_WORKITEM_STATUS.CANCELLED,
        cancellationReason: cancellationReason,
      },
    })

    setShowDetails(false)
    setDetailsId(null)
    setShowCancelConfirm(false)
  }

  return (
    <CommonModal
      open={showDetails}
      title='Radiology Examination Details'
      showFooter={true}
      onConfirm={() => {
        handleSave({
          ...details.entity,
        })
        //TODO: if changed scribble notes, warn to pending changes
      }}
      confirmText='Save'
      onClose={() => {
        setDetailsId(null)
        setShowDetails(false)
      }}
      footProps={{
        extraButtons: renderStatusButtons(),
      }}
      maxWidth='lg'
      overrideLoading
    >
      <GridContainer style={{ height: 700, overflowY: 'scroll' }}>
        <GridItem md={12}>
          <div style={{ padding: 8 }}>
            <Banner from='Radiology' patientInfo={patientBannerEntity} />
          </div>
        </GridItem>
        <GridItem md={12}>
          <ExaminationSteps item={workitem} />
        </GridItem>
        <GridItem md={12}>
          <OrderDetails
            workitem={workitem}
            onCombinedOrderChange={value => {
              setVisitWorkItems(value)
            }}
          />
        </GridItem>
        <GridItem md={12}>
          <ExaminationDetails
            onChange={val => setExaminationDetails(val)}
            workitem={workitem}
          />
        </GridItem>
      </GridContainer>
      <CancelConfirmation
        open={showCancelConfirm}
        workitem={workitem}
        visitWorkitems={visitWorkitems}
        onCancelConfirm={cancellationReason => {
          handleCancel(cancellationReason)
        }}
      />
    </CommonModal>
  )
}

export default RadiologyDetails
