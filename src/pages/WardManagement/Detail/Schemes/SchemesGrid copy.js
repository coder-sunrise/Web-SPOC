import React, { PureComponent } from 'react'
import _ from 'lodash'
import { EditableTableGrid, notification } from '@/components'

import Yup from '@/utils/yup'
import { getCodes } from '@/utils/codes'
import { getUniqueNumericId } from '@/utils/utils'

let schemeTypes = []
getCodes('ctSchemeType').then((codetableData) => {
  schemeTypes = codetableData
})

const schema = Yup.array().unique(
  (v) => `${v.schemeTypeFK}-${v.coPaymentSchemeFK}`,
  'error',
  () => {
    notification.error({
      message: 'The Schemes record already exists in the system',
    })
  },
)

class SchemesGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
    rows: null, // Save current row data for logic checking
  }

  tableParas = {
    columns: [
      { name: 'schemeTypeFK', title: 'Scheme Type' },
      { name: 'coPaymentSchemeFK', title: 'Scheme Name' },
      { name: 'accountNumber', title: 'Account Number' },
      { name: 'validRange', title: 'Valid Period' },
    ],
    columnExtensions: [
      {
        columnName: 'validRange',
        type: 'daterange',
        getInitialValue: (row) => {
          return [
            row.validFrom,
            row.validTo,
          ]
        },
        isDisabled: (row) => {
          return this.isMedisave(row)
        },
        // onChange: (date, moments, org, row) => {
        //   row.validFrom = date[0]
        //   row.validTo = date[1]

        //   console.log(date, row)
        // },
      },
      {
        columnName: 'schemeTypeFK',
        type: 'codeSelect',
        code: 'ctSchemeType',
        // onChange: (val, option, row, onValueChange) => {
        //   console.log(val, option, row, onValueChange, this.props.rows)
        // },
      },
      {
        columnName: 'coPaymentSchemeFK',
        // type: 'codeSelect',
        // code: 'ctSchemeCategory',
        type: 'select', // TODO: get from api
        options: [
          { value: 1, name: 'Test 01' },
          { value: 2, name: 'Test 02' },
          { value: 3, name: 'Test 03' },
        ],
        isDisabled: (row) => {
          return !this.isCorporate(row)
        },
      },
      {
        columnName: 'accountNumber',
        isDisabled: (row) => {
          return !this.isCorporate(row)
        },
      },
    ],
  }

  constructor (props) {
    super(props)

    const { title, titleChildren, dispatch, type } = props
    const { state } = this
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { rows } = nextProps

    if (rows && rows.length > 0 && !preState.rows)
      return {
        rows,
      }

    return null
  }

  isCorporate = (row) => {
    return row.schemeTypeFK === 11
  }

  isCHAS = (row) => {
    return row.schemeTypeFK <= 5
  }

  isMedisave = (row) => {
    const r = schemeTypes.find((o) => o.id === row.schemeTypeFK)
    if (!r) return false
    return (
      [
        'MEDI500VISUT',
        'FLEXIMEDI',
        'OPSCAN',
      ].indexOf(r.code) >= 0
    )
  }

  getSortedRows = (rows) => {
    return _.orderBy(rows, [
      'sequence',
      'schemeTypeFK',
    ])
  }

  onRowChangesChange = (changes) => {
    this.setState((preSate) => {
      return {
        rows: preSate.rows.map(
          (row) => (changes[row.id] ? { ...row, ...changes[row.id] } : row),
        ),
      }
    })
    return changes
  }

  onDeletedRowIdsChange = (ids) => {
    this.setState((preSate) => {
      return {
        rows: preSate.rows.filter((o) => ids.indexOf(o.id) < 0),
      }
    })
    return ids
  }

  onAddedRowsChange = (addedRows) => {
    const newRows = addedRows
      .map((o) => {
        return {
          id: getUniqueNumericId(),
          isNew: true,
          ...o,
        }
      })
      .concat(this.state.rows.filter((o) => !o.isNew))
    this.setState((preSate) => {
      return {
        rows: newRows,
      }
    })
    this.checkDataValidity(newRows)
    return addedRows
  }

  onRowMove = (row, dirt) => {
    const { setFieldValue, rows } = this.props
    const newRows = this.getSortedRows(rows)
    // console.log(newRows)
    const r = newRows.find((o) => o.id === row.id)
    const i = newRows.indexOf(r)
    // newRows.forEach((o, idx) => {
    //   if (o.schemeTypeFK === 11) o.sequence = idx
    // })
    // console.log(i)
    if (dirt === 'UP') {
      if (i - 1 >= 0) {
        newRows[i - 1].sequence = i
      }
      r.sequence = i - 1
    } else if (dirt === 'DOWN') {
      if (i + 1 <= rows.length) {
        newRows[i + 1].sequence = i
      }
      r.sequence = i + 1
    }
    setFieldValue('patientScheme', newRows)

    // console.log(row, dirt, newRows)
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.props
    const newRows = this.getSortedRows(rows)
    newRows.forEach((r, i) => {
      if (r.validRange) {
        r.validFrom = r.validRange[0]
        r.validTo = r.validRange[1]
      }
      r.sequence = this.isCorporate(r) ? i : 0
    })

    setFieldValue('patientScheme', newRows)
  }

  checkDataValidity = (rows) => {
    schema.validateSync(rows)

    if (rows.filter((o) => !o.isDeleted && this.isCHAS(o)).length > 1) {
      notification.error({
        message: 'Patient already has a CHAS Scheme Added',
      })
    }
  }

  render () {
    const { editingRowIds, rowChanges, rows } = this.state
    const { type, schema } = this.props
    const EditingProps = {
      showAddCommand: true,
      onRowChangesChange: this.onRowChangesChange,
      onAddedRowsChange: this.onAddedRowsChange,
      onDeletedRowIdsChange: this.onDeletedRowIdsChange,
      onCommitChanges: this.commitChanges,
    }

    return (
      <EditableTableGrid
        rows={this.getSortedRows(this.props.rows)}
        rowMoveable={this.isCorporate}
        onRowMove={this.onRowMove}
        FuncProps={{ pager: false }}
        EditingProps={EditingProps}
        schema={schema}
        {...this.tableParas}
      />
    )
  }
}

export default SchemesGrid
