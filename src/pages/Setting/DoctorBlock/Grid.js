import React from 'react'
import moment from 'moment'
// material ui
import Edit from '@material-ui/icons/Edit'
// common components
import {
  dateFormatLong,
  timeFormat,
  Button,
  CommonTableGrid,
  Tooltip,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'

const TableParams = {
  FuncProps: { page: false },
  columns: [
    { name: 'doctorName', title: 'Doctor Name' },
    { name: 'startDate', title: 'Start Date' },
    { name: 'startTime', title: 'Start Time' },
    { name: 'endDate', title: 'End Date' },
    { name: 'endTime', title: 'End Time' },
    { name: 'remarks', title: 'Remarks' },

    { name: 'action', title: 'Action' },
  ],
}

export default ({ dataSource, onEditClick }) => {
  const editDoctorBlock = (event) => onEditClick(event.currentTarget.id)

  const columnExtensions = [
    {
      columnName: 'doctorName',
      render: (row) => <DoctorLabel doctor={row.doctor} />,
    },
    {
      columnName: 'startDate',
      render: (row) => moment(row.startDateTime).format(dateFormatLong),
    },
    {
      columnName: 'endDate',
      render: (row) => moment(row.endDateTime).format(dateFormatLong),
    },
    {
      columnName: 'startTime',
      render: (row) => moment(row.startDateTime).format(timeFormat),
    },
    {
      columnName: 'endTime',
      render: (row) => moment(row.endDateTime).format(timeFormat),
    },
    {
      align: 'center',
      columnName: 'action',
      // width: 240,
      render: (row) => (
        <Tooltip title='Edit Doctor Block'>
          <Button
            className='noPadding'
            color='primary'
            size='sm'
            id={row.id}
            justIcon
            rounded
            onClick={editDoctorBlock}
          >
            <Edit />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      rows={dataSource}
      {...TableParams}
      columnExtensions={columnExtensions}
    />
  )
}
