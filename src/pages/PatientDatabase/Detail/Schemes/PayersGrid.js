import React, { PureComponent } from 'react'

import {
  EditableTableGrid2,
  CardContainer,
} from '@/components'

class PayersGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  tableParas = {
    columns: [
      { name: 'payerName', title: 'Payer Name' },
      { name: 'payerId', title: 'Payer ID' },
      { name: 'dateOfBirth', title: 'Date of Birth' },
      { name: 'relationship', title: 'Relationship' },
    ],
    columnExtensions: [
      {
        columnName: 'dateOfBirth',
        type: 'date',
      },
    ],
  }

  constructor(props) {
    super(props)

    const { title, titleChildren, dispatch, type } = props
    const { state } = this

    this.titleComponent = (
      <div style={{ position: 'relative' }}>
        {title}
        {titleChildren}
      </div>
    )

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds })
    this.changeRowChanges = rowChanges => this.setState({ rowChanges })

    this.onRowDoubleClick = row => {
      if (!state.editingRowIds.find(o => o === row.Id)) {
        this.setState({
          editingRowIds: state.editingRowIds.concat([
            row.Id,
          ]),
        })
      }
    }

    this.commitChanges = ({ added, changed, deleted }) => {
      if (added) {
        this.props.dispatch({
          type: `payers/add`,
          payload: added.map(o => {
            return {
              type,
              ...o,
            }
          }),
        })
      }

      if (changed) {
        this.props.dispatch({
          type: `payers/change`,
          payload: changed,
        })
      }

      if (deleted) {
        dispatch({
          type: `payers/delete`,
          payload: deleted,
        })
      }
    }
  }

  render () {
    const { editingRowIds, rowChanges } = this.state
    const { entity: { items }, type } = this.props

    const EditingProps = {
      showAddCommand: true,
      editingRowIds,
      rowChanges,
      onEditingRowIdsChange: this.changeEditingRowIds,
      onRowChangesChange: this.changeRowChanges,
      onCommitChanges: this.commitChanges,
    }

    return (
      <CardContainer title={this.titleComponent}>
        <EditableTableGrid2
          rows={items.filter(o => o.type === type)}
          onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{ edit: true }}
          EditingProps={EditingProps}
          {...this.tableParas}
        />
      </CardContainer>
    )
  }
}

export default PayersGrid
