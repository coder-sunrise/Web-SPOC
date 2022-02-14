import { IconButton, Popover } from '@/components'
import { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '@/defaultSettings'
import { LAB_WORKITEM_STATUS } from '@/utils/constants'
import { useCodeTable } from '@/utils/hooks'
import New from '@/pages/ClaimSubmission/chas/New'

const LabWorkItemInfo = ({ values = [], style }) => {
  const cttestpanels = useCodeTable('cttestpanel')
  const cttestcategories = useCodeTable('cttestcategory')

  let IconFont = createFromIconfontCN({
    scriptUrl: defaultSettings.iconfontUrl,
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

  const totalWorkItemCount = values.length
  const completedWorkItemCount = values.filter(
    item => item.statusFK === LAB_WORKITEM_STATUS.COMPLETED,
  ).length

  const getStatusSortValue = item => {
    //Sort Completed on top, in-progress statuses , then the New
    return item.statusFK === LAB_WORKITEM_STATUS.COMPLETED
      ? 1
      : item.statusFK !== New
      ? 2
      : 3
  }

  const sortedLabWorkitems = values
    .map(item => ({
      ...item,
      testPanel: cttestpanels.find(x => x.id === item.testPanelFK)?.name,
      testCategorySortVal: cttestcategories.find(
        item => item.id === item.testCategoryFK,
      )?.sortOrder,
      statusSortVal: getStatusSortValue(item),
    }))
    .sort((a, b) => {
      return a.statusSortVal === b.statusSortVal
        ? 0
        : a.testCategorySortVal < b.testCategorySortVal
        ? -1
        : 1
    })

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={
        <table
          style={{
            fontSize: 14,
            tableLayout: 'fixed',
            minWidth: 250,
          }}
        >
          <tr>
            <th style={{ minWidth: '120' }}>Test Panels</th>
            <th>Status</th>
          </tr>

          {sortedLabWorkitems.map(labWorkitem => (
            <tr>
              <td>{labWorkitem.testPanel}</td>
              <td
                style={{
                  color:
                    labWorkitem.statusFK === LAB_WORKITEM_STATUS.COMPLETED
                      ? 'green'
                      : 'black',
                }}
              >
                {labWorkitem.statusFK === LAB_WORKITEM_STATUS.New
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
      <div style={{ display: 'inline-block', ...style }}>
        <IconButton
          style={{
            position: 'relative',
            top: '0px',
            color: 'white',
            backgroundColor:
              totalWorkItemCount === completedWorkItemCount
                ? 'green'
                : '#4255bd',
          }}
          size='large'
        >
          <IconFont type='icon-lab' />
        </IconButton>
        {completedWorkItemCount >= 1 && (
          <span style={dotStyle}>{completedWorkItemCount}</span>
        )}
      </div>
    </Popover>
  )
}

export default LabWorkItemInfo
