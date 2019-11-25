import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { EditableTableGrid, notification } from '@/components'

import { getCodes } from '@/utils/codes'

// let schemeTypes = []
// getCodes('ctSchemeType').then((codetableData) => {
//   schemeTypes = codetableData
// })

const ctSchemeType = 'ctSchemeType'
let commitCount = 1000 // uniqueNumber
@connect(({ codetable }) => ({ codetable }))
class SchemesGrid extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  constructor (props) {
    super(props)

    const { title, titleChildren, dispatch, type } = props
    const { state } = this

    this.tableParas = {
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
          sortingEnabled: false,
          isDisabled: (row) => {
            return this.isMedisaveOrPHPC(row)
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

          sortingEnabled: false,
          onChange: ({ val, option, row, onValueChange }) => {
            let { rows } = this.props
            if (!row.id) {
              rows = rows.concat([
                row,
              ])
            }
            const ctSchemeTypes = this.props.codetable[
              ctSchemeType.toLowerCase()
            ]
            const st = ctSchemeTypes.find((o) => o.id === val)
            if (!st) return
            // console.log('schemesgrid', { rows, st })
            if (this.isMedisaveOrPHPC(row)) {
              row.validRange = []
              row.validFrom = undefined
              row.validTo = undefined
              // row.accountNumber = undefined
            }
            // console.log('row', row)
            const rs = rows.filter(
              (o) =>
                !o.isDeleted &&
                o.schemeTypeFK === val &&
                st.code !== 'CORPORATE' &&
                o.id !== row.id,
            )
            if (rs.length >= 1) {
              row.schemeTypeFK = undefined
              notification.error({
                message: 'The Schemes record already exists in the system',
              })
            }
            if (
              this.isCHAS(val) &&
              rows.filter(
                (o) =>
                  !o.isDeleted &&
                  this.isCHAS(o.schemeTypeFK) &&
                  o.id !== row.id,
              ).length > 0
            ) {
              row.schemeTypeFK = undefined

              notification.error({
                message: 'Patient already has a CHAS Scheme Added',
              })
            }
            // console.log(row, rows)

            if (
              this.medisaveCheck(row) &&
              rows.filter(
                (o) => !o.isDeleted && this.medisaveCheck(o) && o.id !== row.id,
              ).length > 0
            ) {
              row.schemeTypeFK = undefined

              notification.error({
                message:
                  'Patient can only either Medisave 500 Visit or Outpantient Scan at any point of time',
              })
              return
            }
            if (st.code !== 'CORPORATE' && row.coPaymentSchemeFK) {
              row.coPaymentSchemeFK = undefined
            }

            // this.props.dispatch({
            //   // force current edit row components to update
            //   type: 'global/updateState',
            //   payload: {
            //     commitCount: commitCount++,
            //   },
            // })
          },
          isDisabled: (row) => {
            return this.isExistingRow(row)
          },
        },
        {
          columnName: 'coPaymentSchemeFK',
          sortingEnabled: false,
          type: 'codeSelect',
          // code: 'ctschemecategory',
          code: 'coPaymentScheme',
          // remoteFilter: {
          //   schemeCategoryFK: 5,
          // },
          localFilter: (opt) => opt.schemeCategoryName === 'Corporate',
          isDisabled: (row) => !this.isCorporate(row),
          onChange: ({ val, option, row, onValueChange }) => {
            let { rows } = this.props
            if (!row.id) {
              rows = rows.concat([
                row,
              ])
            }
            const ctSchemeTypes = this.props.codetable[
              ctSchemeType.toLowerCase()
            ]
            const st = ctSchemeTypes.find((o) => o.id === row.schemeTypeFK)
            // console.log(st)
            const rs = rows.filter(
              (o) =>
                !o.isDeleted &&
                o.coPaymentSchemeFK === val &&
                st.code === 'CORPORATE' &&
                o.id !== row.id,
            )
            if (rs.length >= 1) {
              row.coPaymentSchemeFK = undefined

              notification.error({
                message: 'The Schemes record already exists in the system',
              })
            }
          },
        },
        {
          columnName: 'accountNumber',
          sortingEnabled: false,
          isDisabled: (row) => {
            return !this.isCorporate(row)
          },
        },
      ],
    }

    this.commitChanges = ({ rows, added, changed, deleted }) => {
      const { setFieldValue } = this.props
      const newRows = this.getSortedRows(rows)
      newRows.forEach((r, i) => {
        if (r.validRange && !this.isMedisaveOrPHPC(r)) {
          r.validFrom = r.validRange[0]
          r.validTo = r.validRange[1]
        } else {
          r.validRange = []
          r.validFrom = ''
          r.validTo = ''
        }
        r.sequence = this.isCorporate(r) ? i : 0
      })

      setFieldValue('patientScheme', newRows)
    }
  }

  isPHPC = (row) => {
    const { codetable } = this.props
    const ctSchemeTypes = codetable[ctSchemeType.toLowerCase()] || []
    const r = ctSchemeTypes.find((o) => o.id === row.schemeTypeFK)
    return r && r.code.startsWith('PHPC')
  }

  isCorporate = (row) => {
    const { codetable } = this.props
    const ctSchemeTypes = codetable[ctSchemeType.toLowerCase()] || []
    const r = ctSchemeTypes.find((o) => o.id === row.schemeTypeFK)
    return r && r.code.toUpperCase() === 'CORPORATE'
  }

  isCHAS = (schemeTypeFK) => {
    const { codetable } = this.props
    const ctSchemeTypes = codetable[ctSchemeType.toLowerCase()] || []
    const r = ctSchemeTypes.find((o) => o.id === schemeTypeFK)
    return r && r.code.startsWith('CHAS')
  }

  isExistingRow = (row) => {
    if (this.isCHAS(row.schemeTypeFK) && row.id && row.id > 0) {
      return true
    }
    return false
  }

  isMedisaveOrPHPC = (row) => {
    const { codetable } = this.props
    // const r = schemeTypes.find((o) => o.id === row.schemeTypeFK)

    const ctSchemeTypes = codetable[ctSchemeType.toLowerCase()] || []
    const r = ctSchemeTypes.find((o) => o.id === row.schemeTypeFK)

    if (!r) return false
    return (
      [
        'MEDI500VISUT',
        'FLEXIMEDI',
        'OPSCAN',
      ].indexOf(r.code) >= 0 || r.code.startsWith('PHPC')
    )
  }

  medisaveCheck = (row) => {
    const { codetable } = this.props
    const schemeTypes = codetable[ctSchemeType.toLowerCase()] || []

    const r = schemeTypes.find((o) => o.id === row.schemeTypeFK)

    if (!r) return false
    return (
      [
        'MEDI500VISUT',
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

  render () {
    const { editingRowIds, rowChanges } = this.state
    const { type, rows, schema, errors } = this.props
    console.log('schema', schema, errors)
    const EditingProps = {
      showAddCommand: true,

      onCommitChanges: this.commitChanges,
    }
    // console.log({ props: this.props })
    return (
      <EditableTableGrid
        rows={this.getSortedRows(rows)}
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
