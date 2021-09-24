import {
  IconButton,
  Popover,
} from '@/components'
import { FileDoneOutlined } from '@ant-design/icons'
import { NURSE_WORKITEM_STATUS } from '@/utils/constants'

const NurseWorkItemInfo = ({ values = {} }) => {

  let completedWorkItemCount = 0
  let TotalWorkItemCount = 0
  let sortedWorkItem = []

  const sortedDateWorkedItem = _.orderBy(values, ['generateDate'], ['desc'])

  const completedWorkItemsCount = sortedDateWorkedItem.map(row => {
    const { nurseWorkitem } = row
    TotalWorkItemCount += 1
    if (nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED) {
      completedWorkItemCount += 1
    }
  })

  const sortingWorkItems = sortedDateWorkedItem.map(row => {
    const { nurseWorkitem } = row
    if (nurseWorkitem.priority === 'Urgent') {
        sortedWorkItem = [...sortedWorkItem,{...row,prior : 1}]
    } else {
        sortedWorkItem = [...sortedWorkItem,{...row,prior : 0}]
    }
  })

  const dotStyle = {
    height: '18px',
    width: '18px',
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    top: '-11px',
    right: '8px',
    textAlign: 'center',
    fontSize: 13,
    color: 'white',
  }

  const nurseWorkItemDetails = (row = []) => {
    if (row.length > 0) {
      let number = 0
      return row.map(row => {
        const { nurseWorkitem } = row
        number += 1
        return (
          <tr>
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
                width: '100px',
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
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
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
              <tr>
                <th style={{ width: '35px' }}>No.</th>
                <th style={{ width: '200px' }}>Name</th>
                <th style={{ width: '200px' }}>Instructions</th>
                <th style={{ width: '200px' }}>Remarks</th>
                <th style={{ width: '65px' }}>Priority</th>
                <th style={{ width: '100px' }}>Status</th>
              </tr>
            </table>
          </td>
        </tr>
        <td>
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            <table>{nurseWorkItemDetails(sortedWorkItem.sort((a,b) => b.prior - a.prior))}</table>
          </div>
        </td>
      </table>
      }
    >
      <div style={{ display: 'inline-block' }}>
        <IconButton
          style={{
            position: 'relative',
            color: 'white',
            backgroundColor:
              TotalWorkItemCount === completedWorkItemCount ? 'green' : '#4255bd',
          }}
          size='large'
        >
          <FileDoneOutlined />
        </IconButton>
        {completedWorkItemCount >= 1 && <span style={dotStyle}>{completedWorkItemCount}</span>}
        {completedWorkItemCount < 1 && (
          <div
            style={{
              width: '18px',
              display: 'inline-block',
              position: 'relative',
            }}
          />
        )}
      </div>
    </Popover>
  )
}

export default NurseWorkItemInfo