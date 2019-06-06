import React, { useState, useEffect } from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Tooltip, withStyles } from '@material-ui/core'
import { Textsms, Search } from '@material-ui/icons'
import { Button, CommonTableGrid2 } from '@/components'
import { compose } from 'redux'
import moment from 'moment'

const generateRowData = () => {
  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      id: `row-${i}-data`,
      patientName: `Tan ${i}`,
      contactNo: `1234567${i}`,
      upComingAppt: moment().format('DD-MMM-YYYY HH:MM'),
      remarks: '',
      doctor: 'Dr Levine',
      status: 'Confirmed',
      apptType: 'Screening',
    })
  }
  return data
}
const Grid = (props) => {
  // useEffect(() ={
  // },[])
  const { showSMSHistory } = props
  const [ selectedRows, setSelectedRows ] = useState([])

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection)
  }

  const gridGetRowID = (row) => row.id
  const Cell = ({ column, row, dispatch, classes, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='View SMS History' placement='bottom'>
            <Button
              size='sm'
              onClick={showSMSHistory}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Textsms />
            </Button>
          </Tooltip>
          {/* <Tooltip title='Edit' placement='bottom'>
            <Button
              size='sm'
              onClick={this.showDetail(row, 1)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          </Tooltip> */}
        </Table.Cell>
      )
    }
    return <Table.Cell {...p} />
  }

  const tableParas = {
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'contactNo', title: 'Contact No' },
      { name: 'upComingAppt', title: 'UpComing Appt.' },
      { name: 'remarks', title: 'Appt. Remarks' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'status', title: 'Status' },
      { name: 'apptType', title: 'Appt. Type' },
      { name: 'lastVisitDate', title: 'Last Visit Date' },
      { name: 'tag', title: 'Tag' },
      { name: 'lastSMSSent', title: 'Last SMS Sent' },
      { name: 'lastSMSReceived', title: 'Last SMS Received' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  }

  const colExtensions = [
    { columnName: 'Action', align: 'center' },
    // { columnName: 'Action', width: 110, align: 'center' },
    // { columnName: 'payments', type: 'number', currency: true },
    // { columnName: 'expenseAmount', type: 'number', currency: true },
  ]

  const { dispatch } = props
  const { list } = props
  const TableCell = (p) => Cell({ ...p, dispatch })
  const ActionProps = { TableCellComponent: TableCell }

  return (
    <React.Fragment>
      <CommonTableGrid2
        getRowId={gridGetRowID}
        rows={generateRowData()}
        onSelectionChange={handleSelectionChange}
        selection={selectedRows}
        columnExtensions={colExtensions}
        ActionProps={ActionProps}
        FuncProps={{ selectable: true }}
        {...tableParas}
      />
    </React.Fragment>
  )
}
export default compose(React.memo)(Grid)
