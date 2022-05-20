import React from 'react'
import { Table, TableSelection } from '@devexpress/dx-react-grid-material-ui'
import { Checkbox } from '@/components'

class PatchedTableSelection extends React.PureComponent {
  render() {
    const {
      rowSelectionEnabled = row => true,
      isSelectionEnabled = true,
      selection = [],
      ...restProps
    } = this.props
    return (
      <TableSelection
        cellComponent={props => {
          if (rowSelectionEnabled(props.tableRow.row)) {
            if (isSelectionEnabled) {
              return <TableSelection.Cell {...props} />
            }
            return (
              <Table.StubCell>
                <Checkbox
                  style={{ position: 'relative', left: 14 }}
                  checked={true}
                  disabled
                />
              </Table.StubCell>
            )
          }
          return <Table.StubCell {...props} />
        }}
        headerCellComponent={props => {
          if (isSelectionEnabled) {
            return <TableSelection.HeaderCell {...props} />
          }
          return (
            <Table.Cell
              style={{
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <Checkbox
                style={{ position: 'relative', left: 14 }}
                checked={props.allSelected}
                disabled
              />
            </Table.Cell>
          )
        }}
        {...restProps}
      />
    )
  }
}

export default PatchedTableSelection
