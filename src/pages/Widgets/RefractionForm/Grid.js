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
} from '@/components'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'
import ODOS from './ODOS'

// console.log(orderTypes)
export default ({
  dispatch,
  classes,
  from,
  codetable,
  handleCommitChanges,
  handleSelectionChange,
  // selection,
  ...restProps
}) => {
  const { rows = [], isEditable = true, schema } = restProps

  const tableParas = {
    columns: [
      { name: 'IsSelected', title: ' ' },
      { name: 'EyeRefractionTestTypeFK', title: 'Select Test' },
      { name: 'OD', title: 'OD' },
      { name: 'OS', title: 'OS' },
    ],

    columnExtensions: [
      {
        columnName: 'IsSelected',
        width: 50,
        type: 'checkbox',
        sortingEnabled: false,
      },
      {
        columnName: 'EyeRefractionTestTypeFK',
        type: 'codeSelect',
        width: 130,
        code: 'cteyerefractiontesttype',
        editingEnabled: isEditable,
        sortingEnabled: false,
        disabled: !isEditable,
        onChange: (e) => {
          if (e.row) {
            if (e.option) e.row.EyeRefractionTestType = e.option.name
          }
        },
      },

      {
        columnName: 'OD',
        isReactComponent: true,
        render: ODOS,
        editingEnabled: isEditable,
        sortingEnabled: false,
        align: 'center',
      },
      {
        columnName: 'OS',
        isReactComponent: true,
        render: ODOS,
        editingEnabled: isEditable,
        sortingEnabled: false,
        align: 'center',
      },
    ],
    // onSelectionChange: handleSelectionChange,
    // selection,
  }

  return (
    <EditableTableGrid
      size='sm'
      style={{ margin: 0 }}
      rows={rows}
      schema={schema}
      // getRowId={(r) => {
      //   return r.id
      // }}
      FuncProps={{
        pager: false,
        edit: isEditable,
        // selectable: false,
        // selectConfig: {
        //   showSelectAll: false,
        //   rowSelectionEnabled: (row) => {
        //     return true
        //   },
        // },
      }}
      EditingProps={{
        showAddCommand: isEditable,
        showEditCommand: isEditable,
        showDeleteCommand: isEditable,
        onCommitChanges: handleCommitChanges,
      }}
      {...tableParas}
    />
  )
}
