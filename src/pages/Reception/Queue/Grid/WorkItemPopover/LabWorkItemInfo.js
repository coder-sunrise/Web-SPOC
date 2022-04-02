import { IconButton, Popover } from '@/components'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'
import { LAB_WORKITEM_STATUS, WORK_ITEM_TYPES_ENUM } from '@/utils/constants'
import { useCodeTable } from '@/utils/hooks'
import New from '@/pages/ClaimSubmission/chas/New'
import React, { useState } from 'react'
import { Badge } from 'antd'
import _ from 'lodash'
import { useDispatch } from 'dva'

const LabWorkItemInfo = props => {
  const { workItemSummary, visitFK, style, workItemFK } = props
  const dispatch = useDispatch()
  const [completedWorkItemCount, setCompletedWorkItemCount] = useState(
    workItemSummary.completedWorkItemCount || 0,
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
        workItemType: WORK_ITEM_TYPES_ENUM.LAB,
        workItemFK: workItemFK,
      },
    }).then(detailData => {
      const workItemFKArray = _.uniqBy(detailData, 'workitemFK').map(
        t => t.workitemFK,
      )
      _.forEach(detailData, item => {
        ;(item.number = workItemFKArray.indexOf(item.workitemFK) + 1),
          (item.rowspan = detailData.filter(
            t => t.workitemFK === item.workitemFK,
          ).length),
          (item.ishide =
            detailData.indexOf(detailData.find(x => x.id === item.id)) !=
            detailData.indexOf(
              detailData.filter(x => x.workitemFK === item.workitemFK)[0],
            ))
      })
      setWorkItemDetails(detailData)
      setTotalWorkItemCount(detailData.length)
      setCompletedWorkItemCount(
        detailData.filter(t => t.statusFK === LAB_WORKITEM_STATUS.COMPLETED)
          .length,
      )
    })
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      overlayStyle={{ maxHeight: 200 }}
      content={
        <table
          style={{
            fontSize: 14,
            tableLayout: 'fixed',
            minWidth: 250,
          }}
        >
          <tr>
            <th style={{ width: '35px' }}>No.</th>
            <th style={{ width: '150px' }}>Name</th>
            <th style={{ width: '150px' }}>Instructions</th>
            <th style={{ width: '150px' }}>Remarks</th>
            <th style={{ width: '65px' }}>Priority</th>
            <th style={{ minWidth: '120px' }}>Test Panels</th>
            <th>Status</th>
          </tr>

          {workItemDetails.map((labWorkitem, index) => (
            <tr>
              {!labWorkitem.ishide && (
                <td
                  rowspan={labWorkitem.rowspan}
                  style={{ width: '35px', verticalAlign: 'top' }}
                >
                  {labWorkitem.number}
                </td>
              )}
              {!labWorkitem.ishide && (
                <td
                  rowspan={labWorkitem.rowspan}
                  style={{ width: '150px', verticalAlign: 'top' }}
                >
                  {labWorkitem.name || '-'}
                </td>
              )}
              {!labWorkitem.ishide && (
                <td
                  rowspan={labWorkitem.rowspan}
                  style={{ width: '150px', verticalAlign: 'top' }}
                >
                  {labWorkitem.instructions || '-'}
                </td>
              )}
              {!labWorkitem.ishide && (
                <td
                  rowspan={labWorkitem.rowspan}
                  style={{ width: '150px', verticalAlign: 'top' }}
                >
                  {labWorkitem.remarks || '-'}
                </td>
              )}
              {!labWorkitem.ishide && (
                <td
                  rowspan={labWorkitem.rowspan}
                  style={{
                    width: '65px',
                    color: labWorkitem.priority === 'Urgent' ? 'red' : 'black',
                    verticalAlign: 'top',
                  }}
                >
                  {labWorkitem.priority || '-'}
                </td>
              )}
              <td style={{ width: 120 }}>{labWorkitem.testPanelName}</td>
              <td
                style={{
                  color:
                    labWorkitem.statusFK === LAB_WORKITEM_STATUS.COMPLETED
                      ? 'green'
                      : 'black',
                }}
              >
                {labWorkitem.statusFK === LAB_WORKITEM_STATUS.NEW ||
                labWorkitem.statusFK === LAB_WORKITEM_STATUS.SPECIMENCOLLECTED
                  ? 'New'
                  : labWorkitem.statusFK === LAB_WORKITEM_STATUS.COMPLETED
                  ? 'Completed'
                  : 'In Progress'}
              </td>
            </tr>
          ))}
        </table>
      }
    >
      <div style={{ display: 'inline-block', ...style, marginRight: 15 }}>
        <Badge
          color='red'
          count={completedWorkItemCount}
          style={{ paddingRight: 4, paddingLeft: 4 }}
          size='small'
        >
          <IconButton
            style={{
              position: 'relative',
              top: '0px',
              color: 'white',
              backgroundColor:
                totalWorkItemCount === completedWorkItemCount &&
                totalWorkItemCount > 0
                  ? 'green'
                  : '#4255bd',
            }}
            size='large'
            onClick={getDetails}
          >
            <IconFont type='icon-lab' />
          </IconButton>
        </Badge>
      </div>
    </Popover>
  )
}

export default LabWorkItemInfo
