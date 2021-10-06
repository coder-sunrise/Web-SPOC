import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Typography, Input, Table, Radio } from 'antd'
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
  CannedTextButton,
  RadiographerTag,
  CombineOrderGrid,
} from '../../Components'
import {
  RADIOLOGY_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_BUTTON,
  CANNED_TEXT_TYPE,
  CLINICAL_ROLE,
} from '@/utils/constants'
import WorklistContext from '../WorklistContext'
import Findings from '../../Components/Findings'

const RightAlignGridItem = ({ children, md = 6 }) => {
  return (
    <GridItem md={md} style={{ textAlign: 'right' }}>
      {children}
    </GridItem>
  )
}

const SectionTitle = ({ title }) => (
  <Typography.Title
    level={5}
    style={{ marginTop: 15, marginBottom: 10, marginLeft: 15 }}
  >
    {title}
  </Typography.Title>
)

const cancelConfirmationTable = [
  {
    title: 'Accession No.',
    dataIndex: 'accessionNo',
    key: 'name',
  },
  {
    title: 'Examination',
    dataIndex: 'itemDescription',
    key: 'itemDescription',
  },
]

const RadiologyDetails = props => {
  const dispatch = useDispatch()
  const {
    detailsId,
    setDetailsId,
    showDetails,
    setShowDetails,
    visitPurpose,
  } = useContext(WorklistContext)

  const details = useSelector(state => state.radiologyDetails)
  const currentUser = useSelector(state => state.user.data)
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isCombinedOrder, setIsCombinedOrder] = useState(false)
  const [examinationFinding, setExaminationFinding] = useState('')
  const [comment, setComment] = useState('')
  const patientBannerEntity = useSelector(state => state.patient)
  const [workitem, setWorkItem] = useState({})
  const [visitWorkitems, setVisitWorkItems] = useState([])
  const [cancellationReason, setCancellationReason] = useState('')
  const [assignedRadiographers, setAssignedRadiographers] = useState([])

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
      setIsCombinedOrder(false)
      setAssignedRadiographers([])
      setCancellationReason('')
      setVisitWorkItems([])
    }
  }, [detailsId])

  useEffect(() => {
    if (details && details.entity) {
      setWorkItem(details.entity)
      setComment(details.entity.comment)
      setExaminationFinding(details.entity.examinationFinding)
      setVisitWorkItems(details.entity.visitWorkitems)

      if (
        details.entity.assignedRadiographers &&
        details.entity.assignedRadiographers.length > 0
      ) {
        setAssignedRadiographers(details.entity.assignedRadiographers)
      }

      if (
        !details.entity.assignedRadiographers ||
        details.entity.assignedRadiographers.length === 0
      ) {
        const currentClinician = currentUser.clinicianProfile
        if (
          currentClinician.userProfile.role.clinicRoleFK ===
          CLINICAL_ROLE.RADIOGRAPHER
        )
          setAssignedRadiographers([currentClinician])
      }

      if (details.entity.primaryWorkitemFK) setIsCombinedOrder(true)
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
    console.log('handleSave-assignedRadiographers', assignedRadiographers)
    dispatch({
      type: 'radiologyDetails/updateRadiologyWorkitem',
      payload: {
        ...payload,
        id: details.entity.radiologyWorkitemId,
        comment: comment,
        examinationFinding: examinationFinding,
        visitWorkitems: visitWorkitems,
        assignedRadiographers: assignedRadiographers,
      },
    })

    setShowDetails(false)
    setDetailsId(null)
  }

  const handleCancel = payload => {
    dispatch({
      type: 'radiologyDetails/cancelRadiologyWorkitem',
      payload: {
        ...payload,
      },
    })

    setShowDetails(false)
    setDetailsId(null)
  }

  return (
    <>
      <CommonModal
        open={showDetails}
        title='Radiology Examination Details'
        showFooter={true}
        onConfirm={() => {
          handleSave({
            ...details.entity,
          })
        }}
        confirmText='Save'
        onClose={() => {
          if (isDirty) console.log('change detected')
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
            <div style={{ padding: 8 }}>
              <Banner
                from='Radiology'
                // activePreOrderItem={patientBannerEntity?.entity?.listingPreOrderItem?.filter(item => !item.isDeleted) || []}
                patientInfo={patientBannerEntity}
              />
            </div>
          </GridItem>
          <GridItem md={12}>
            <ExaminationSteps item={details.entity} />
          </GridItem>
          <GridItem md={12}>
            <div>
              <SectionTitle title='Order Details' />

              <GridContainer>
                <GridItem md={4}>
                  <GridContainer style={{ rowGap: 10 }}>
                    <RightAlignGridItem>Accession No :</RightAlignGridItem>
                    <GridItem md={6}>{workitem.accessionNo}</GridItem>

                    <RightAlignGridItem>Examination :</RightAlignGridItem>
                    <GridItem md={6}>{workitem.itemDescription}</GridItem>

                    <RightAlignGridItem>Priority :</RightAlignGridItem>
                    <GridItem md={6}>{workitem.priority}</GridItem>

                    <RightAlignGridItem>
                      Doctor Instructions :
                    </RightAlignGridItem>
                    <GridItem md={6}>{workitem.instruction}</GridItem>
                    <RightAlignGridItem>Remarks :</RightAlignGridItem>
                    <GridItem md={6}>{workitem.remark}</GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem md={2} />
                <GridItem md={4}>
                  <GridContainer>
                    <RightAlignGridItem>
                      Order Created Time :
                    </RightAlignGridItem>
                    <GridItem md={6}>
                      {moment(workitem.generateDate).format(
                        dateFormatLongWithTimeNoSec12h,
                      )}
                    </GridItem>

                    <RightAlignGridItem>Modality :</RightAlignGridItem>
                    <GridItem md={6}> {workitem.modalityDescription} </GridItem>

                    <RightAlignGridItem>Visit Type :</RightAlignGridItem>
                    <GridItem md={6}>
                      {visitPurpose &&
                        workitem?.visitInfo &&
                        visitPurpose.find(
                          p => p.id === workitem.visitInfo.visitPurposeFK,
                        ).name}
                    </GridItem>

                    <RightAlignGridItem>Visit Group No :</RightAlignGridItem>
                    <GridItem md={6}>
                      {workitem?.visitInfo?.visitGroup}
                    </GridItem>

                    <RightAlignGridItem>Order Combined :</RightAlignGridItem>

                    <GridItem md={6}>
                      {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW &&
                        (workitem.visitWorkitems.length > 1 ? (
                          <Radio.Group
                            onChange={e => setIsCombinedOrder(e.target.value)}
                            value={isCombinedOrder}
                          >
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes</Radio>
                          </Radio.Group>
                        ) : (
                          '-'
                        ))}
                      {workitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW &&
                        (isCombinedOrder ? 'Yes' : 'No')}
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          {isCombinedOrder && (
            <React.Fragment>
              <GridItem md={12}>
                <SectionTitle title='Order Combined Details' />
              </GridItem>
              <GridItem md={12}>
                <CombineOrderGrid
                  visitWorkitems={workitem.visitWorkitems}
                  currentWorkitemid={workitem.radiologyWorkitemId}
                  onChange={value => {
                    setVisitWorkItems(value)
                  }}
                  readonly={workitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW}
                />
              </GridItem>
            </React.Fragment>
          )}
          <GridItem md={12}>
            <div>
              <SectionTitle title='Examination Details' />

              {details.entity &&
              details.entity.statusFK <=
                RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ? (
                <GridContainer style={{ rowGap: 10 }}>
                  <GridItem md={2}>
                    <RightAlignGridItem md={12}>
                      Radiographer :
                    </RightAlignGridItem>
                  </GridItem>

                  <GridItem md={10}>
                    {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW ? (
                      <RadiographerTag
                        value={assignedRadiographers}
                        onChange={newVal => {
                          setAssignedRadiographers(newVal)
                        }}
                      />
                    ) : (
                      assignedRadiographers.map(r => r.name).toString()
                    )}
                  </GridItem>

                  <GridItem md={2}>
                    <RightAlignGridItem md={12}>
                      Radiographer Comments :
                    </RightAlignGridItem>
                  </GridItem>
                  <GridItem md={10} style={{ textAlign: 'right' }}>
                    <CannedTextButton
                      buttonType='text'
                      cannedTextTypeFK={CANNED_TEXT_TYPE.RADIOLOGYINSTRUCTION}
                      style={{
                        marginRight: 0,
                        marginBottom: 8,
                      }}
                      handleSelectCannedText={cannedText => {
                        setComment(comment + '\n' + cannedText.text)
                      }}
                    />
                  </GridItem>
                  <GridItem md={12}>
                    <Input.TextArea
                      value={comment}
                      onChange={e => {
                        setComment(e.target.value)
                        setIsDirty(true)
                      }}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </GridItem>
                </GridContainer>
              ) : (
                <GridContainer style={{ rowGap: 10 }}>
                  <GridItem md={2}>
                    <RightAlignGridItem md={12}>
                      Radiographer :
                    </RightAlignGridItem>
                  </GridItem>
                  <GridItem md={10}>
                    {assignedRadiographers.map(r => r.name).toString()}
                  </GridItem>

                  <GridItem md={2}>
                    <RightAlignGridItem md={12}>
                      Radiographer Comments :
                    </RightAlignGridItem>
                  </GridItem>
                  <GridItem md={10}>{workitem.comment}</GridItem>

                  {details.entity &&
                  details.entity.statusFK ===
                    RADIOLOGY_WORKITEM_STATUS.COMPLETED ? (
                    <>
                      <GridItem md={2}>
                        <RightAlignGridItem md={12}>
                          Examination Findings:
                        </RightAlignGridItem>
                      </GridItem>

                      <GridItem md={10}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: workitem.examinationFinding,
                          }}
                        />
                      </GridItem>
                    </>
                  ) : (
                    <React.Fragment>
                      <GridItem md={2}>
                        <RightAlignGridItem md={12}>
                          Cancel Reason:
                        </RightAlignGridItem>
                      </GridItem>

                      <GridItem md={10}>{workitem.cancellationReason}</GridItem>
                    </React.Fragment>
                  )}
                </GridContainer>
              )}
            </div>
          </GridItem>

          {details.entity &&
            details.entity.statusFK ===
              RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED && (
              <GridItem md={12} style={{ marginTop: 5 }}>
                <div>
                  <Findings
                    defaultValue={details?.entity?.examinationFinding}
                    onChange={value => {
                      setExaminationFinding(value)
                      setIsDirty(true)
                    }}
                    workItem={workitem}
                    {...props}
                  />
                </div>
              </GridItem>
            )}
        </GridContainer>
      </CommonModal>
      <CommonModal
        open={showCancelConfirm}
        title='Cancel Examination'
        showFooter={true}
        maxWidth='sm'
        confirmProps={{ disabled: true }}
        onConfirm={() => {
          handleCancel({
            ...details.entity,
            id: details.entity.radiologyWorkitemId,
            visitWorkitems: visitWorkitems,
            comment: comment,
            statusFK: RADIOLOGY_WORKITEM_STATUS.CANCELLED,
            cancellationReason: cancellationReason,
          })
          setShowCancelConfirm(false)
        }}
        onClose={() => {
          setCancellationReason('')
          setShowCancelConfirm(false)
        }}
      >
        <div>Confirm to cancel examination below? </div>
        <div style={{ margin: 10 }}>
          <Table
            bordered
            size='small'
            pagination={false}
            columns={cancelConfirmationTable}
            dataSource={(() => {
              return isCombinedOrder && workitem.radiologyWorkitemId
                ? visitWorkitems.filter(
                    w =>
                      w.primaryWorkitemFK ===
                      visitWorkitems.find(
                        w =>
                          w.radiologyWorkitemId ===
                          workitem.radiologyWorkitemId,
                      ).primaryWorkitemFK,
                  )
                : [workitem]
            })()}
          />

          <TextField
            label='Reason'
            onChange={e => setCancellationReason(e.target.value)}
          />
        </div>
      </CommonModal>
    </>
  )
}

export default RadiologyDetails
