import React, { PureComponent } from 'react'

import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingReferralSource } = this.props

    const { list } = settingReferralSource

    dispatch({
      type: 'settingReferralSource/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingReferralSource'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'name', title: 'Name' },
          { name: 'mobileNum', title: 'Mobile No.' },
          { name: 'officeNum', title: 'Office No.' },
          { name: 'institution', title: 'Institution' },
          { name: 'department', title: 'Department' },
          { name: 'address', title: 'Address' },
          { name: 'email', title: 'Email' },
          { name: 'remarks', title: 'Remarks' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        columnExtensions={[
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            width: 120,
            align: 'center',
          },
          {
            columnName: 'sortOrder',
            width: 120,
            render: (row) => {
              return <p>{row.sortOrder === null ? '-' : row.sortOrder}</p>
            },
          },
          {
            columnName: 'action',
            align: 'center',
            width: 100,
            render: (row) => {
              return (
                <Tooltip title='Edit Referral Source' placement='bottom'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 0 }}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
