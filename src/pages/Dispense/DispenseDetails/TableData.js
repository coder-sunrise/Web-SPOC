import React, { memo } from 'react'
import { withStyles } from '@material-ui/core'
// common component
import { CommonTableGrid } from '@/components'
// variables
import { tableConfig } from '../variables'
// utils
import { getUniqueGUID } from '@/utils/utils'

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
    const suffix = r.type
    if (idPrefix === 'otherOrders') {
      const itemFK = r.invoiceItemFK || r.sourceFK
      return `${idPrefix}-${r.id}-${itemFK}-${suffix}`
    }
    return `${idPrefix}-${r.id}-${suffix}`
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
