import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import { getAppendUrl } from '@/utils/utils'
import { status } from '@/utils/codes'

import { Button, CommonModal, CommonTableGrid } from '@/components'

class Grid extends PureComponent {
  state = {}

  constructor (props) {
    super(props)

    this.tableParas = {
      columns: [
        { name: 'patientReferenceNo', title: 'Ref. No.' },
        { name: 'patientAccountNo', title: 'Acc. No.' },
        { name: 'name', title: 'Patient Name' },
        { name: 'lastVisitDate', title: 'Last Visit Date' },
        { name: 'status', title: 'Status' },
        { name: 'gender/age', title: 'Gender / Age' },
        { name: 'dob', title: 'DOB' },
        { name: 'race', title: 'Race' },
        { name: 'nationality', title: 'Nationality' },
        { name: 'mobileNo', title: 'Mobile No.' },
        { name: 'homeNo', title: 'Home No.' },
        { name: 'officeNo', title: 'Office No.' },
        { name: 'action', title: 'Action' },
      ],
      columnExtensions: [
        {
          columnName: 'lastVisitDate',
          type: 'date',
          sortingEnabled: false,
        },
        {
          columnName: 'gender/age',
          render: (row) => {
            // console.log(row)
            return `${row.gender.substring(0, 1)}/${row.age}`
          },
          sortBy: 'genderFkNavigation.displayValue',
        },
        { columnName: 'dob', type: 'date' },
        { columnName: 'race', sortBy: 'raceFkNavigation.displayValue' },
        { columnName: 'lastPayment', type: 'date' },
        {
          columnName: 'action',
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            const { renderActionFn = (f) => f } = props
            return renderActionFn(row)
          },
        },
        { columnName: 'status', sortBy: 'isActive' },
        {
          columnName: 'nationality',
          sortBy: 'nationalityFkNavigation.displayValue',
        },
        { columnName: 'mobileNo', sortingEnabled: false },
        { columnName: 'homeNo', sortingEnabled: false },
        { columnName: 'officeNo', sortingEnabled: false },
      ],
      FuncProps: {
        pager: true,
        filter: true,
      },
    }
  }

  render () {
    const {
      patientSearch,
      onRowDblClick,
      overrideTableParas = {},
      size = 'md',
    } = this.props

    return (
      <React.Fragment>
        <CommonTableGrid
          type='patientSearch'
          entity={patientSearch}
          onRowDoubleClick={onRowDblClick}
          {...this.tableParas}
          {...overrideTableParas}
          size={size}
        />
      </React.Fragment>
    )
  }
}

export default Grid
