import React, { memo } from 'react'
import { withStyles } from '@material-ui/core'
// common component
import { CommonTableGrid } from '@/components'
// variables
import { tableConfig } from '../variables'

const styles = (theme) => ({
  tableContainer: {
    margin: theme.spacing(1),
    '& > div:last-child': {
      marginBottom: theme.spacing(1.5),
    },
  },
})

const TableData = ({
  classes,
  idPrefix,
  title,
  height,
  columns,
  colExtensions,
  data,
  ...props
}) => {
  const getRowId = (r) => {
    if (idPrefix === 'otherOrders') {
      return `${idPrefix}-${r.id}-${r.sourceFK}`
    }
    return `${idPrefix}-${r.id}`
  }
  return (
    <div className={classes.tableContainer}>
      <h5>{title}</h5>
      <CommonTableGrid
        size='sm'
        // height={height}
        getRowId={getRowId}
        columns={columns}
        columnExtensions={colExtensions}
        rows={data}
        {...tableConfig}
        {...props}
      />
    </div>
  )
}

export default withStyles(styles, { name: 'DispenseTables' })(memo(TableData))
