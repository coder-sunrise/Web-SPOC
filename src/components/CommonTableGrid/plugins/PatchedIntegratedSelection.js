import React from 'react'
import { Getter, Plugin } from '@devexpress/dx-react-core'
import { IntegratedSelection } from '@devexpress/dx-react-grid'

class PatchedIntegratedSelection extends React.PureComponent {
  render () {
    const { rowSelectionEnabled, ...restProps } = this.props
    return (
      <Table.Row
        {...restProps}
        onDoubleClick={(event) => {
          onRowDoubleClick && onRowDoubleClick(row || tableRow.row, event)
        }}
        onClick={(event) => {
          onRowClick(row, event)
        }}
        onContextMenu={(event) => {
          onContextMenu && onContextMenu(row || tableRow.row, event)
        }}
        className={
          typeof rowMoveable === 'function' && rowMoveable(row) ? (
            'moveable'
          ) : (
            ''
          )
        }
      />
    )
  }
}

export default PatchedIntegratedSelection
