import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import numeral from 'numeral'
import {
  CommonTableGrid,
  EditableTableGrid,
  Button,
  Popconfirm,
  Tooltip,
  NumberInput,
  Select,
  Checkbox,
  TextField,
  GridItem,
} from '@/components'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'
import NearAddODOS from './NearAddODOS'

export default ({
  dispatch,
  classes,
  from,
  codetable,
  setArrayValue,
  ...restProps
}) => {
  const { rows = [], isEditable = true, schema } = restProps

  const tableParas = {
    columns: [
      { name: 'NearAdd', title: ' ' },
      { name: 'OD', title: 'OD' },
      { name: 'OS', title: 'OS' },
    ],

    columnExtensions: [
      {
        columnName: 'NearAdd',
        type: 'text',
        width: 130,
        editingEnabled: false,
        sortingEnabled: false,
        disabled: true,
        render: () => {
          return (
            <GridItem>
              <TextField text value='Near Add:' />
            </GridItem>
          )
        },
      },

      {
        columnName: 'OD',
        isReactComponent: true,
        render: NearAddODOS,
        editingEnabled: isEditable,
        sortingEnabled: false,
        align: 'center',
      },
      {
        columnName: 'OS',
        isReactComponent: true,
        render: NearAddODOS,
        editingEnabled: isEditable,
        sortingEnabled: false,
        align: 'center',
      },
    ],
  }
  return (
    <EditableTableGrid
      id='enarAddGrid'
      size='sm'
      style={{ margin: 0 }}
      rows={rows}
      schema={schema}
      FuncProps={{
        pager: false,
        edit: isEditable,
      }}
      EditingProps={{
        showAddCommand: false,
        showEditCommand: false,
        showDeleteCommand: false,
        onCommitChanges: setArrayValue,
        // onAddedRowsChange: addedRowsChange,
      }}
      {...tableParas}
    />
  )
}
