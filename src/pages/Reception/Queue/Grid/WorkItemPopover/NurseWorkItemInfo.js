import { IconButton, Popover } from '@/components'
import { FileDoneOutlined } from '@ant-design/icons'
import { NURSE_WORKITEM_STATUS, WORK_ITEM_TYPES_ENUM } from '@/utils/constants'
import React, { useState } from 'react'
import { Badge } from 'antd'
import { useDispatch } from 'dva'

const NurseWorkItemInfo = props => {
  const { workItemSummary, visitFK } = props
  const dispatch = useDispatch()
  const [completedWorkItemCount, setCompletedWorkItemCount] = useState(
    workItemSummary.completedWorkItemCount || 0,
  )
  const [totalWorkItemCount, setTotalWorkItemCount] = useState(
    workItemSummary.totalWorkItem || 0,
  )
  const [workItemDetails, setWorkItemDetails] = useState([])
  let sortedWorkItem = []
  const sortedDateWorkedItem = []

  const getDetails = () => {
    dispatch({
      type: 'queueLog/getWorkItemDetailStatus',
      payload: {
        visitFK: visitFK,
        workItemType: WORK_ITEM_TYPES_ENUM.NURSEACTUALIZE,
      },
    }).then(detailData => {
      setWorkItemDetails(detailData)
      setTotalWorkItemCount(detailData.length)
      setCompletedWorkItemCount(
        detailData.filter(t => t.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED)
          .length,
      )
    })
  }

  const nurseWorkItemDetails = (row = []) => {
    if (row.length == 0) return
    let number = 0
    return row.map(nurseWorkitem => {
      number += 1
      return (
        <tr style={{ borderBottom: '1px solid #eeeeee' }}>
          <td style={{ width: '35px' }}>{number}</td>
          <td style={{ width: '200px' }}>{nurseWorkitem.name || '-'}</td>
          <td style={{ width: '200px' }}>
            {nurseWorkitem.instructions || '-'}
          </td>
          <td style={{ width: '200px' }}>{nurseWorkitem.remarks || '-'}</td>
          <td
            style={{
              width: '65px',
              color: nurseWorkitem.priority === 'Urgent' ? 'red' : 'black',
            }}
          >
            {nurseWorkitem.priority || '-'}
          </td>
          <td
            style={{
              width: '120px',
              color:
                nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
                  ? 'green'
                  : 'black',
            }}
          >
            {nurseWorkitem.status}
          </td>
        </tr>
      )
    })
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      overlayStyle={{ maxHeight: 350 }}
      arrowPointAtCenter
      content={
        <table
          style={{
            fontSize: 14,
          }}
        >
          <tr>
            <td>
              <table
                style={{
                  fontWeight: 'bold',
                }}
              >
                <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                  <th style={{ width: '35px' }}>No.</th>
                  <th style={{ width: '200px' }}>Name</th>
                  <th style={{ width: '200px' }}>Instructions</th>
                  <th style={{ width: '200px' }}>Remarks</th>
                  <th style={{ width: '65px' }}>Priority</th>
                  <th style={{ width: '120px' }}>Status</th>
                </tr>
              </table>
            </td>
          </tr>
          <td>
            <div style={{ maxHeight: '250px', overflow: 'auto' }}>
              <table>{nurseWorkItemDetails(workItemDetails)}</table>
            </div>
          </td>
        </table>
      }
    >
      <div style={{ display: 'inline-block', marginRight: 15 }}>
        <Badge
          color='red'
          count={completedWorkItemCount}
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
            onClick={getDetails}
            size='large'
          >
            <FileDoneOutlined />
          </IconButton>
        </Badge>
      </div>
    </Popover>
  )
}

export default NurseWorkItemInfo
