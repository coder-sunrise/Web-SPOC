import React, { memo } from 'react'
import { withStyles } from '@material-ui/core'
// common component
import { CommonTableGrid, EditableTableGrid } from '@/components'
// variables
import { tableConfig, getRowId } from '../variables'
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
  titleExtend,
  height,
  columns,
  colExtensions,
  data,
  ...props
}) => {

  return (
    <div className={classes.tableContainer}>
      <div><h5 style={{ display: 'inline-block' }}>{title}</h5>{titleExtend}</div>
      {idPrefix ? <CommonTableGrid
        size='sm'
        // height={height}
        getRowId={(r) => getRowId(r, idPrefix)}
        columns={columns}
        columnExtensions={colExtensions}
        rows={data}
        {...tableConfig}
        {...props}
      /> :
        <EditableTableGrid size='sm'
          columns={columns}
          columnExtensions={colExtensions}
          rows={data}
          {...tableConfig}
          {...props}
        />
      }
    </div>
  )
}

export default withStyles(styles, { name: 'DispenseTables' })(memo(TableData))
