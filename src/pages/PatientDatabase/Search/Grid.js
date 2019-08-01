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
        { name: 'lastPayment', title: 'Last Visit Date' },
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
        // {
        //   columnName: 'status',
        //   type: 'select',
        //   options: status,
        //   label: 'Status',
        // },
        {
          columnName: 'gender/age',
          render: (row) => {
            // console.log(row)
            return `${row.gender.substring(0, 1)}/${row.age}`
          },
          sortBy: 'genderFK',
        },
        { columnName: 'dob', type: 'date' },
        { columnName: 'race', sortBy: 'raceFK' },
        { columnName: 'lastPayment', type: 'date' },
        {
          columnName: 'action',
          align: 'center',
          render: (row) => {
            const { renderActionFn = (f) => f } = props
            return renderActionFn(row)
          },
        },
      ],
      FuncProps: {
        pager: true,
        filter: true,
      },
    }
  }

  render () {
    const { patientSearch, onRowDblClick } = this.props

    return (
      <React.Fragment>
        <CommonTableGrid
          type='patientSearch'
          entity={patientSearch}
          onRowDoubleClick={onRowDblClick}
          {...this.tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
