import { IconButton, Popover, Tooltip } from '@/components'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'
import {
  RADIOLOGY_WORKITEM_STATUS,
  WORK_ITEM_TYPES,
  WORK_ITEM_TYPES_ENUM,
} from '@/utils/constants'
import _ from 'lodash'
import React, { useState } from 'react'
import { Badge } from 'antd'
import { useDispatch } from 'dva'
import { CheckCircleOutlined } from '@material-ui/icons'
import workitem from '@/models/workitem'
import moment from 'moment'

const RadioWorkItemInfo = props => {
  const { workItemSummary, visitFK } = props
  const dispatch = useDispatch()
  const [completedWorkItemCount, setCompletedWorkItemCount] = useState(
    workItemSummary.completedWorkItemCount || 0,
  )
  const [realCompletedWorkItemCount, setRealCompletedWorkItemCount] = useState(
    workItemSummary.realCompletedWorkItemCount || 0,
  )
  const [totalWorkItemCount, setTotalWorkItemCount] = useState(
    workItemSummary.totalWorkItem || 0,
  )
  const [workItemDetails, setWorkItemDetails] = useState([])
  let IconFont = createFromIconfontCN({
    scriptUrl: defaultSettings.iconfontUrl,
  })
  const getDetails = () => {
    dispatch({
      type: 'queueLog/getWorkItemDetailStatus',
      payload: {
        visitFK: visitFK,
        workItemType: WORK_ITEM_TYPES_ENUM.RADIOLOGY,
      },
    }).then(detailData => {
      setWorkItemDetails(detailData)
      setTotalWorkItemCount(detailData.length)
      setCompletedWorkItemCount(
        detailData.filter(
          t =>
            t.statusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
            t.statusFK === RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ||
            t.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED,
        ).length,
      )
      setRealCompletedWorkItemCount(
        detailData.filter(
          t =>
            t.statusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
            t.statusFK === RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED,
        ).length,
      )
    })
  }

  const radioWorkItemDetails = (row = []) => {
    if (row.length === 0) return
    let number = 0
    return row.map(workItem => {
      number += 1
      return (
        <tr style={{ borderBottom: '1px solid #eeeeee' }}>
          <td style={{ width: '35px' }}>{number}</td>
          <td style={{ width: '200px', wordBreak: 'break-word' }}>
            {workItem.name || '-'}
          </td>
          <td style={{ width: '200px', wordBreak: 'break-word' }}>
            {workItem.instructions || '-'}
          </td>
          <td style={{ width: '200px', wordBreak: 'break-word' }}>
            {workItem.remarks || '-'}
          </td>
          <td
            style={{
              width: '65px',
              wordBreak: 'break-word',
              color: workItem.priority === 'Urgent' ? 'red' : 'black',
            }}
          >
            {workItem.priority || '-'}
          </td>
          <td
            style={{
              width: '140px',
              wordBreak: 'break-word',
              color:
                workItem.statusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
                workItem.statusFK ===
                  RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED
                  ? 'green'
                  : 'black',
            }}
          >
            {workItem.status}
          </td>
        </tr>
      )
    })
  }

  return (
    <Popover
      icon={null}
      overlayStyle={{ maxHeight: 350 }}
      placement='bottomLeft'
      arrowPointAtCenter
      content={
        <div>
          <h5>Radiology Work Item Details</h5>
          <table
            style={{
              fontSize: 14,
              marginTop: 5,
            }}
          >
            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
              <td>
                <table
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  <tr>
                    <th style={{ width: '35px' }}>No.</th>
                    <th style={{ width: '200px' }}>Name</th>
                    <th style={{ width: '200px' }}>Instructions</th>
                    <th style={{ width: '200px' }}>Remarks</th>
                    <th style={{ width: '65px' }}>Priority</th>
                    <th style={{ width: '140px' }}>Status</th>
                  </tr>
                </table>
              </td>
            </tr>
            <td>
              <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                <table>{radioWorkItemDetails(workItemDetails)}</table>
              </div>
            </td>
          </table>
        </div>
      }
    >
      <div style={{ display: 'inline-block', marginRight: 15 }}>
        <Badge
          color='red'
          count={realCompletedWorkItemCount}
          style={{ paddingRight: 4, paddingLeft: 4 }}
          size='small'
        >
          <IconButton
            style={{
              position: 'relative',
              color: 'white',
              backgroundColor:
                totalWorkItemCount === completedWorkItemCount
                  ? 'green'
                  : '#4255bd',
            }}
            size='large'
            onClick={getDetails}
          >
            <IconFont type='icon-radiology' />
          </IconButton>
        </Badge>
      </div>
    </Popover>
  )
}

export default RadioWorkItemInfo
