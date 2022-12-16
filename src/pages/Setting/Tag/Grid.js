import React, { PureComponent } from 'react'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'
import Edit from '@material-ui/icons/Edit'

class Grid extends PureComponent {
  editRow = row => {
    const { dispatch, settingTag } = this.props

    const { list } = settingTag
    dispatch({
      type: 'settingTag/updateState',
      payload: {
        showModal: true,
        entity: list.find(o => o.id === row.id),
      },
    })
  }

  render() {
    const { height, tagCategoryOptions } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingTag'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        columns={[
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'category', title: 'Category' },
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          {
            columnName: 'category',
            render: row => {
              const { name: category } = tagCategoryOptions.find(
                x => x.value == row.category,
              ) || { name: row.category }
              return (
                <Tooltip title={category}>
                  <span>{category}</span>
                </Tooltip>
              )
            },
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            align: 'center',
            type: 'select',
            width: 100,
            options: status,
          },
          {
            columnName: 'action',
            align: 'center',
            sortingEnabled: false,
            width: 100,
            render: row => {
              return (
                <Tooltip title='Edit Tag' placement='top-end'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 0 }}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
