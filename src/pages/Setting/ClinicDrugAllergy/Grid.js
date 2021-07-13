import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'sortOrder', title: 'Sort Order' },
      { name: 'isActive', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'code', width: 200 },
      {
        columnName: 'sortOrder',
        width: 120,
        render: (row) => {
          return <p>{row.sortOrder === null ? '-' : row.sortOrder}</p>
        },
      },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        align: 'center',
        width: 100,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          if(!row.isUserMaintainable)
            return null
          return (
            <Tooltip title='Edit Drug Allergy'>
              <Button
                size='sm'
                onClick={() => {
                  this.editRow(row)
                }}
                justIcon
                color='primary'
              >
                <Edit />
              </Button>
            </Tooltip>
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, settingClinicDrugAllergy } = this.props
    const { list } = settingClinicDrugAllergy
    const { isUserMaintainable } = row

    dispatch({
      type: 'settingClinicDrugAllergy/updateState',
      payload: {
        showModal: isUserMaintainable,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingClinicDrugAllergy'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        {...this.configs}
      />
    )
  }
}

export default Grid
