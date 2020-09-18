import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { 
  Button,
  CodeSelect, 
  CommonTableGrid,
  EditableTableGrid, 
  Tooltip,
  notification } from '@/components'
import Delete from '@material-ui/icons/Delete'
import { Radio } from 'antd'

@connect(({ codetable }) => ({ codetable }))
class MedisaveVaccinations extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  constructor (props) {
    super(props)

    const { title, titleChildren, dispatch, type } = props
    const { state } = this

    this.titleComponent = (
      <div style={{ position: 'relative' }}>
        {title}
        {titleChildren}
      </div>
    )

    this.tableParas = {
      columns: [
        { name: 'medisaveVaccinationFK', title: 'Medisave Vaccination' },
        { name: 'isDefault', title: 'Default' },
      ],
      columnExtensions: [
        {
          columnName: 'medisaveVaccinationFK',
          type: 'codeSelect',
          code: 'ctMedisaveVaccination',
          sortingEnabled: false,
          onChange: (row)=> {
            const { rows, setFieldValue } = this.props

            const newRows = rows.map((r) => {
              if (r.id === row.row.id) {
                return {
                  ...r,
                  medisaveVaccinationFK: row.row.medisaveVaccinationFK,
                }
              }
              return {
                ...r,
              }
            })

            setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)
          },
          render: (row) => {
            const { ctmedisavevaccination = [] } = this.props.codetable
            const medisaveVacc = ctmedisavevaccination.find(
              (item) => item.id === row.medisaveVaccinationFK,
            )
  
            return (
              <span>{medisaveVacc ? medisaveVacc.name : ''}</span>
            )
          },
        },
        {
          columnName: 'isDefault',
          type: 'radio',
          align: 'center',
          sortingEnabled: false,
          onChange: (row) => {
            const { rows, setFieldValue } = this.props

            const newRows = rows.map((r) => {
              if (r.id === row.row.id) {
                return {
                  ...r,
                  isDefault: true,
                }
              }
              return {
                ...r,
                isDefault: false,
              }
            })
            
            setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)
          },
          /* render: (row) => {
            return (
              <span>
                <Radio
                  checked={row.isDefault}
                  // onChange={() => this.changeIsDefault(row)}
                  disabled={row.isDefault}
                />
              </span>
            )
          }, */
        },
      ],
    }
    
    this.commitChanges = ({ rows, added, changed, deleted }) => {
      const { setFieldValue } = this.props
      setFieldValue('inventoryVaccination_MedisaveVaccination', rows)
      // return _newRows
    }
  }

  changeIsDefault = ({ row }) => {
    const { rows, setFieldValue } = this.props

    const newRows = rows.forEach((o) => {
        if(o.id !== row.id)
          o.isDefault = false
        else
          o.isDefault = true
    })

    setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)

  }

  handleDelete = ({ row }) => {
    const { rows, setFieldValue } = this.props

    const newRows = rows.forEach((o) => {
      if(o.id === row.id)
        o.isDeleted = true
    })

    setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)
  }

  isDuplicate = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const { schemeTypeFK } = changed[key]

    // not changing scheme type or scheme type is Corporate, skip all the checking
    if (!schemeTypeFK || schemeTypeFK === 15) return rows

    const hasDuplicate = key
      ? rows.filter((r) => !r.isDeleted && r.schemeTypeFK === schemeTypeFK)
          .length >= 2
      : []
    const chasSchemes = rows.filter(
      (r) => !r.isDeleted && this.isCHAS(r.schemeTypeFK),
    )
    const isCurrentSelectedCHAS = this.isCHAS(schemeTypeFK)

    let _newRows = [
      ...rows,
    ]

    if (hasDuplicate || (chasSchemes.length >= 2 && isCurrentSelectedCHAS)) {
      _newRows = _newRows.map(
        (r) =>
          r.id === parseInt(key, 10) ? { ...r, schemeTypeFK: undefined } : r,
      )
    }

    return _newRows
  }

  isExistingRow = (row) => {
    if (this.isCHAS(row.schemeTypeFK) && row.id && row.id > 0) {
      return true
    }
    return false
  }

  getSortedRows = (rows) => {
    return _.orderBy(rows, [
      'sequence',
      'schemeTypeFK',
    ])
  }

  render () {
    const { editingRowIds, rowChanges } = this.state
    const { type, rows, values, schema, errors } = this.props

    const EditingProps = {
      showAddCommand: true,

      onCommitChanges: this.commitChanges,
    }

    /* return <CommonTableGrid 
      rows={rows} 
      columns={this.tableParas.columns} 
      FuncProps={{ pager: false }}
      schema={schema}
      {...this.tableParas} 
    /> */
    return (
      <EditableTableGrid
        rows={rows}
        FuncProps={{ pager: false }}
        EditingProps={EditingProps}
        schema={schema}
        {...this.tableParas}
      />
    )
  }
}

export default MedisaveVaccinations
