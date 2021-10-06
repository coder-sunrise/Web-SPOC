import React, { useEffect, useState, useContext } from 'react'
import { connect, useSelector, useDispatch } from 'dva'
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
import {
  ExaminationSteps,
  CannedTextButton,
  RadiographerTag,
} from '../../Components'
import {
  RADIOLOGY_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_BUTTON,
  CANNED_TEXT_TYPE,
  SCRIBBLE_NOTE_TYPE,
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

// const mapStateToProps = (state) => ({
//   scriblenotes: state.scriblenotes,
// })

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
  const [findings, setFindings] = useState({})
  const [comment, setComment] = useState('')
  const patientBannerEntity = useSelector(state => state.patient)
  const [workitem, setWorkItem] = useState({})
  const item = {
    authority: 'queue.consultation.clinicalnotes.history',
    category: 'RadiologyFindings',
    fieldName: 'RadiologyFindings',
    fieldTitle: 'RadiologyFindings',
    scribbleField: 'radiologyFindingsScribbleArray',
    scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.RADIOLOGY,
    index: 0,
    height: 390,
    enableSetting: 'isEnableClinicNoteHistory'
  }

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
      setComment(details.entity.comment)
      setFindings({
        examinationFinding: details.entity.examinationFinding,
        radiologyScribbleNote: details.entity.radiologyScribbleNote,
      })
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
            handleSave(buttonInfo.nextStatusFK)
          }}
        >
          {buttonInfo.name}
        </ProgressButton>
      </>
    )
  }

  const handleSave = statusFK => {
    dispatch({
      type: 'radiologyDetails/updateRadiologyWorkitem',
      payload: {
        ...details.entity,
        id: details.entity.radiologyWorkitemId,
        statusFK: statusFK ? statusFK : details.entity.statusFK,
        comment: comment,
        examinationFinding: findings.examinationFinding,
        radiologyScribbleNote: findings.radiologyScribbleNote,
      },
    })

    setShowDetails(false)
    setDetailsId(null)
  }

  return (
    <CommonModal
      open={showDetails}
      title='Radiology Examination Details'
      showFooter={true}
      onConfirm={() => handleSave()}
      onClose={() => {
        setDetailsId(null)
        setShowDetails(false)
        //TODO: if has changed scribble notes, warn to pending changes
      }}
      footProps={{
        extraButtons: renderStatusButtons(),
      }}
      maxWidth='lg'
      overrideLoading
      observe=''
    >
      <GridContainer 
        style={{ 
          // height: 700, 
          overflowY: 'scroll' 
        }}
      >
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
            <Typography.Title level={5}>Order Details</Typography.Title>
            <GridContainer>
              <GridItem md={4}>
                <GridContainer>
                  <RightAlignGridItem>Accession No :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.accessionNo}</GridItem>

                  <RightAlignGridItem>Examination :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.itemDescription}</GridItem>

                  <RightAlignGridItem>Priority :</RightAlignGridItem>
                  <GridItem md={6}>{workitem.priority}</GridItem>

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
                  <GridItem md={6}>{workitem?.visitInfo?.visitGroup}</GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
        <GridItem md={12}>
          <div>
            <Typography.Title level={5}>Examination Details</Typography.Title>
            {details.entity &&
            details.entity.statusFK <=
              RADIOLOGY_WORKITEM_STATUS.PENDINGREPORT ? (
              <GridContainer>
                <GridItem md={2}>
                  <RightAlignGridItem md={12}>
                    Radiographer :
                  </RightAlignGridItem>
                </GridItem>
                <GridItem md={10}>{/*  <RadiographerTag /> */}</GridItem>
                <GridItem md={2}>
                  <RightAlignGridItem md={12}>
                    Radiographer Comment:
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
                    onChange={e => setComment(e.target.value)}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </GridItem>
              </GridContainer>
            ) : (
              <GridContainer>
                <GridItem md={2}>
                  <RightAlignGridItem md={12}>
                    Radiographer :
                  </RightAlignGridItem>
                </GridItem>
                <GridItem md={10}>Tamy Wu, Wammy Tu</GridItem>

                <GridItem md={2}>
                  <RightAlignGridItem md={12}>
                    Radiographer Comment:
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
                  <>
                    <GridItem md={2}>
                      <RightAlignGridItem md={12}>
                        Cancel Reason:
                      </RightAlignGridItem>
                    </GridItem>

                    <GridItem md={10}>{workitem.comment}</GridItem>
                  </>
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
                  radiologyScribbleNote={details?.entity?.radiologyScribbleNote}
                  onChange={value => setFindings(value)}
                  workItem={workitem}
                  item={item}
                  {...props}
                />
              </div>
            </GridItem>
          )}
      </GridContainer>
    </CommonModal>
  )
}

export default RadiologyDetails
