import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { EditableTableGrid } from '@/components'

@connect(({ user }) => ({
  user,
}))
class AllergyGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  constructor (props) {
    super(props)

    const { type } = props

    const compareDate = (a, b) =>
      a.toLocaleString().localeCompare(b.toLocaleString())

    this.tableParas = {
      columns: [
        {
          name: type === 'Allergy' ? 'allergyFK' : 'allergyName',
          title: 'Allergy Name',
        },
        { name: 'allergyReactionFK', title: 'Allergic Reaction' },
        { name: 'onsetDate', title: 'Date' },
        { name: 'patientAllergyStatusFK', title: 'Status' },
      ],
      columnExtensions: [
        {
          columnName: 'onsetDate',
          type: 'date',
          compare: compareDate,
        },
        {
          columnName: 'allergyFK',
          type: 'codeSelect',
          code: 'ctdrugallergy',
          label: 'Allergy Name',
          autoComplete: true,
          onChange: ({ val, option, row }) => {
            if (option) {
              row.allergyCode = option.code || option.name
              row.allergyName = option.name
            }
          },
        },
        {
          columnName: 'allergyName',
          onChange: ({ val, row }) => {
            row.allergyCode = val
            row.allergyFK = 1
          },
        },
        {
          columnName: 'allergyReactionFK',
          type: 'codeSelect',
          label: 'Allergic Reaction',
          code: 'CTAllergyReaction',
        },
        {
          columnName: 'patientAllergyStatusFK',
          type: 'codeSelect',
          code: 'ctPatientAllergyStatus',
          label: 'Status',
        },
      ],
    }

    this.commitChanges = props.setArrayValue
    this.onAddedRowsChange = (addedRows) => {
      return addedRows.map((row) => ({
        onsetDate: moment(),
        ...row,
        confirmedByUserFK: props.user.data.id,
        isConfirmed: true,
        type,
      }))
    }
  }

  render () {
    const { isEditable, rows, schema } = this.props
    return (
      <EditableTableGrid
        rows={rows}
        schema={schema}
        FuncProps={{
          edit: isEditable,
          pager: false,
        }}
        EditingProps={{
          showAddCommand: isEditable,
          showEditCommand: isEditable,
          showDeleteCommand: isEditable,
          onCommitChanges: this.commitChanges,
          onAddedRowsChange: this.onAddedRowsChange,
        }}
        {...this.tableParas}
      />
    )
  }
}

export default AllergyGrid
