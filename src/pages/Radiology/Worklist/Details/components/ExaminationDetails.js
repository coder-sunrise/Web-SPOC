import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'dva'
import { Radio, Input } from 'antd'
import moment from 'moment'
import Authorized from '@/utils/Authorized'
import { GridContainer, GridItem } from '@/components'
import {
  RightAlignGridItem,
  SectionTitle,
  TextGridItem,
} from '../../../Components'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'
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
  showRequiredField = false,
  ...restProps
}) => {
  const currentUser = useSelector(state => state.user.data)
  const [assignedRadiographers, setAssignedRadiographers] = useState([])
  const [comment, setComment] = useState('')
  const [findings, setFindings] = useState({})
  const [hasChanged, setHasChanged] = useState(false)
  const { isReadOnly } = useContext(WorklistContext)

  if (!workitem) return <div></div>

  useEffect(() => {
    if (hasChanged) {
      onChange({ assignedRadiographers, comment, ...findings })
      setHasChanged(false)
    }
  }, [assignedRadiographers, comment, findings, hasChanged])

  useEffect(() => {
    if (workitem) {
      setComment(workitem.comment)
      setFindings({
        examinationFinding: workitem.examinationFinding,
        radiologyScribbleNote: workitem.radiologyScribbleNote,
      })
      setAssignedRadiographers(workitem.assignedRadiographers ?? [])

      // If no user assigned to the current workitem, default to current radiographer
      if (
        !workitem.assignedRadiographers ||
        workitem.assignedRadiographers.length === 0
      ) {
        const currentClinician = currentUser.clinicianProfile
        if (
          currentClinician.userProfile.role.clinicRoleFK ===
            CLINICAL_ROLE.RADIOGRAPHER &&
          workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW
        ) {
          setAssignedRadiographers([currentClinician])
          setHasChanged(true)
        }
      }
    }

    return () => {
      setAssignedRadiographers([])
      setComment('')
      setFindings({})
      setHasChanged(false)
    }
  }, [workitem])

  const isHiddenExaminationFinding =
    Authorized.check('radiologyworklist.examinationfinding').rights === 'hidden'

  return (
    <div>
      <SectionTitle title='Examination Details' />

      {!isReadOnly &&
      workitem.statusFK <= RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ? (
        <GridContainer style={{ rowGap: 10 }}>
          <GridItem md={2}>
            <RightAlignGridItem md={12}>Radiographer :</RightAlignGridItem>
          </GridItem>

          <GridItem md={10}>
            {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW ||
            workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.INPROGRESS ? (
              <div style={{ display: 'flex' }}>
                <RadiographerTag
                  value={assignedRadiographers}
                  onChange={newVal => {
                    setAssignedRadiographers(newVal)
                    setHasChanged(true)
                  }}
                />
                {showRequiredField && assignedRadiographers.length === 0 && (
                  <span style={{ color: 'red' }}>
                    * This is a required field
                  </span>
                )}
              </div>
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
                setHasChanged(true)
              }}
            />
          </GridItem>
          <GridItem md={12}>
            <Input.TextArea
              value={comment}
              onChange={e => {
                setComment(e.target.value)
                setHasChanged(true)
              }}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </GridItem>
          {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED &&
            !isHiddenExaminationFinding && (
              <GridItem md={12}>
                <Findings
                  defaultValue={workitem.examinationFinding}
                  radiologyScribbleNote={workitem.radiologyScribbleNote}
                  onChange={value => {
                    setFindings(value)
                    setHasChanged(true)
                  }}
                  workItem={workitem}
                  item={findingSettings}
                  {...restProps}
                />
              </GridItem>
            )}
        </GridContainer>
      ) : (
        <GridContainer style={{ rowGap: 10 }}>
          <GridItem md={2}>
            <RightAlignGridItem md={12}>Radiographer :</RightAlignGridItem>
          </GridItem>
          <TextGridItem md={10}>
            {assignedRadiographers.map(r => r.name).toString()}
          </TextGridItem>
          <GridItem md={2}>
            <RightAlignGridItem md={12}>
              Radiographer Comments :
            </RightAlignGridItem>
          </GridItem>
          <TextGridItem md={10}>{workitem.comment}</TextGridItem>

          {workitem.statusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ? (
            !isHiddenExaminationFinding && (
              <React.Fragment>
                <GridItem md={2}>
                  <RightAlignGridItem md={12}>
                    Examination Findings:
                  </RightAlignGridItem>
                </GridItem>

                <GridItem md={10}>
                  {workitem.examinationFinding ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: workitem.examinationFinding,
                      }}
                    />
                  ) : (
                    '-'
                  )}
                </GridItem>
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              <GridItem md={2}>
                <RightAlignGridItem md={12}>Cancel Reason:</RightAlignGridItem>
              </GridItem>

              <TextGridItem md={10}>{workitem.cancellationReason}</TextGridItem>
            </React.Fragment>
          )}
        </GridContainer>
      )}
    </div>
  )
}
