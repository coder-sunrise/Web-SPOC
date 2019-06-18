import React, { PureComponent } from 'react'

import {
  EditableTableGrid2,
  CardContainer,
} from '@/components'

import { schemes, yesNo } from '@/utils/codes'

class SchemesGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  tableParas = {
    columns: [
      { name: 'scheme', title: 'Scheme' },
      { name: 'payer', title: 'Payer' },
      { name: 'accountNo', title: 'Account Number' },
      { name: 'validUntil', title: 'Valid Until' },
      { name: 'userAsMain', title: 'User as Main' },
    ],
    columnExtensions: [
      {
        columnName: 'validUntil',
        type: 'date',
      },
      {
        columnName: 'scheme',
        type: 'select',
        options: schemes,
      },
      {
        columnName: 'userAsMain',
        type: 'select',
        options: yesNo,
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
          type: `schemes/add`,
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
          type: `schemes/change`,
          payload: changed,
        })
      }

      if (deleted) {
        dispatch({
          type: `schemes/delete`,
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
        <EditableTableGrid2
          rows={items.filter(o => o.type === type)}
          onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{ edit: true }}
          EditingProps={EditingProps}
          {...this.tableParas}
        />
    )
  }
}

export default SchemesGrid
