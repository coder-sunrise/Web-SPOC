import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { EditableTableGrid } from '@/components'

@connect(({ codetable }) => ({ codetable }))
class MedisaveVaccinations extends PureComponent {
  constructor (props) {
    super(props)

    const { title, titleChildren } = props

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
          width: '100px',
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
        },
      ],
    }
    
    this.commitChanges = ({ rows }) => {
      const { setFieldValue } = this.props
        
      const newRows = rows && rows.filter(r => !r.isDeleted).length === 1 
      ? rows.map(row => {
        return {
          ...row,
          isDefault: true,
        } // won't update in dto, only in ui
      })
      : rows
      setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)
      // return _newRows
    }
  }

  changeIsDefault = ({ row }) => {
    const { rows, setFieldValue } = this.props
    const newRows = rows.map((r) => {
      if (r === row.row) {
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
  }

  handleDelete = ({ row }) => {
    const { rows, setFieldValue } = this.props
    const newRows = rows.forEach((o) => {
      if(o.id === row.id)
        o.isDeleted = true
    })
    setFieldValue('inventoryVaccination_MedisaveVaccination', newRows)
  }

  render () {
    const { rows, schema } = this.props

    const EditingProps = {
      showAddCommand: true,
      onCommitChanges: this.commitChanges,
    }

    const newRows = rows && rows.filter(r => !r.isDeleted).length === 1 
    ? rows.map(row => {
      return {
        ...row,
        isDefault: true,
      } // won't update in dto, only in ui
    })
    : rows

    return (
      <EditableTableGrid
        rows={newRows}
        FuncProps={{ pager: false }}
        EditingProps={EditingProps}
        schema={schema}
        {...this.tableParas}
      />
    )
  }
}

export default MedisaveVaccinations
