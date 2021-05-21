import React, { useState } from 'react'
import Edit from '@material-ui/icons/Edit'

import { status } from '@/utils/codes'
import Authorized from '@/utils/Authorized'
import { Button, CommonTableGrid, Tooltip, notification } from '@/components'

const viewSchemDetailAuthority = 'scheme.schemedetails'

const Grid = ({ history, height }) => {
  const [tableParas] = useState({
    columns: [
      { name: 'coPayerType', title: 'Co-Payer Type' },
      { name: 'code', title: 'Scheme Code' },
      { name: 'name', title: 'Scheme Name' },
      { name: 'schemeTypeName', title: 'Scheme Type' },
      { name: 'coPayerName', title: 'Co-Payer Name' },
      { name: 'isActive', title: 'Status' },
      { name: 'description', title: 'Description' },
      { name: 'action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const editRow = (row, e) => {
    const accessRight = Authorized.check(viewSchemDetailAuthority)
    if (!accessRight || accessRight.rights !== 'enable') {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return
    }

    history.push(`/finance/scheme/details?id=${row.id}`)
  }

  const colExtenstions = [
    {
      columnName: 'schemeTypeName',
      sortBy: 'SchemeTypeFKNavigation.displayValue',
    },
    {
      columnName: 'coPayerType',
      sortBy: 'CopayerFKNavigation.copayerTypeFK',
    },
    {
      columnName: 'coPayerName',
      sortBy: 'CopayerFKNavigation.displayValue',
    },
    {
      columnName: 'isActive',
      sortingEnabled: false,
      type: 'select',
      options: status,
    },
    {
      columnName: 'action',
      align: 'center',
      render: row => (
        <Authorized authority={viewSchemDetailAuthority}>
          <Tooltip title='Edit' placement='bottom'>
            <Button
              size='sm'
              onClick={() => editRow(row)}
              justIcon
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          </Tooltip>
        </Authorized>
      ),
    },
  ]

  return (
    <React.Fragment>
      <CommonTableGrid
        type='copaymentScheme'
        columnExtensions={colExtenstions}
        onRowDoubleClick={editRow}
        TableProps={{
          height,
        }}
        {...tableParas}
      />
    </React.Fragment>
  )
}
export default Grid
