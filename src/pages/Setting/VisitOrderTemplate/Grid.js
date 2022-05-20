import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import _ from 'lodash'
class Grid extends PureComponent {
  configs = {
    columns: [
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Display Value' },
      { name: 'description', title: 'Description' },
      { name: 'copayers', title: 'Co-Payer(s)' },
      { name: 'isActive', title: 'Status' },
      {
        name: 'action',
        title: 'Action',
      },
    ],
    columnExtensions: [
      { columnName: 'code', width: 200 },
      {
        columnName: 'description',
        render: row => {
          return <span>{row.description ? row.description : '-'}</span>
        },
      },
      {
        columnName: 'copayers',
        width: 300,
        sortingEnabled: false,
        render: row => {
          const copayers =
            row.visitOrderTemplate_Copayers.length > 0
              ? _.sortBy(row.visitOrderTemplate_Copayers, ['copayerName'])
                  .map(x => x.copayerName)
                  .join(', ')
              : '-'
          return (
            <Tooltip title={copayers}>
              <span>{copayers}</span>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'isActive',
        sortingEnabled: false,
        type: 'select',
        options: status,
        align: 'center',
        width: 100,
      },
      {
        columnName: 'action',
        align: 'center',
        render: row => {
          return (
            <Tooltip title='Edit Visit Purpose'>
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
            </Tooltip>
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, settingVisitOrderTemplate } = this.props
    const { list } = settingVisitOrderTemplate

    dispatch({
      type: 'settingVisitOrderTemplate/queryOne',
      payload: {
        id: row.id,
      },
    }).then(v => {
      if (v) {
        dispatch({
          type: 'settingVisitOrderTemplate/updateState',
          payload: {
            showModal: true,
          },
        })
      }
    })
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingVisitOrderTemplate'
        onRowDoubleClick={this.editRow}
        forceRender
        TableProps={{
          height,
        }}
        {...this.configs}
      />
    )
  }
}

export default Grid
