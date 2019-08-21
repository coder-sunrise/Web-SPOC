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
          onChange: ({ val, option, row, onValueChange }) => {
            console.log('schemeTypeFK')
            let rows = this.props.rows
            if (!row.id) {
              rows = rows.concat([
                row,
              ])
            }
            const ctSchemeTypes = this.props.codetable[
              ctSchemeType.toLowerCase()
            ]
            const st = ctSchemeTypes.find((o) => o.id === val)
            // console.log(st)
            const rs = rows.filter(
              (o) =>
                !o.isDeleted &&
                o.schemeTypeFK === val &&
                st.code !== 'Corporate' &&
                o.id !== row.id,
            )
            if (rs.length >= 1) {
              row.schemeTypeFK = undefined
              notification.error({
                message: 'The Schemes record already exists in the system',
              })
              return
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
              return
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
            if (st.code !== 'Corporate' && row.coPaymentSchemeFK) {
              row.coPaymentSchemeFK = undefined
              this.props.dispatch({
                // force current edit row components to update
                type: 'global/updateState',
                payload: {
                  commitCount: commitCount++,
                },
              })
            }
            if (this.isMedisave(row)) {
              row.validRange = []
              row.validFrom = undefined
              row.validTo = undefined
            }
          },
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
          onChange: ({ val, option, row, onValueChange }) => {
            // console.log(row)
            console.log('coPaymentSchemeFK')

            let rows = this.props.rows
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
                st.code === 'Corporate' &&
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
        if (r.validRange && !this.isMedisave(r)) {
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

  isCorporate = (row) => {
    return row.schemeTypeFK === 11
  }

  isCHAS = (schemeTypeFK) => {
    return schemeTypeFK <= 5
  }

  isMedisave = (row) => {
    const { codetable } = this.props
    // const r = schemeTypes.find((o) => o.id === row.schemeTypeFK)

    const ctSchemeTypes = codetable[ctSchemeType.toLowerCase()]
    const r = ctSchemeTypes
      ? ctSchemeTypes.find((o) => o.id === row.schemeTypeFK)
      : undefined

    if (!r) return false
    return (
      [
        'MEDI500VISUT',
        'FLEXIMEDI',
        'OPSCAN',
      ].indexOf(r.code) >= 0
    )
  }

  medisaveCheck = (row) => {
    const { codetable } = this.props
    const schemeTypes = codetable[ctSchemeType.toLowerCase()]

    const r = schemeTypes
      ? schemeTypes.find((o) => o.id === row.schemeTypeFK)
      : undefined

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
    const { type, rows, schema } = this.props

    const EditingProps = {
      showAddCommand: true,

      onCommitChanges: this.commitChanges,
    }

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
