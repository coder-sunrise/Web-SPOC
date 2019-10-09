import React, { useState, useEffect } from 'react'
import moment from 'moment'
// material ui
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
// common components
import {
  dateFormatLong,
  timeFormat,
  Button,
  CommonTableGrid,
  Tooltip,
} from '@/components'
import { DoctorLabel, LoadingWrapper } from '@/components/_medisys'

const TableParams = {
  FuncProps: {
    page: false,
    grouping: true,
  },
  columns: [
    { name: 'doctorBlockGroupFK', title: 'Recurrence Group' },
    { name: 'doctorName', title: 'Doctor Name' },
    { name: 'startDate', title: 'Start Date' },
    { name: 'startTime', title: 'Start Time' },
    { name: 'endDate', title: 'End Date' },
    { name: 'endTime', title: 'End Time' },
    { name: 'remarks', title: 'Remarks' },
    { name: 'action', title: 'Action' },
  ],
}

export default ({ dataSource, onEditClick, onDeleteClick }) => {
  const GroupCellContent = ({ row }) => {
    let label = 'Doctor'
    const data = dataSource.find(
      (item) => item.doctorBlockGroupFK === row.value,
    )
    if (data) {
      const { title = '', name } = data.doctor.clinicianProfile
      label = `${title} ${name}`
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>{label}</span>
    )
  }

  const [
    tableConfig,
    setTableConfig,
  ] = useState(TableParams)
  useEffect(
    () => {
      const tempTableConfig = {
        ...TableParams,
        FuncProps: {
          ...TableParams.FuncProps,
          groupingConfig: {
            state: {
              grouping: [
                { columnName: 'doctorBlockGroupFK' },
              ],
            },
            row: {
              contentComponent: GroupCellContent,
            },
          },
        },
      }
      setTableConfig(tempTableConfig)
    },
    [
      dataSource,
    ],
  )
  const editDoctorBlock = (event) => onEditClick(event.currentTarget.id)

  const deleteDoctorBlock = (event) => onDeleteClick(event.currentTarget.id)

  const columnExtensions = [
    {
      columnName: 'doctorName',
      sortBy: 'doctor.clinicianProfile.name',
      render: (row) => <DoctorLabel doctor={row.doctor} />,
    },
    {
      columnName: 'startDate',
      sortingEnabled: false,
      render: (row) => moment(row.startDateTime).format(dateFormatLong),
    },
    {
      columnName: 'endDate',
      sortingEnabled: false,
      render: (row) => moment(row.endDateTime).format(dateFormatLong),
    },
    {
      columnName: 'startTime',
      sortingEnabled: false,
      render: (row) => moment(row.startDateTime).format(timeFormat),
    },
    {
      columnName: 'endTime',
      sortingEnabled: false,
      render: (row) => moment(row.endDateTime).format(timeFormat),
    },
    {
      align: 'center',
      columnName: 'action',
      // width: 240,
      render: (row) => (
        <React.Fragment>
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
          <Tooltip title='Delete Doctor Block'>
            <Button
              className='noPadding'
              color='danger'
              size='sm'
              id={row.id}
              justIcon
              rounded
              onClick={deleteDoctorBlock}
            >
              <Delete />
            </Button>
          </Tooltip>
        </React.Fragment>
      ),
    },
  ]

  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      rows={dataSource}
      columnExtensions={columnExtensions}
      {...tableConfig}
    />
  )
}
