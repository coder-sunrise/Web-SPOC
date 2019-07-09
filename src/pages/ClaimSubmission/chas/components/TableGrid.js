import React from 'react'
// /dx-react-grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
import NearMe from '@material-ui/icons/NearMe'
import Money from '@material-ui/icons/AttachMoney'
// common components
import { CommonTableGrid2, Tooltip } from '@/components'
// sub component
import GridButton from './GridButton'

const TableGrid = ({
  data,
  columns,
  columnExtensions,
  tableConfig,
  onContextMenuItemClick,
}) => {
  const Cell = React.memo(({ ...tableProps }) => {
    const handleMenuItemClick = (event) => {
      onContextMenuItemClick(event.currentTarget, tableProps.row)
    }

    if (tableProps.column.name === 'action') {
      return (
        <Table.Cell {...tableProps}>
          <Tooltip title='More Actions' placement='bottom'>
            <div style={{ display: 'inline-block' }}>
              <GridButton
                row={tableProps.row}
                ContextMenuOptions={[
                  {
                    id: 0,
                    label: 'Claim Details',
                    Icon: NearMe,
                    onClick: handleMenuItemClick,
                  },
                  {
                    id: 1,
                    label: 'Invoice Detail',
                    Icon: Money,

                    onClick: handleMenuItemClick,
                  },
                ]}
              />
            </div>
          </Tooltip>
        </Table.Cell>
      )
    }

    return <Table.Cell {...tableProps} />
  })

  return (
    <CommonTableGrid2
      rows={data}
      columns={columns}
      columnExtensions={columnExtensions}
      {...tableConfig}
      ActionProps={{ TableCellComponent: Cell }}
    />
  )
}

export default React.memo(TableGrid)
