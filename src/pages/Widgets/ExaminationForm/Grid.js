import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import {
  Button,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  EditableTableGrid,
} from '@/components'

const styles = (theme) => ({
  button: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: 0,
    textAlign: 'left',
    textTransform: 'none !important',
    '& p': {
      marginBottom: 0,
    },
  },
})

const Grid = ({
  classes,
  theme,
  EyeExaminations,
  isEditable = true,
  handleCommitChanges,
}) => {
  const tableParas = {
    columns: [
      { name: 'RightEye', title: 'Right Eye' },
      { name: 'EyeExaminationType', title: ' ' },
      { name: 'LeftEye', title: 'Left Eye' },
    ],

    columnExtensions: [
      {
        columnName: 'RightEye',
        align: 'center',
        sortingEnabled: false,
      },
      {
        columnName: 'EyeExaminationType',
        disabled: true,
        align: 'center',
        sortingEnabled: false,
      },
      {
        columnName: 'LeftEye',
        align: 'center',
        sortingEnabled: false,
      },
    ],
  }

  return (
    <GridContainer style={{ marginTop: theme.spacing(1) }}>
      <GridItem md={12}>
        <EditableTableGrid
          size='sm'
          rows={EyeExaminations}
          FuncProps={{
            pager: false,
            edit: isEditable,
          }}
          EditingProps={{
            showAddCommand: false,
            showEditCommand: isEditable,
            showDeleteCommand: false,
            onCommitChanges: handleCommitChanges,
          }}
          {...tableParas}
        />
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'Item' })(Grid)
