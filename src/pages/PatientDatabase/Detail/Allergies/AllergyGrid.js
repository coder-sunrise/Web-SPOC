import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { EditableTableGrid, notification, Icon } from '@/components'

@connect(({ user }) => ({
  user,
}))
class AllergyGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  constructor(props) {
    super(props)
    const { isEditable, type, codetable } = this.props

    // const compareDate = (a, b) =>
    //   a.toLocaleString().localeCompare(b.toLocaleString())
    let colName = 'allergyName'
    if (type === 'Allergy') colName = 'allergyFK'
    if (type === 'Ingredient') colName = 'ingredientFK'
    // console.log('type',type)

    this.tableParas = {
      columns: [
        {
          name: colName,
          title: 'Allergy Name',
        },
        { name: 'allergyReactionFK', title: 'Allergic Reaction' },
        { name: 'onsetDate', title: 'Onset Date' },
        { name: 'patientAllergyStatusFK', title: 'Status' },
      ],
      columnExtensions: [
        {
          columnName: 'onsetDate',
          type: 'date',
          isDisabled: () => {
            return !isEditable
          },
        },
        {
          columnName: 'ingredientFK',
          type: 'codeSelect',
          code: 'ctmedicationingredient',
          label: 'Allergy Name',
          autoComplete: true,
          isDisabled: () => {
            return !isEditable
          },
          onChange: ({ val, option, row }) => {
            if (option) {
              let { rows } = this.props
              if (
                rows.filter(
                  o =>
                    !o.isDeleted && o.ingredientFK === val && o.id !== row.id,
                ).length > 0
              ) {
                row.ingredientFK = null
                notification.error({
                  message: 'The Allergy record already exists.',
                })
              } else {
                // row.allergyCode = option.code || option.name
                row.allergyName = option.name
              }
            }
          },
        },
        {
          columnName: 'allergyFK',
          type: 'codeSelect',
          labelField: 'displayValue',
          label: 'Allergy Name',
          valueField: 'id',
          code: 'ctdrugallergy',
          isDisabled: () => {
            return !isEditable
          },
          autoComplete: true,
          onChange: ({ val, option, row }) => {
            if (option) {
              let { rows } = this.props
              if (
                rows.filter(
                  o => !o.isDeleted && o.allergyFK === val && o.id !== row.id,
                ).length > 0
              ) {
                row.allergyFK = null
                notification.error({
                  message: 'The Allergy record already exists.',
                })
              }

              row.allergyName = option.displayValue
            }
          },
        },
        {
          columnName: 'allergyName',
          maxLength: 100,
          isDisabled: () => {
            return !isEditable
          },
          onChange: ({ val, row }) => {
            // row.allergyCode = val
            // row.allergyFK = 1
          },
        },
        {
          columnName: 'allergyReactionFK',
          type: 'codeSelect',
          label: 'Allergic Reaction',
          code: 'CTAllergyReaction',
          isDisabled: () => {
            return !isEditable
          },
        },
        {
          columnName: 'patientAllergyStatusFK',
          type: 'codeSelect',
          code: 'ctPatientAllergyStatus',
          label: 'Status',
          isDisabled: () => {
            return !isEditable
          },
        },
      ],
    }

    this.commitChanges = props.setArrayValue
    this.onAddedRowsChange = addedRows => {
      return addedRows.map(row => ({
        onsetDate: moment(),
        patientAllergyStatusFK: 1,
        ...row,
        confirmedByUserFK: props.user.data.id,
        isConfirmed: true,
        type,
      }))
    }
  }

  render() {
    const { isEditable, rows, schema } = this.props
    return (
      <EditableTableGrid
        forceRender
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
