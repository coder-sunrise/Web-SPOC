import React, { PureComponent, Fragment } from 'react'

import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
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

  deleteRow = async (row, e) => {
    const { dispatch } = this.props

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Are you sure want to delete referral source ${row.name} ?`,
        onConfirmSave: async () => {
          await dispatch({
            type: 'settingReferralSource/deleteReferralSource',
            payload: {
              ...row,
              isDeleted: true,
            },
          }).then(() => {
            dispatch({
              type: 'settingReferralSource/query',
            })
          })
        },
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
          { name: 'mobileNo', title: 'Mobile No.' },
          { name: 'officeNo', title: 'Office No.' },
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
                <Fragment>
                  <Tooltip title='Edit Referral Source' placement='bottom'>
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
                  <Tooltip title='Delete Referral Source'>
                    <Button
                      size='sm'
                      onClick={() => {
                        this.deleteRow(row)
                      }}
                      justIcon
                      color='danger'
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </Fragment>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
