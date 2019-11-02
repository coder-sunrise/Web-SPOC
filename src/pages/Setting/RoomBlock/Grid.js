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
import { LoadingWrapper } from '@/components/_medisys'

const TableParams = {
  FuncProps: {
    pager: false,
    grouping: true,
  },
  columns: [
    { name: 'roomBlockGroupFK', title: 'Recurrence Group' },
    { name: 'roomName', title: 'Room' },
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
    let label = 'Room'
    const data = dataSource.find((item) => item.roomBlockGroupFK === row.value)
    if (data) {
      const { displayValue } = data.room
      label = `Room ${displayValue}`
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>{label}</span>
    )
  }

  const [
    expandedGroups,
    setExpandedGroups,
  ] = useState([])

  const handleExpandedGroupsChange = (e) => {
    setExpandedGroups(e)
  }

  const [
    tableConfig,
    setTableConfig,
  ] = useState(TableParams)

  useEffect(
    () => {
      if (dataSource) {
        let tempArray = []
        dataSource.forEach((o) => {
          tempArray.push(o.roomBlockGroupFK.toString())
        })

        setExpandedGroups(tempArray)
      }
    },
    [
      dataSource,
    ],
  )

  useEffect(
    () => {
      if (dataSource) {
        const tempTableConfig = {
          ...TableParams,
          FuncProps: {
            ...TableParams.FuncProps,
            groupingConfig: {
              state: {
                grouping: [
                  { columnName: 'roomBlockGroupFK' },
                ],
                expandedGroups: [
                  ...expandedGroups,
                ],
                onExpandedGroupsChange: handleExpandedGroupsChange,
              },
              row: {
                contentComponent: GroupCellContent,
              },
            },
          },
        }
        setTableConfig(tempTableConfig)
      }
    },
    [
      expandedGroups,
    ],
  )

  const editRoomBlock = (event) => onEditClick(event.currentTarget.id)

  const deleteRoomBlock = (event) => onDeleteClick(event.currentTarget.id)

  const handleDoubleClick = (row) => onEditClick(row.id)

  const columnExtensions = [
    {
      columnName: 'roomName',
      render: (row) => <p>Room {row.room.displayValue}</p>,
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
          <Tooltip title='Edit Room Block'>
            <Button
              className='noPadding'
              color='primary'
              size='sm'
              id={row.id}
              justIcon
              rounded
              onClick={editRoomBlock}
            >
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title='Delete Room Block'>
            <Button
              className='noPadding'
              color='danger'
              size='sm'
              id={row.id}
              justIcon
              rounded
              onClick={deleteRoomBlock}
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
      onRowDoubleClick={handleDoubleClick}
      columnExtensions={columnExtensions}
      {...tableConfig}
    />
  )
}
