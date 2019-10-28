import React, { useState } from 'react'
import { Edit } from '@material-ui/icons'
import { status } from '@/utils/codes'
import Authorized from '@/utils/Authorized'
import { Button, CommonTableGrid, Tooltip } from '@/components'

const Grid = ({ history }) => {
  const [
    tableParas,
  ] = useState({
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
    history.push(`/finance/scheme/details?id=${row.id}`)
  }

  const colExtenstions = [
    {
      columnName: 'schemeTypeName',
      sortBy: 'SchemeTypeFKNavigation.displayValue',
    },
    {
      columnName: 'coPayerType',
      // type: 'codeSelect',
      // code: 'ctCopayerType',
      // labelField: 'displayValue',
      sortBy: 'CopayerFKNavigation.copayerTypeFK',
    },
    {
      columnName: 'coPayerName',
      // type: 'codeSelect',
      // code: 'ctCopayer',
      // labelField: 'displayValue',
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
      render: (row) => (
        /* <Tooltip title='Detail' placement='bottom'>
            <Button
              size='sm'
              onClick={showDetail(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Search />
            </Button>
          </Tooltip> */
        <Authorized authority='scheme.schemedetails'>
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
    // {
    //   columnName: 'isActive',
    //   sortingEnabled: false,
    //   type: 'select',
    //   options: status,
    // },
    // {
    //   columnName: 'supplier',
    //   type: 'select',
    //   options: suppliers,
    //   label: 'Supplier',
    // },
    // {
    //   columnName: 'dispUOM',
    //   align: 'select',
    //   options: dispUOMs,
    //   label: 'DispUOM',
    // },
    // { columnName: 'payments', type: 'number', currency: true },
    // { columnName: 'expenseAmount', type: 'number', currency: true },
  ]

  return (
    <React.Fragment>
      <CommonTableGrid
        type='copaymentScheme'
        columnExtensions={colExtenstions}
        onRowDoubleClick={editRow}
        // FuncProps={{ pager: true }}
        {...tableParas}
      />
    </React.Fragment>
  )
}
export default Grid
