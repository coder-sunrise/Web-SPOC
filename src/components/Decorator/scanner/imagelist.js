import React, { useState } from 'react'
import $ from 'jquery'
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

export const ImageList = ({ imgRows = [], handleCommitChanges }) => {
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
          const setSrc = (e, uid) => {
            const element = $(`img[uid='${uid}']`)[0]
            $(`#tip_${uid} img`)[0].src = element.src
          }
          return (
            <Tooltip
              id={`tip_${row.uid}`}
              arrow
              placement='left-end'
              onOpen={(e) => setSrc(e, row.uid)}
              title={<img alt={row.name} width={300} height={300} />}
            >
              <div>
                <img
                  uid={`${row.uid}`}
                  alt={row.name}
                  width={50}
                  height={50}
                  src=''
                />
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

  return (
    <EditableTableGrid
      rows={imgRows}
      getRowId={(r) => r.uid}
      // extraColumn={[]}
      FuncProps={{
        edit: true,
        pager: false,
      }}
      EditingProps={{
        showAddCommand: false,
        showEditCommand: true,
        showDeleteCommand: true,
        deleteConfirm: {
          show: true,
          title: 'Are you sure you want to delete this row?',
        },
        onCommitChanges: handleCommitChanges,
      }}
      {...tableParas}
    />
  )
}
