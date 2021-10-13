import React, { useEffect, useState, useContext } from 'react'
import { Radio } from 'antd'
import moment from 'moment'
import {
  GridContainer,
  GridItem,
  dateFormatLongWithTimeNoSec,
} from '@/components'
import { RightAlignGridItem, SectionTitle } from '../../../Components'
import { CombineOrderGrid } from './index'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'

export const OrderDetails = ({ workitem, onCombinedOrderChange }) => {
  const { visitPurpose } = useContext(WorklistContext)
  const [isCombinedOrder, setIsCombinedOrder] = useState(false)

  useEffect(() => {
    setIsCombinedOrder(workitem.primaryWorkitemFK ? true : false)

    return () => {
      setIsCombinedOrder(false)
    }
  }, [workitem])

  return (
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
                dateFormatLongWithTimeNoSec,
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
                  onCombinedOrderChange(value)
                }}
                readonly={workitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW}
              />
            </GridItem>
          </React.Fragment>
        )}
      </GridContainer>
    </div>
  )
}
