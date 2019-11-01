import React from 'react'
import { Table, TableSelection } from '@devexpress/dx-react-grid-material-ui'

class PatchedTableSelection extends React.PureComponent {
  render () {
    const { rowSelectionEnabled = (row) => true, ...restProps } = this.props

    return (
      <TableSelection
        cellComponent={(props) =>
          this.props.rowSelectionEnabled(props.tableRow.row) ? (
            <TableSelection.Cell {...props} />
          ) : (
            <Table.StubCell {...props} />
          )}
        {...restProps}
      />
    )
  }
}

export default PatchedTableSelection
