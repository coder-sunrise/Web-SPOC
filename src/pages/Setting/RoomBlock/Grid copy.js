import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'

import {
  DataTypeProvider,
  TreeDataState, SortingState, SelectionState, FilteringState, PagingState,
  CustomTreeData, IntegratedFiltering, IntegratedPaging, IntegratedSorting, IntegratedSelection,
} from '@devexpress/dx-react-grid'
import {
  Table, TableHeaderRow, TableFilterRow, TableTreeColumn,
  PagingPanel, TableColumnResizing, Toolbar, TableColumnVisibility, ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui'
import * as service from './services'

class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'displayValue', title: 'Room' },
      { name: 'code', title: 'Code' },
      { name: 'description', title: 'Description' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <>
              <Button
                size='sm'
                onClick={() => {
                this.editRow(row)
              }}
                justIcon
                color='primary'
              >
                <Edit />
              </Button>
              <Button
                size='sm'
                onClick={() => {
                this.deleteRow(row)
              }}
                justIcon
                color='primary'
              >
                <Delete />
              </Button>
            </>
          )
        },
      },
    ],
    FuncProps: {
      // pager: true,
      tree:true,
      treeColumnConfig:{
        for:'name'
      }
      // grouping: true,
      // groupingConfig: {
      //   showToolbar: false,
      //   state: {
      //     grouping: [
      //       { columnName: 'displayValue' },
      //     ],
      //     // defaultExpandedGroups: [
      //     //   'Drug',
      //     //   'Service',
      //     // ],
      //   },
      // },
    },
  }

  editRow = (row, e) => {
    const { dispatch, settingRoomBlock } = this.props

    const { list } = settingRoomBlock
    dispatch({
      type: 'settingRoomBlock/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  deleteRow = (row, e) => {
    const { dispatch, settingRoomBlock } = this.props

    const { list } = settingRoomBlock
    dispatch({
      type: 'settingRoomBlock/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }



  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        // type='settingRoomBlock'
        rows={[{
          id:1,
          parentId:null,
          displayValue:1,
          code:'1c'
        },{
          id:2,
          parentId:1,
          displayValue:2,
          code:'2c'
        },{
          id:3,
          parentId:null,
          displayValue:3,
          code:'3c'
        }]}
        onRowDoubleClick={this.editRow}

        {...this.configs}
      />
    )
  }
}

export default Grid
