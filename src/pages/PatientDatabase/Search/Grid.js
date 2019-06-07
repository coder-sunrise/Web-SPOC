import React, { PureComponent } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { Tooltip, withStyles } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import { getAppendUrl } from '@/utils/utils'
import { status } from '@/utils/codes'

import { Button, CommonModal, CommonTableGrid2 } from '@/components'

class Grid extends PureComponent {
  state = {
    tableParas: {
      columns: [
        { name: 'patientReferenceNo', title: 'Reference No.' },
        { name: 'patientAccountNo', title: 'Account No.' },
        { name: 'name', title: 'Patient Name' },
        { name: 'lastPayment', title: 'Last Visit Date' },
        { name: 'status', title: 'Status' },
        { name: 'gender', title: 'Gender' },
        { name: 'dob', title: 'DOB' },
        { name: 'race', title: 'Race' },
        { name: 'language', title: 'Prefered Language' },
        { name: 'nationality', title: 'Nationality' },
        { name: 'mobileNo', title: 'Mobile No.' },
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
        { columnName: 'dob', type: 'date' },
        { columnName: 'lastPayment', type: 'date' },
      ],
      // leftColumns: [
      //   'PatientReferenceNo',
      //   'PatientAccountNo',
      //   'Name',
      //   'lastPayment',
      // ],
    },
  }

  componentDidMount () {
    // this.props.dispatch({
    //   type: queryType,
    //   // filter:
    // })
  }

  Cell = ({ column, row, dispatch, classes, renderActionFn, ...props }) => {
    // console.log(this)
    if (column.name === 'action') {
      return <Table.Cell {...props}>{renderActionFn(row)}</Table.Cell>
    }
    return <Table.Cell {...props} />
  }

  // search = (filter) => (gridParas) => {
  //   console.log(gridParas)
  //   const { callback, ...resetProps } = gridParas
  //   this.props
  //     .dispatch({
  //       type: 'patientSearch/query',
  //       payload: {
  //         ...filter,
  //         ...resetProps,
  //       },
  //     })
  //     .then(callback)
  //   // console.log(this)
  // }

  render () {
    const {
      patientSearch,
      dispatch,
      renderActionFn,
      onRowDblClick,
    } = this.props
    const { tableParas } = this.state

    const TableCell = (p) => this.Cell({ ...p, dispatch, renderActionFn })
    const ActionProps = { TableCellComponent: TableCell }
    return (
      <React.Fragment>
        <CommonTableGrid2
          // query={this.search(filter)}
          type='patientSearch'
          entity={patientSearch}
          ActionProps={ActionProps}
          FuncProps={{ pager: true, filter: true }}
          onRowDoubleClick={onRowDblClick}
          {...tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
