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
      { name: 'schemeTypeFK', title: 'Scheme Type' },
      { name: 'coPaymentSchemeFK', title: 'Scheme Name' },
      { name: 'accountNumber', title: 'Account Number' },
      { name: 'validFrom', title: 'Valid From' },
      { name: 'validTo', title: 'Valid To' },
    ],
    columnExtensions: [
      {
        columnName: 'validFrom',
        type: 'date',
      },
      {
        columnName: 'validTo',
        type: 'date',
      },
      {
        columnName: 'schemeTypeFK',
        type: 'codeSelect',
        code: 'SchemeType',
        label: 'scheme',
      },
      {
        columnName: 'coPaymentSchemeFK',
        type: 'codeSelect',
        code: 'SchemeCategory',
        label: 'coscheme',
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


    this.commitChanges = ({rows, added, changed, deleted }) => {
      const {setFieldValue } = this.props
      setFieldValue('patientScheme',rows)
    }
  }

  render () {
    const { editingRowIds, rowChanges } = this.state
    const { type,rows } = this.props

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
          rows={rows}
          onRowDoubleClick={this.onRowDoubleClick}
          FuncProps={{ edit: true }}
          EditingProps={EditingProps}
          {...this.tableParas}
        />
    )
  }
}

export default SchemesGrid
