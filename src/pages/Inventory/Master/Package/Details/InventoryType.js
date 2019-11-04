import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { GridItem, EditableTableGrid } from '@/components'

const styles = () => ({
  displayDiv: {
    float: 'right',
    padding: '20px',
  },

  tableHeader: {
    marginTop: 50,
  },

  tableSectionHeader: {
    fontWeight: 400,
    marginLeft: -15,
  },
})

const InventoryType = ({
  inventoryTypeProps,
  schema,
  rows,
  editingProps,
  title,
  style,
}) => {
  return (
    <GridItem xs={12}>
      <h4 style={style}>
        <b>{title}</b>
      </h4>
      <EditableTableGrid
        {...inventoryTypeProps}
        schema={schema}
        rows={rows}
        onRowDoubleClick={undefined}
        FuncProps={{ pager: false }}
        EditingProps={{ ...editingProps }}
      />
    </GridItem>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryType)
