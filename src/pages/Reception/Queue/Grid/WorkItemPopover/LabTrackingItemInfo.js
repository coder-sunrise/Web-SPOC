import { IconButton, Popover, Tooltip } from '@/components'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'
import {
  LAB_SPECIMEN_STATUS,
  LAB_TRACKING_STATUS,
  WORK_ITEM_TYPES_ENUM,
} from '@/utils/constants'
import { useCodeTable } from '@/utils/hooks'
import New from '@/pages/ClaimSubmission/chas/New'
import React, { useState } from 'react'
import { Badge } from 'antd'
import _ from 'lodash'
import { useDispatch } from 'dva'
import moment from 'moment'
import { CheckCircleOutlined } from '@material-ui/icons'

const LabTrackingItemInfo = props => {
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
      type: 'labTrackingDetails/getLabTrackingDetailsForVisit',
      payload: {
        visitId: visitFK,
      },
    }).then(detailData => {
      setWorkItemDetails(detailData)
      setTotalWorkItemCount(detailData.length)
      setCompletedWorkItemCount(
        detailData.filter(
          t =>
            t.labTrackingStatusFK === LAB_TRACKING_STATUS.COMPLETED ||
            t.labTrackingStatusFK === LAB_TRACKING_STATUS.RECEIVED,
        ).length,
      )
    })
  }

  const getWorkItemDetails = () => {
    if (workItemDetails.length === 0) return
    let number = 0
    return workItemDetails.map(workItem => {
      number += 1
      return (
        <tr style={{ borderBottom: '1px solid #eeeeee' }}>
          <td style={{ width: '35px' }}>{number}</td>
          <td style={{ width: '150px', wordBreak: 'break-word' }}>
            {workItem.serviceName || '-'}
          </td>
          <td style={{ width: '150px', wordBreak: 'break-word' }}>
            {workItem.supplierName || '-'}
          </td>
          <td style={{ width: '165px', wordBreak: 'break-word' }}>
            {workItem.receivedDate
              ? moment(workItem.receivedDate).format('DD MMM YYYY HH:mm')
              : '-'}
          </td>
          <td
            style={{
              width: '120px',
              wordBreak: 'break-word',
              color:
                workItem.labTrackingStatusFK ===
                  LAB_TRACKING_STATUS.COMPLETED ||
                workItem.labTrackingStatusFK === LAB_TRACKING_STATUS.RECEIVED
                  ? 'green'
                  : 'black',
            }}
          >
            {workItem.labTrackingStatusDisplayValue || '-'}
          </td>
        </tr>
      )
    })
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      overlayInnerStyle={{
        maxHeight: 500,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      content={
        <div>
          <h5>External Tracking Details</h5>
          <table
            style={{
              fontSize: 14,
              marginTop: 5,
              tableLayout: 'fixed',
              minWidth: 250,
            }}
          >
            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
              <th style={{ width: '35px' }}>No.</th>
              <th style={{ width: '150px' }}>Service Name</th>
              <th style={{ width: '150px' }}>Supplier</th>
              <th style={{ width: '165px' }}>Received Date</th>
              <th style={{ minWidth: '120px' }}>Status</th>
            </tr>
            {getWorkItemDetails()}
          </table>
        </div>
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
            <IconFont type='icon-packing-labeling-fill' />
          </IconButton>
        </Badge>
      </div>
    </Popover>
  )
}

export default LabTrackingItemInfo
