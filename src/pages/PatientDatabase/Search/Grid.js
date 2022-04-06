import React, { PureComponent } from 'react'
import { statusString } from '@/utils/codes'
import { CommonTableGrid } from '@/components'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import Authorized from '@/utils/Authorized'

class Grid extends PureComponent {
  state = {}

  constructor (props) {
    super(props)

    this.tableParas = {
      columns: [
        { name: 'patientReferenceNo', title: 'Ref. No.' },
        { name: 'patientAccountNo', title: 'Acc. No.' },
        { name: 'name', title: 'Patient Name' },
        // { name: 'lastVisitDate', title: 'Last Visit Date' },
        // { name: 'status', title: 'Status' },
        { name: 'gender/age', title: 'Gender / Age' },
        { name: 'dob', title: 'DOB' },
        // { name: 'race', title: 'Race' },
        // { name: 'nationality', title: 'Nationality' },
        { name: 'mobileNo', title: 'Mobile No.' },
        // { name: 'homeNo', title: 'Home No.' },
        // { name: 'officeNo', title: 'Office No.' },
        // { name: 'outstandingBalance', title: 'Total O/S Balance' },
        { name: 'action', title: 'Action' },
      ],
      columnExtensions: [
        // {
        //   columnName: 'lastVisitDate',
        //   type: 'date',
        //   sortingEnabled: false,
        // },
        {
          columnName: 'gender/age',
          render: row =>
            `${row.gender.substring(0, 1)}/${calculateAgeFromDOB(row.dob)}`,
          sortingEnabled: false,
        },
        {
          columnName: 'dob',
          type: 'date',
          sortingEnabled: false,
        },
        // {
        //   columnName: 'race',
        //   sortingEnabled: false,
        // },
        {
          columnName: 'action',
          align: 'center',
          sortingEnabled: false,
          render: row => {
            const { renderActionFn = f => f } = props
            return (
              <Authorized authority='patientdatabase.patientprofiledetails'>
                {renderActionFn(row)}
              </Authorized>
            )
          },
        },
        // {
        //   columnName: 'status',
        //   sortBy: 'isActive',
        //   type: 'select',
        //   sortingEnabled: false,
        //   options: statusString,
        //   align: 'center',
        //   width: 90,
        // },
        // {
        //   columnName: 'nationality',
        //   sortingEnabled: false,
        // },
        { columnName: 'mobileNo', sortingEnabled: false },
        // { columnName: 'homeNo', sortingEnabled: false },
        // { columnName: 'officeNo', sortingEnabled: false },
        // {
        //   columnName: 'outstandingBalance',
        //   type: 'number',
        //   currency: true,
        //   sortingEnabled: false,
        // },
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
      height,
    } = this.props
    return (
      <React.Fragment>
        <CommonTableGrid
          type='patientSearch'
          entity={patientSearch}
          forceRender
          TableProps={{ height }}
          onRowDoubleClick={onRowDblClick}
          {...this.tableParas}
          {...overrideTableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
