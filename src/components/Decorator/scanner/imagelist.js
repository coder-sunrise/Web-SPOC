import React, { useState } from 'react'

import { ImageSearch } from '@material-ui/icons'

import {
  GridItem,
  Button,
  Tooltip,
  EditableTableGrid,
  TextField,
  CommonTableGrid,
} from '@/components'

const base64Prefix = 'data:image/jpeg;base64,'

export const ImageList = ({ rows = [], handleCommitChanges }) => {
  const tableParas = {
    columns: [
      { name: 'uid', title: ' ' },
      { name: 'image', title: ' ' },
      { name: 'name', title: 'Name' },
    ],
    columnExtensions: [
      {
        columnName: 'uid',
        width: 1,
      },
      {
        columnName: 'image',
        width: 60,
        height: 50,
        disabled: true,
        sortingEnabled: false,
        render: (row) => {
          const base64Data = `${base64Prefix}${row.image}`
          return (
            <Tooltip
              arrow
              placement='left-end'
              title={
                <img alt={row.name} width={200} height={200} src={base64Data} />
              }
            >
              <div>
                <img alt={row.name} width={50} height={50} src={base64Data} />
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'name',
        sortingEnabled: false,
        type: 'text',
      },
    ],
  }

  const commitChanges = (row) => {
    console.log(row)
  }

  return (
    <GridItem xs={12} style={{ padding: 0, marginTop: 20 }}>
      <EditableTableGrid
        rows={rows}
        getRowId={(r) => r.uid}
        FuncProps={{
          edit: true,
          pager: false,
        }}
        EditingProps={{
          showAddCommand: false,
          showEditCommand: true,
          showDeleteCommand: true,
          onCommitChanges: commitChanges,
        }}
        {...tableParas}
      />
    </GridItem>
  )
}
