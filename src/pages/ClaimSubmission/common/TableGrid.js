import React from 'react'
// /dx-react-grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
import NearMe from '@material-ui/icons/NearMe'
import Money from '@material-ui/icons/AttachMoney'
// common components
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { CommonTableGrid, Tooltip } from '@/components'
// sub component

const TableGrid = ({
  data,
  columns,
  columnExtensions,
  tableConfig,
  selection,
  onSelectionChange,
  onContextMenuItemClick,
  contextMenuOptions = undefined,
  type,
}) => {
  const Cell = React.memo(({ ...tableProps }) => {
    const handleMenuItemClick = (row, id) => {
      // onContextMenuItemClick(event.currentTarget, tableProps.row)
      onContextMenuItemClick(row, id)
    }

    const defaultContextMenuOptions = [
      {
        id: 0,
        label: 'Claim Details',
        Icon: NearMe,
      },
      {
        id: 1,
        label: 'Invoice Detail',
        Icon: Money,
      },
    ]
    const options =
      contextMenuOptions !== undefined
        ? contextMenuOptions.map((item) => ({
            ...item,
            onClick: handleMenuItemClick,
          }))
        : defaultContextMenuOptions

    if (tableProps.column.name === 'action') {
      return (
        <Table.Cell {...tableProps}>
          <Tooltip title='More Actions' placement='bottom'>
            <div style={{ display: 'inline-block' }}>
              <GridButton
                row={tableProps.row}
                contextMenuOptions={options}
                onClick={handleMenuItemClick}
              />
            </div>
          </Tooltip>
        </Table.Cell>
      )
    }

    return <Table.Cell {...tableProps} />
  })

  const currentType = () => {
    switch (type) {
      case 'draft': {
        return 'claimSubmissionDraft'
      }
      case 'new': {
        return 'claimSubmissionNew'
      }
      case 'approved': {
        return 'claimSubmissionApproved'
      }
      case 'rejected': {
        return 'claimSubmissionRejected'
      }
      case 'submitted': {
        return 'claimSubmissionSubmitted'
      }
      default: {
        return 'claimSubmissionNew'
      }
    }
  }

  return (
    <CommonTableGrid
      getRowId={(row) => row.id}
      type={currentType()}
      // rows={data}
      columns={columns}
      columnExtensions={columnExtensions}
      {...tableConfig}
      selection={selection}
      onSelectionChange={onSelectionChange}
      ActionProps={{ TableCellComponent: Cell }}
    />
  )
}

export default React.memo(TableGrid)
