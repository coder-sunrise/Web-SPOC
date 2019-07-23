import React, { useState } from 'react'
import { compose } from 'redux'
import moment from 'moment'
// devexpress react grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// common components
import { CommonTableGrid2, Tooltip } from '@/components'
// medisys components
import { GridContextMenuButton } from 'medisys-components'

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
      reminderSent: 'Yes',
    })
  }
  return data
}
const Grid = ({ showSMSHistory, list, dispatch }) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])
  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns: [
      { name: 'patientName', title: 'Patient Name' },
      { name: 'contactNo', title: 'Contact No' },
      { name: 'upcomingAppt', title: 'Upcoming Appt.' },
      { name: 'remarks', title: 'Appt. Remarks' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'status', title: 'Appt. Status' },
      { name: 'apptType', title: 'Appt. Type' },
      { name: 'lastVisitDate', title: 'Last Visit Date' },
      { name: 'lastSMSStatus', title: 'Last SMS Status' },
      { name: 'lastSMSSent', title: 'Last SMS Sent' },
      { name: 'lastSMSReceived', title: 'Last SMS Received' },
      { name: 'reminderSent', title: 'Reminder Sent' },
      { name: 'Action', title: 'Action' },
    ],
    leftColumns: [],
  })
  const [
    colExtensions,
    setColExtensions,
  ] = useState([
    { columnName: 'Action', width: 120, align: 'center' },
  ])

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection)
  }

  const handleContextMenuClick = (recordRow, id) => {
    switch (id) {
      case '0':
        showSMSHistory()
        break
      default:
        break
    }
  }

  const gridGetRowID = (row) => row.id
  const Cell = ({ column, row, classes, ...props }) => {
    if (column.name === 'Action') {
      // return (
      //   <Table.Cell {...props}>
      //     <Tooltip title='View SMS History' placement='bottom'>
      //       <div>
      //         <Button
      //           size='sm'
      //           onClick={showSMSHistory}
      //           justIcon
      //           round
      //           color='primary'
      //         >
      //           <Textsms />
      //         </Button>
      //       </div>
      //     </Tooltip>
      //   </Table.Cell>
      // )
      return (
        <Table.Cell {...props}>
          <Tooltip title='View SMS History' placement='bottom'>
            <div style={{ display: 'inline-block' }}>
              <GridContextMenuButton
                row={row}
                onClick={handleContextMenuClick}
                contextMenuOptions={[
                  {
                    id: '0',
                    label: 'View SMS History',
                  },
                  {
                    id: '1',
                    label: 'Mark as Read',
                    disabled: true,
                  },
                  {
                    id: '2',
                    label: 'Mark as Unread',
                    disabled: true,
                  },
                ]}
              />
            </div>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

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
