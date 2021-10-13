import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'dva'
import { Radio, Input } from 'antd'
import moment from 'moment'
import { GridContainer, GridItem } from '@/components'
import { RightAlignGridItem, SectionTitle } from '../../../Components'
import {
  RADIOLOGY_WORKITEM_STATUS,
  CLINICAL_ROLE,
  CANNED_TEXT_TYPE,
  SCRIBBLE_NOTE_TYPE,
} from '@/utils/constants'
import { CannedTextButton, RadiographerTag, Findings } from './index'

const findingSettings = {
  authority: 'queue.consultation.clinicalnotes.history',
  category: 'RadiologyFindings',
  fieldName: 'RadiologyFindings',
  fieldTitle: 'RadiologyFindings',
  scribbleField: 'radiologyFindingsScribbleArray',
  scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.RADIOLOGY,
  index: 0,
  height: 390,
  enableSetting: 'isEnableClinicNoteHistory',
}

export const ExaminationDetails = ({
  workitem = {},
  onChange,
  ...restProps
}) => {
  const currentUser = useSelector(state => state.user.data)
  const [assignedRadiographers, setAssignedRadiographers] = useState([])
  const [comment, setComment] = useState('')
  const [findings, setFindings] = useState({})

  if (!workitem) return <div></div>

  useEffect(() => {
    onChange({ assignedRadiographers, comment, findings })
  }, [assignedRadiographers, comment, findings])

  useEffect(() => {
    if (workitem) {
      setComment(workitem.comment)
      setFindings({
        examinationFinding: workitem.examinationFinding,
        radiologyScribbleNote: workitem.radiologyScribbleNote,
      })

      if (
        workitem.assignedRadiographers &&
        workitem.assignedRadiographers.length > 0
      ) {
        setAssignedRadiographers(workitem.assignedRadiographers)
      }

      if (
        !workitem.assignedRadiographers ||
        workitem.assignedRadiographers.length === 0
      ) {
        const currentClinician = currentUser.clinicianProfile
        if (
          currentClinician.userProfile.role.clinicRoleFK ===
          CLINICAL_ROLE.RADIOGRAPHER
        )
          setAssignedRadiographers([currentClinician])
      }

      return () => {
        setAssignedRadiographers([])
        setComment('')
        setFindings({})
      }
    }
  }, [workitem])

  return (
    <div>
      <SectionTitle title='Examination Details' />

      {workitem.statusFK <= RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ? (
        <GridContainer style={{ rowGap: 10 }}>
          <GridItem md={2}>
            <RightAlignGridItem md={12}>Radiographer :</RightAlignGridItem>
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
              assignedRadiographers.map(r => r.name).join(', ')
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
          <GridItem md={12}>
            {workitem.statusFK ===
              RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED && (
              <Findings
                defaultValue={workitem.examinationFinding}
                radiologyScribbleNote={workitem.radiologyScribbleNote}
                onChange={value => {
                  setFindings(value)
                }}
                workItem={workitem}
                item={findingSettings}
                {...restProps}
              />
            )}
          </GridItem>
        </GridContainer>
      ) : (
        <GridContainer style={{ rowGap: 10 }}>
          <GridItem md={2}>
            <RightAlignGridItem md={12}>Radiographer :</RightAlignGridItem>
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

          {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ? (
            <React.Fragment>
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
            </React.Fragment>
          ) : (
            <React.Fragment>
              <GridItem md={2}>
                <RightAlignGridItem md={12}>Cancel Reason:</RightAlignGridItem>
              </GridItem>

              <GridItem md={10}>{workitem.cancellationReason}</GridItem>
            </React.Fragment>
          )}
        </GridContainer>
      )}
    </div>
  )
}
